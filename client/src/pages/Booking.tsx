import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import StepIndicator from "@/components/StepIndicator";
import ServiceCard from "@/components/ServiceCard";
import TimeSlotCard from "@/components/TimeSlotCard";
import BookingSummary from "@/components/BookingSummary";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Users, Gift, Loader2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import Footer from "@/components/Footer";

const SERVICE_TYPES = [
  {
    id: "quadra",
    icon: CalendarIcon,
    title: "Quadra",
    description: "Reserve horários para jogar",
    allowMultiple: true,
  },
  {
    id: "evento",
    icon: Users,
    title: "Evento",
    description: "Organize seu evento",
    allowMultiple: false,
  },
  {
    id: "festa",
    icon: Gift,
    title: "Festa",
    description: "Comemore com estilo",
    allowMultiple: false,
  },
];

const STEPS = [
  { number: 1, title: "Tipo e Data" },
  { number: 2, title: "Horários" },
  { number: 3, title: "Dados" },
  { number: 4, title: "Confirmação" },
];

export default function Booking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState<string>("");
  const [date, setDate] = useState<Date>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [observations, setObservations] = useState("");
  const [extraHalfHour, setExtraHalfHour] = useState(false);

  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<any>(null);

  const selectedService = SERVICE_TYPES.find((s) => s.id === serviceType);
  const pricePerSlot = serviceType === "quadra" ? 100 : 500;
  const halfHourPrice = serviceType === "quadra" ? pricePerSlot / 2 : 0;

  const {
    data: availabilityData,
    isLoading: isLoadingSlots,
    refetch: refetchAvailability,
  } = useQuery({
    queryKey: [
      "/api/availability",
      date?.toISOString().split("T")[0],
      serviceType,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/availability?date=${
          date?.toISOString().split("T")[0]
        }&serviceType=${serviceType}`
      );
      return await response.json();
    },
    enabled: false,
  });

  // Limpar horários selecionados quando o tipo de serviço mudar
  useEffect(() => {
    setSelectedSlots([]);
    setExtraHalfHour(false);
    // Se estiver no step 2, recarregar disponibilidade com novo tipo
    if (currentStep === 2 && serviceType && date) {
      refetchAvailability();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  useEffect(() => {
    if (selectedSlots.length === 0) {
      setExtraHalfHour(false);
    }
  }, [selectedSlots]);

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      return await response.json();
    },
    onSuccess: (data: any) => {
      setLocation(`/confirmacao/${data.bookingNumber}`);
    },
    onError: (error: any) => {
      if (error.error === "Conflito de horário") {
        setConflictData(error);
        setShowConflictDialog(true);
      } else {
        toast({
          title: "Erro ao criar reserva",
          description: error.message || "Tente novamente mais tarde",
          variant: "destructive",
        });
      }
    },
  });

  const timeSlots = (availabilityData as any)?.slots || [];

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleServiceSelect = (id: string) => {
    // Limpar horários selecionados ao mudar o tipo de serviço
    if (serviceType !== id) {
      setSelectedSlots([]);
    }
    setServiceType(id);
    console.log("Service selected:", id);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (
      selectedDate &&
      selectedDate >= new Date(new Date().setHours(0, 0, 0, 0))
    ) {
      setDate(selectedDate);
      console.log("Date selected:", selectedDate);
    } else {
      toast({
        title: "Data inválida",
        description: "Por favor, selecione uma data futura.",
        variant: "destructive",
      });
    }
  };

  const handleSlotToggle = (time: string) => {
    if (selectedService?.allowMultiple) {
      setSelectedSlots((prev) =>
        prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
      );
    } else {
      setSelectedSlots([time]);
    }
    console.log("Slot toggled:", time);
  };

  const goToStep2 = async () => {
    if (!serviceType || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo de serviço e a data.",
        variant: "destructive",
      });
      return;
    }
    // Limpar horários selecionados ao mudar de passo ou tipo de serviço
    setSelectedSlots([]);
    setCurrentStep(2);
    // Forçar recarregamento sem cache
    await refetchAvailability({ cancelRefetch: true });
  };

  const goToStep3 = () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "Selecione um horário",
        description: "Escolha pelo menos um horário disponível.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(3);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    return (
      name.length >= 3 &&
      phone.replace(/\D/g, "").length >= 10 &&
      validateEmail(email)
    );
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Formulário incompleto",
        description: "Preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }

    if (!date || !serviceType) return;

    // Calcular valor baseado no tipo de serviço
    const isQuadra = serviceType === "quadra";
    const pricePerSlot = isQuadra ? 100 : 500; // R$ 100 para quadra, R$ 500 para festa/evento
    const extraCost = isQuadra && extraHalfHour ? pricePerSlot / 2 : 0;
    const totalAmount = isQuadra
      ? selectedSlots.length * pricePerSlot + extraCost
      : pricePerSlot; // Festa/evento: valor fixo de R$ 500

    // Formatar data no formato ISO (YYYY-MM-DD) para consistência com o backend
    const formattedDate = date.toISOString().split("T")[0];

    createBookingMutation.mutate({
      serviceType: selectedService?.title || serviceType,
      date: formattedDate,
      timeSlots: selectedSlots,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      observations: extraHalfHour
        ? observations
          ? `${observations}\nInclui 30 minutos adicionais.`
          : "Inclui 30 minutos adicionais."
        : observations || undefined,
      totalAmount: totalAmount,
      cancelled: false,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              {currentStep === 1 && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Selecione o Tipo de Serviço
                    </h2>
                    <p className="text-muted-foreground">
                      Escolha entre quadra, evento ou festa
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {SERVICE_TYPES.map((service) => (
                      <ServiceCard
                        key={service.id}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        selected={serviceType === service.id}
                        onClick={() => handleServiceSelect(service.id)}
                      />
                    ))}
                  </div>

                  {serviceType && (
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold">Selecione a Data</h3>
                      <div className="flex justify-center">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          className="rounded-md border"
                          data-testid="calendar-date"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={goToStep2}
                    disabled={!serviceType || !date}
                    className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]"
                    size="lg"
                    data-testid="button-next-step1"
                  >
                    Próximo
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      Selecione os Horários
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedService?.allowMultiple
                        ? "Escolha um ou mais horários disponíveis"
                        : "Escolha um horário disponível"}
                    </p>
                  </div>

                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {timeSlots.map((slot: any) => (
                        <TimeSlotCard
                          key={slot.time}
                          time={slot.time}
                          available={slot.available}
                          selected={selectedSlots.includes(slot.time)}
                          onClick={() => handleSlotToggle(slot.time)}
                        />
                      ))}
                    </div>
                  )}

                  {serviceType === "quadra" && selectedSlots.length > 0 && (
                    <Button
                      variant={extraHalfHour ? "default" : "outline"}
                      onClick={() => setExtraHalfHour((prev) => !prev)}
                      className={cn(
                        "justify-center sm:self-start",
                        extraHalfHour &&
                          "bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] text-white hover:opacity-90"
                      )}
                    >
                      {extraHalfHour
                        ? "Remover 30 minutos extras"
                        : `Adicionar 30 minutos (+${formatCurrency(
                            halfHourPrice
                          )})`}
                    </Button>
                  )}

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                      data-testid="button-back-step2"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={goToStep3}
                      disabled={selectedSlots.length === 0}
                      className="flex-1 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]"
                      data-testid="button-next-step2"
                    >
                      Próximo
                    </Button>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Seus Dados</h2>
                    <p className="text-muted-foreground">
                      Preencha suas informações para finalizar
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        className={cn(
                          name.length > 0 &&
                            (name.length >= 3
                              ? "border-l-4 border-l-green-500"
                              : "border-l-4 border-l-red-500")
                        )}
                        data-testid="input-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="(00) 00000-0000"
                        className={cn(
                          phone.length > 0 &&
                            (phone.replace(/\D/g, "").length >= 10
                              ? "border-l-4 border-l-green-500"
                              : "border-l-4 border-l-red-500")
                        )}
                        data-testid="input-phone"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className={cn(
                          email.length > 0 &&
                            (validateEmail(email)
                              ? "border-l-4 border-l-green-500"
                              : "border-l-4 border-l-red-500")
                        )}
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="observations">
                        Observações (opcional)
                      </Label>
                      <Textarea
                        id="observations"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Alguma informação adicional?"
                        rows={4}
                        data-testid="input-observations"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                      className="flex-1"
                      data-testid="button-back-step3"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !validateForm() || createBookingMutation.isPending
                      }
                      className="flex-1 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]"
                      data-testid="button-confirm"
                    >
                      {createBookingMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processando...
                        </>
                      ) : (
                        "Confirmar Reserva"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              <BookingSummary
                serviceType={selectedService?.title}
                date={date}
                timeSlots={selectedSlots}
                pricePerSlot={serviceType === "quadra" ? 100 : 500}
                isQuadra={serviceType === "quadra"}
                extraHalfHour={extraHalfHour}
                halfHourPrice={halfHourPrice}
              />
            </div>
          </div>
        </div>
      </main>

      <AlertDialog
        open={showConflictDialog}
        onOpenChange={setShowConflictDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Horário Indisponível</AlertDialogTitle>
            <AlertDialogDescription>
              {conflictData?.message}
              {conflictData?.availableSlots &&
                conflictData.availableSlots.length > 0 && (
                  <>
                    <br />
                    <br />
                    <strong>Horários alternativos disponíveis:</strong>
                    <ul className="mt-2 space-y-1">
                      {conflictData.availableSlots.map((slot: string) => (
                        <li key={slot} className="text-sm">
                          • {slot}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowConflictDialog(false);
                setCurrentStep(2);
              }}
            >
              Escolher Outros Horários
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}

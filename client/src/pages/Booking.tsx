import { useState } from "react";
import { useLocation } from "wouter";
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
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon, Users, Gift, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

//todo: remove mock functionality
const MOCK_TIME_SLOTS = [
  { time: '08:00 - 09:00', available: true },
  { time: '09:00 - 10:00', available: false },
  { time: '10:00 - 11:00', available: true },
  { time: '11:00 - 12:00', available: true },
  { time: '13:00 - 14:00', available: true },
  { time: '14:00 - 15:00', available: false },
  { time: '15:00 - 16:00', available: true },
  { time: '16:00 - 17:00', available: true },
  { time: '17:00 - 18:00', available: true },
  { time: '18:00 - 19:00', available: true },
  { time: '19:00 - 20:00', available: false },
  { time: '20:00 - 21:00', available: true },
];

const SERVICE_TYPES = [
  { 
    id: 'quadra', 
    icon: CalendarIcon, 
    title: 'Quadra', 
    description: 'Reserve horários para jogar',
    allowMultiple: true 
  },
  { 
    id: 'evento', 
    icon: Users, 
    title: 'Evento', 
    description: 'Organize seu evento esportivo',
    allowMultiple: false 
  },
  { 
    id: 'festa', 
    icon: Gift, 
    title: 'Festa', 
    description: 'Comemore com estilo',
    allowMultiple: false 
  },
];

const STEPS = [
  { number: 1, title: 'Tipo e Data' },
  { number: 2, title: 'Horários' },
  { number: 3, title: 'Dados' },
  { number: 4, title: 'Confirmação' },
];

export default function Booking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState<string>('');
  const [date, setDate] = useState<Date>();
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const selectedService = SERVICE_TYPES.find(s => s.id === serviceType);
  
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };
  
  const handleServiceSelect = (id: string) => {
    setServiceType(id);
    console.log('Service selected:', id);
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && selectedDate >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setDate(selectedDate);
      console.log('Date selected:', selectedDate);
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
      setSelectedSlots(prev => 
        prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
      );
    } else {
      setSelectedSlots([time]);
    }
    console.log('Slot toggled:', time);
  };
  
  const loadTimeSlots = () => {
    setIsLoadingSlots(true);
    setTimeout(() => {
      setIsLoadingSlots(false);
      console.log('Time slots loaded');
    }, 800);
  };
  
  const goToStep2 = () => {
    if (!serviceType || !date) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo de serviço e a data.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(2);
    loadTimeSlots();
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
    return name.length >= 3 && 
           phone.replace(/\D/g, '').length >= 10 && 
           validateEmail(email);
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
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingId = `UNQ-${Math.floor(10000 + Math.random() * 90000)}`;
      console.log('Booking created:', bookingId);
      setLocation(`/confirmacao/${bookingId}`);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
          
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-8">
              {currentStep === 1 && (
                <>
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Selecione o Tipo de Serviço</h2>
                    <p className="text-muted-foreground">Escolha entre quadra, evento ou festa</p>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    {SERVICE_TYPES.map(service => (
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
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          className="rounded-md border"
                          data-testid="calendar-date"
                        />
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={goToStep2}
                    disabled={!serviceType || !date}
                    className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2]"
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
                    <h2 className="text-3xl font-bold mb-2">Selecione os Horários</h2>
                    <p className="text-muted-foreground">
                      {selectedService?.allowMultiple 
                        ? 'Escolha um ou mais horários disponíveis' 
                        : 'Escolha um horário disponível'}
                    </p>
                  </div>
                  
                  {isLoadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {MOCK_TIME_SLOTS.map(slot => (
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
                      className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]"
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
                    <p className="text-muted-foreground">Preencha suas informações para finalizar</p>
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
                          name.length > 0 && (name.length >= 3 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500")
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
                          phone.length > 0 && (phone.replace(/\D/g, '').length >= 10 ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500")
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
                          email.length > 0 && (validateEmail(email) ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500")
                        )}
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="observations">Observações (opcional)</Label>
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
                      disabled={!validateForm() || isSubmitting}
                      className="flex-1 bg-gradient-to-r from-[#667eea] to-[#764ba2]"
                      data-testid="button-confirm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Processando...
                        </>
                      ) : (
                        'Confirmar Reserva'
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
                pricePerSlot={50}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

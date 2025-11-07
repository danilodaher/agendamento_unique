import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, DollarSign } from "lucide-react";
import successImage from "@assets/generated_images/Success_confirmation_illustration_83a1c1d8.png";
import { formatCurrency } from "@/lib/utils";

interface ConfirmationCardProps {
  bookingId: string;
  serviceType: string;
  date: string;
  timeSlots: string[];
  name: string;
  email: string;
  phone: string;
  total: number;
  cancelToken?: string;
}

export default function ConfirmationCard({
  bookingId,
  serviceType,
  date,
  timeSlots,
  name,
  email,
  phone,
  total,
  cancelToken
}: ConfirmationCardProps) {
  // Formatar data para exibição (converter ISO para pt-BR se necessário)
  const formatDateForDisplay = (dateStr: string) => {
    // Se já estiver no formato pt-BR, retornar como está
    if (dateStr.includes('de')) {
      return dateStr;
    }
    // Se estiver no formato ISO (YYYY-MM-DD), converter para pt-BR
    const dateObj = new Date(dateStr + 'T00:00:00');
    return dateObj.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src={successImage} alt="Sucesso" className="w-32 h-32 object-contain" />
        </div>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">
          Reserva Confirmada!
        </h1>
        <p className="text-muted-foreground text-lg">
          Seu agendamento foi realizado com sucesso
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-semibold">Detalhes da Reserva</h2>
            <div className="font-mono text-sm bg-muted px-3 py-1 rounded-md" data-testid="text-booking-id">
              {bookingId}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Tipo</div>
                  <div className="font-semibold">{serviceType}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Data</div>
                  <div className="font-semibold">{formatDateForDisplay(date)}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Horários</div>
                  <div className="space-y-1">
                    {timeSlots.map((slot, idx) => (
                      <div key={idx} className="font-medium">{slot}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Nome</div>
                  <div className="font-semibold">{name}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Telefone</div>
                  <div className="font-semibold">{phone}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-semibold">{email}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(total)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row gap-3">
            {cancelToken && (
              <a href={`/cancelar/${cancelToken}`} className="flex-1">
                <Button variant="destructive" className="w-full" data-testid="button-cancel">
                  Cancelar Reserva
                </Button>
              </a>
            )}
            <a href="/" className="flex-1">
              <Button variant="default" className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]" data-testid="button-home">
                Voltar ao Início
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

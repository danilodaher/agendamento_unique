import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Calendar, Clock, User, Mail, Phone, DollarSign, CalendarDays } from "lucide-react";
import { SiGooglecalendar, SiApple } from "react-icons/si";
import successImage from "@assets/generated_images/Success_confirmation_illustration_83a1c1d8.png";

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
  const generateICalFile = () => {
    const startTime = timeSlots[0].split(' - ')[0];
    const endTime = timeSlots[timeSlots.length - 1].split(' - ')[1];
    
    const eventDate = new Date(date);
    const [startHour, startMin] = startTime.split(':');
    const [endHour, endMin] = endTime.split(':');
    
    const startDateTime = new Date(eventDate);
    startDateTime.setHours(parseInt(startHour), parseInt(startMin), 0);
    
    const endDateTime = new Date(eventDate);
    endDateTime.setHours(parseInt(endHour), parseInt(endMin), 0);
    
    const formatDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Unique//Booking System//PT',
      'BEGIN:VEVENT',
      `UID:${bookingId}@unique.com.br`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDateTime)}`,
      `DTEND:${formatDate(endDateTime)}`,
      `SUMMARY:${serviceType} - Unique`,
      `DESCRIPTION:Reserva ${bookingId}\\nContato: ${name}\\nTelefone: ${phone}`,
      `LOCATION:Unique - Complexo Esportivo`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    return ical;
  };
  
  const downloadICalFile = () => {
    const icalContent = generateICalFile();
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reserva-${bookingId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <img src={successImage} alt="Sucesso" className="w-32 h-32 object-contain" />
        </div>
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
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
                  <div className="font-semibold">{date}</div>
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
                  <div className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-semibold">Adicionar ao Calendário</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={downloadICalFile}
                data-testid="button-google-calendar"
              >
                <SiGooglecalendar className="w-4 h-4" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={downloadICalFile}
                data-testid="button-apple-calendar"
              >
                <SiApple className="w-4 h-4" />
                Apple
              </Button>
              <Button 
                variant="outline" 
                className="gap-2" 
                onClick={downloadICalFile}
                data-testid="button-outlook-calendar"
              >
                <CalendarDays className="w-4 h-4" />
                Outlook
              </Button>
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
              <Button variant="default" className="w-full bg-gradient-to-r from-[#667eea] to-[#764ba2]" data-testid="button-home">
                Voltar ao Início
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

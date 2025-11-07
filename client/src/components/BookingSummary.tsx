import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface BookingSummaryProps {
  serviceType?: string;
  date?: Date;
  timeSlots?: string[];
  pricePerSlot?: number;
  isQuadra?: boolean;
  extraHalfHour?: boolean;
  halfHourPrice?: number;
}

export default function BookingSummary({
  serviceType,
  date,
  timeSlots = [],
  pricePerSlot = 100,
  isQuadra = false,
  extraHalfHour = false,
  halfHourPrice = 0,
}: BookingSummaryProps) {
  // Quadra: R$ 100 por horário | Festa/Event
  // Se não for quadra e pricePerSlot não foi passado, usar 500 como padrão
  const actualPricePerSlot = isQuadra
    ? pricePerSlot
    : pricePerSlot === 100
    ? 500
    : pricePerSlot;
  const extraCost =
    isQuadra && extraHalfHour ? halfHourPrice || actualPricePerSlot / 2 : 0;
  const total = isQuadra
    ? timeSlots.length * actualPricePerSlot + extraCost
    : actualPricePerSlot;
  
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumo da Reserva</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {serviceType && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Tipo</div>
              <div className="font-semibold">{serviceType}</div>
            </div>
          </div>
        )}
        
        {date && (
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Data</div>
              <div className="font-semibold">
                {date.toLocaleDateString('pt-BR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
        )}
        
        {timeSlots.length > 0 && (
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-1" />
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">Horários</div>
              <div className="space-y-1">
                {timeSlots.map((slot, idx) => (
                  <div key={idx} className="text-sm font-medium">{slot}</div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {timeSlots.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              {isQuadra ? (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {timeSlots.length}x horários
                    </span>
                    <span>
                      {formatCurrency(timeSlots.length * actualPricePerSlot)}
                    </span>
                  </div>
                  {extraHalfHour && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        30 minutos extras
                      </span>
                      <span>{formatCurrency(extraCost)}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviço</span>
                  <span>{formatCurrency(actualPricePerSlot)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Total</span>
                </div>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

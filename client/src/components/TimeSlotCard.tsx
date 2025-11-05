import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface TimeSlotCardProps {
  time: string;
  available: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function TimeSlotCard({ time, available, selected, onClick }: TimeSlotCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 text-center transition-all relative",
        available 
          ? "cursor-pointer hover:scale-105" 
          : "opacity-50 cursor-not-allowed",
        available && !selected && "hover-elevate active-elevate-2",
        available && selected && "border-primary border-4",
        !available && "bg-occupied text-occupied-foreground"
      )}
      onClick={available ? onClick : undefined}
      data-testid={`slot-${time.replace(':', '-')}`}
    >
      <div className={cn(
        "font-semibold text-lg",
        !available && "text-white"
      )}>
        {time}
      </div>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      {!available && (
        <div className="text-sm mt-1 text-white">Ocupado</div>
      )}
    </Card>
  );
}

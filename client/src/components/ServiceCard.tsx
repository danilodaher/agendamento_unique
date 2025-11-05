import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function ServiceCard({ icon: Icon, title, description, selected, onClick }: ServiceCardProps) {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all hover:scale-105",
        selected 
          ? "bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-transparent" 
          : "hover-elevate active-elevate-2"
      )}
      onClick={onClick}
      data-testid={`card-service-${title.toLowerCase()}`}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center",
          selected ? "bg-white/20" : "bg-primary/10"
        )}>
          <Icon className={cn("w-8 h-8", selected ? "text-white" : "text-primary")} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className={cn("text-sm", selected ? "text-white/90" : "text-muted-foreground")}>
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all",
                step.number < currentStep && "bg-primary text-primary-foreground",
                step.number === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20 animate-pulse",
                step.number > currentStep && "bg-muted text-muted-foreground"
              )}>
                {step.number < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <div className={cn(
                "mt-2 text-sm font-medium text-center",
                step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={cn(
                "h-1 flex-1 mx-2 transition-all",
                step.number < currentStep ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

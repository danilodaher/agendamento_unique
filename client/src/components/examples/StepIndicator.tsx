import { useState } from 'react';
import StepIndicator from '../StepIndicator';
import { Button } from '@/components/ui/button';

export default function StepIndicatorExample() {
  const [currentStep, setCurrentStep] = useState(2);
  
  const steps = [
    { number: 1, title: 'Tipo e Data' },
    { number: 2, title: 'Horários' },
    { number: 3, title: 'Dados' },
    { number: 4, title: 'Confirmação' },
  ];
  
  return (
    <div className="p-6">
      <StepIndicator steps={steps} currentStep={currentStep} />
      <div className="flex gap-2 justify-center mt-6">
        <Button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} data-testid="button-prev">
          Anterior
        </Button>
        <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))} data-testid="button-next">
          Próximo
        </Button>
      </div>
    </div>
  );
}

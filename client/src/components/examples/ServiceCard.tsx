import { useState } from 'react';
import ServiceCard from '../ServiceCard';
import { Calendar, Users, Gift } from 'lucide-react';

export default function ServiceCardExample() {
  const [selected, setSelected] = useState('quadra');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <ServiceCard
        icon={Calendar}
        title="Quadra"
        description="Reserve horários para jogar"
        selected={selected === 'quadra'}
        onClick={() => setSelected('quadra')}
      />
      <ServiceCard
        icon={Users}
        title="Evento"
        description="Organize seu evento esportivo"
        selected={selected === 'evento'}
        onClick={() => setSelected('evento')}
      />
      <ServiceCard
        icon={Gift}
        title="Festa"
        description="Comemore com estilo"
        selected={selected === 'festa'}
        onClick={() => setSelected('festa')}
      />
    </div>
  );
}

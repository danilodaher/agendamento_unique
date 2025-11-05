import { useState } from 'react';
import TimeSlotCard from '../TimeSlotCard';

export default function TimeSlotCardExample() {
  const [selected, setSelected] = useState<string[]>([]);
  
  const slots = [
    { time: '08:00', available: true },
    { time: '09:00', available: false },
    { time: '10:00', available: true },
    { time: '11:00', available: true },
  ];
  
  const toggleSlot = (time: string) => {
    setSelected(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
      {slots.map(slot => (
        <TimeSlotCard
          key={slot.time}
          time={slot.time}
          available={slot.available}
          selected={selected.includes(slot.time)}
          onClick={() => toggleSlot(slot.time)}
        />
      ))}
    </div>
  );
}

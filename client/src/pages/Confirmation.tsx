import { useRoute, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import ConfirmationCard from "@/components/ConfirmationCard";

//todo: remove mock functionality - this will come from the API
const MOCK_BOOKING = {
  bookingId: 'UNQ-12345',
  serviceType: 'Quadra',
  date: '15 de novembro de 2025',
  timeSlots: ['08:00 - 09:00', '10:00 - 11:00'],
  name: 'João Silva',
  email: 'joao@example.com',
  phone: '(11) 98765-4321',
  total: 100,
};

export default function Confirmation() {
  const [match, params] = useRoute("/confirmacao/:id");
  const [, setLocation] = useLocation();
  
  if (!match) {
    setLocation('/');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <ConfirmationCard {...MOCK_BOOKING} bookingId={params?.id || 'UNQ-00000'} />
      </div>
    </div>
  );
}

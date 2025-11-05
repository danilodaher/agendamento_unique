import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ConfirmationCard from "@/components/ConfirmationCard";
import { Loader2 } from "lucide-react";

export default function Confirmation() {
  const [match, params] = useRoute("/confirmacao/:id");
  const [, setLocation] = useLocation();
  
  const { data: booking, isLoading } = useQuery({
    queryKey: ['/api/bookings/number', params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/number/${params?.id}`);
      if (!response.ok) {
        throw new Error('Booking not found');
      }
      return response.json();
    },
    enabled: !!params?.id,
  });
  
  if (!match) {
    setLocation('/');
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Reserva não encontrada</h1>
          <p className="text-muted-foreground">Verifique o número da reserva e tente novamente.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <ConfirmationCard
          bookingId={booking.bookingNumber}
          serviceType={booking.serviceType}
          date={booking.date}
          timeSlots={booking.timeSlots}
          name={booking.customerName}
          email={booking.customerEmail}
          phone={booking.customerPhone}
          total={booking.totalAmount / 100}
          cancelToken={booking.cancelToken}
        />
      </div>
    </div>
  );
}

import ConfirmationCard from '../ConfirmationCard';

export default function ConfirmationCardExample() {
  return (
    <ConfirmationCard
      bookingId="UNQ-12345"
      serviceType="Quadra"
      date="15 de novembro de 2025"
      timeSlots={['08:00 - 09:00', '09:00 - 10:00']}
      name="João Silva"
      email="joao@example.com"
      phone="(11) 98765-4321"
      total={100}
      cancelToken="abc123"
    />
  );
}

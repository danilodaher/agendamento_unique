import BookingSummary from '../BookingSummary';

export default function BookingSummaryExample() {
  return (
    <div className="p-6 max-w-md">
      <BookingSummary
        serviceType="Quadra"
        date={new Date('2025-11-15')}
        timeSlots={['08:00 - 09:00', '09:00 - 10:00']}
        pricePerSlot={50}
      />
    </div>
  );
}

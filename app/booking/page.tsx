import { BookingFlow } from "@/components/booking/booking-flow"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Reservar Cita</h1>
            <p className="text-muted-foreground">Sigue los pasos para reservar tu cita perfecta</p>
          </div>
          <BookingFlow />
        </div>
      </div>
    </div>
  )
}

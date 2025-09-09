import { AuthForm } from "@/components/auth/auth-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">BarberShop</h1>
          <p className="text-muted-foreground">Reserva tu cita de forma fácil y rápida</p>
        </div>
        <AuthForm />
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Demo Navigation:</p>
          <div className="flex gap-2 justify-center">
            <a href="/booking" className="text-sm text-primary hover:underline">
              Booking Flow
            </a>
            <span className="text-muted-foreground">•</span>
            <a href="/dashboard" className="text-sm text-primary hover:underline">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User } from "lucide-react"

export function QuickActions() {
  const handleNewBooking = () => {
    window.location.href = "/booking"
  }

  const handleViewAppointments = () => {
    // Scroll to appointments section
    document.getElementById("appointments-section")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button onClick={handleNewBooking} className="h-auto p-4 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2 w-full">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Nueva Cita</span>
            </div>
            <span className="text-xs text-primary-foreground/80">Reserva tu próxima cita</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleViewAppointments}
            className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
          >
            <div className="flex items-center gap-2 w-full">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Mis Citas</span>
            </div>
            <span className="text-xs text-muted-foreground">Ver citas programadas</span>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
            <div className="flex items-center gap-2 w-full">
              <MapPin className="h-4 w-4" />
              <span className="font-medium">Barberías</span>
            </div>
            <span className="text-xs text-muted-foreground">Explorar ubicaciones</span>
          </Button>

          <Button variant="outline" className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent">
            <div className="flex items-center gap-2 w-full">
              <User className="h-4 w-4" />
              <span className="font-medium">Mi Perfil</span>
            </div>
            <span className="text-xs text-muted-foreground">Actualizar información</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

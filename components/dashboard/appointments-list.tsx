"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, Phone, X, Edit } from "lucide-react"

interface Appointment {
  id: string
  barbershop: {
    name: string
    address: string
    phone: string
  }
  barber: {
    name: string
    avatar?: string
  }
  services: Array<{
    name: string
    price: number
  }>
  dateTime: {
    date: string
    time: string
  }
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED"
  totalPrice: number
}

// Mock appointments data - TODO: Replace with API call
const mockAppointments: Appointment[] = [
  {
    id: "1",
    barbershop: {
      name: "Barbería Clásica",
      address: "Av. Principal 123, Centro",
      phone: "+1234567890",
    },
    barber: {
      name: "Carlos Mendoza",
      avatar: "/barber-carlos.png",
    },
    services: [
      { name: "Corte de Cabello", price: 25000 },
      { name: "Arreglo de Barba", price: 15000 },
    ],
    dateTime: {
      date: "2024-12-20",
      time: "14:30",
    },
    status: "CONFIRMED",
    totalPrice: 40000,
  },
  {
    id: "2",
    barbershop: {
      name: "Modern Cuts",
      address: "Calle 45 #67-89, Norte",
      phone: "+1234567891",
    },
    barber: {
      name: "David Silva",
      avatar: "/barber-david.png",
    },
    services: [{ name: "Corte Fade", price: 30000 }],
    dateTime: {
      date: "2024-12-15",
      time: "16:00",
    },
    status: "COMPLETED",
    totalPrice: 30000,
  },
  {
    id: "3",
    barbershop: {
      name: "Gentleman's Club",
      address: "Carrera 12 #34-56, Sur",
      phone: "+1234567892",
    },
    barber: {
      name: "Fernando López",
      avatar: "/barber-fernando.png",
    },
    services: [
      { name: "Corte Premium", price: 35000 },
      { name: "Tratamiento Capilar", price: 30000 },
    ],
    dateTime: {
      date: "2024-12-25",
      time: "10:00",
    },
    status: "PENDING",
    totalPrice: 65000,
  },
]

export function AppointmentsList() {
  const [appointments] = useState<Appointment[]>(mockAppointments)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateString))
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    const statusConfig = {
      CONFIRMED: { label: "Confirmada", variant: "default" as const },
      PENDING: { label: "Pendiente", variant: "secondary" as const },
      COMPLETED: { label: "Completada", variant: "outline" as const },
      CANCELLED: { label: "Cancelada", variant: "destructive" as const },
    }
    return statusConfig[status]
  }

  const handleCancelAppointment = (appointmentId: string) => {
    // TODO: Implement cancel appointment functionality
    console.log("[v0] Cancelling appointment:", appointmentId)
  }

  const handleRescheduleAppointment = (appointmentId: string) => {
    // TODO: Implement reschedule appointment functionality
    console.log("[v0] Rescheduling appointment:", appointmentId)
  }

  const upcomingAppointments = appointments.filter((apt) => apt.status === "CONFIRMED" || apt.status === "PENDING")
  const pastAppointments = appointments.filter((apt) => apt.status === "COMPLETED" || apt.status === "CANCELLED")

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.barber.avatar || "/placeholder.svg"} alt={appointment.barber.name} />
              <AvatarFallback>
                {appointment.barber.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{appointment.barber.name}</h4>
              <p className="text-sm text-muted-foreground">{appointment.barbershop.name}</p>
            </div>
          </div>
          <Badge {...getStatusBadge(appointment.status)}>{getStatusBadge(appointment.status).label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(appointment.dateTime.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.dateTime.time}</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{appointment.barbershop.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.barbershop.phone}</span>
          </div>
        </div>

        <div>
          <h5 className="font-medium mb-2">Servicios:</h5>
          <div className="space-y-1">
            {appointment.services.map((service, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{service.name}</span>
                <span>{formatPrice(service.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(appointment.totalPrice)}</span>
            </div>
          </div>
        </div>

        {(appointment.status === "CONFIRMED" || appointment.status === "PENDING") && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRescheduleAppointment(appointment.id)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Reprogramar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleCancelAppointment(appointment.id)}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div id="appointments-section">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mis Citas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Próximas ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Historial ({pastAppointments.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingAppointments.length > 0 ? (
                <div>
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes citas próximas</h3>
                  <p className="text-muted-foreground mb-4">¿Listo para tu próximo corte?</p>
                  <Button onClick={() => (window.location.href = "/booking")}>Reservar Nueva Cita</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastAppointments.length > 0 ? (
                <div>
                  {pastAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sin historial de citas</h3>
                  <p className="text-muted-foreground">Tus citas completadas aparecerán aquí</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

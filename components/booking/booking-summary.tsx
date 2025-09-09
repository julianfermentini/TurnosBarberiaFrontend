"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, User, Calendar, DollarSign, CheckCircle } from "lucide-react"
import type { BookingData } from "./booking-flow"

interface BookingSummaryProps {
  bookingData: BookingData
}

export function BookingSummary({ bookingData }: BookingSummaryProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const totalPrice = bookingData.services?.reduce((sum, service) => sum + service.price, 0) || 0
  const totalDuration = bookingData.services?.reduce((sum, service) => sum + service.duration, 0) || 0

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

  const handleConfirmBooking = async () => {
    setIsConfirming(true)

    // TODO: Integrate with backend API
    console.log("[v0] Confirming booking:", bookingData)

    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false)
      setIsConfirmed(true)
      // TODO: Redirect to dashboard or confirmation page
    }, 2000)
  }

  if (isConfirmed) {
    return (
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">¡Reserva Confirmada!</h3>
          <p className="text-muted-foreground">
            Tu cita ha sido reservada exitosamente. Recibirás un email de confirmación en breve.
          </p>
        </div>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Número de reserva:</span>
                <span className="font-mono">#BK{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Fecha:</span>
                <span>{bookingData.dateTime && formatDate(bookingData.dateTime.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Hora:</span>
                <span>{bookingData.dateTime?.time}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
          Ir al Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Confirma tu reserva</h3>
        <p className="text-muted-foreground">Revisa los detalles antes de confirmar</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Barbershop & Barber Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Barbería y Barbero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{bookingData.barbershop?.name}</p>
              <p className="text-sm text-muted-foreground">{bookingData.barbershop?.address}</p>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{bookingData.barber?.name}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {bookingData.barber?.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date & Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha y Hora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{bookingData.dateTime && formatDate(bookingData.dateTime.date)}</p>
              <p className="text-sm text-muted-foreground">{bookingData.dateTime?.time}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Duración total: {totalDuration} minutos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Servicios Seleccionados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bookingData.services?.map((service) => (
              <div key={service.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.duration} minutos</p>
                </div>
                <span className="font-medium">{formatPrice(service.price)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center font-medium text-lg">
              <span>Total</span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Button */}
      <Button onClick={handleConfirmBooking} disabled={isConfirming} className="w-full" size="lg">
        {isConfirming ? (
          <>
            <Clock className="mr-2 h-4 w-4 animate-spin" />
            Confirmando reserva...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Confirmar Reserva - {formatPrice(totalPrice)}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al confirmar tu reserva, aceptas nuestros términos y condiciones. Puedes cancelar o modificar tu cita hasta 2
        horas antes.
      </p>
    </div>
  )
}

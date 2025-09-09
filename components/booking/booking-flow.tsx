"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarberShopSelection } from "./barbershop-selection"
import { BarberSelection } from "./barber-selection"
import { ServiceSelection } from "./service-selection"
import { DateTimeSelection } from "./datetime-selection"
import { BookingSummary } from "./booking-summary"

export interface BookingData {
  barbershop?: {
    id: string
    name: string
    address: string
  }
  barber?: {
    id: string
    name: string
    specialties: string[]
  }
  services?: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  dateTime?: {
    date: string
    time: string
  }
}

const steps = [
  { id: 1, title: "Barbería", description: "Selecciona tu barbería" },
  { id: 2, title: "Barbero", description: "Elige tu barbero preferido" },
  { id: 3, title: "Servicios", description: "Selecciona los servicios" },
  { id: 4, title: "Fecha y Hora", description: "Elige cuándo quieres tu cita" },
  { id: 5, title: "Confirmación", description: "Revisa y confirma tu reserva" },
]

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({})

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData((prev) => ({ ...prev, ...data }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BarberShopSelection
            selectedBarbershop={bookingData.barbershop}
            onSelect={(barbershop) => updateBookingData({ barbershop })}
          />
        )
      case 2:
        return (
          <BarberSelection
            barbershopId={bookingData.barbershop?.id}
            selectedBarber={bookingData.barber}
            onSelect={(barber) => updateBookingData({ barber })}
          />
        )
      case 3:
        return (
          <ServiceSelection
            barberId={bookingData.barber?.id}
            selectedServices={bookingData.services || []}
            onSelect={(services) => updateBookingData({ services })}
          />
        )
      case 4:
        return (
          <DateTimeSelection
            barberId={bookingData.barber?.id}
            services={bookingData.services || []}
            selectedDateTime={bookingData.dateTime}
            onSelect={(dateTime) => updateBookingData({ dateTime })}
          />
        )
      case 5:
        return <BookingSummary bookingData={bookingData} />
      default:
        return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!bookingData.barbershop
      case 2:
        return !!bookingData.barber
      case 3:
        return bookingData.services && bookingData.services.length > 0
      case 4:
        return !!bookingData.dateTime
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg">
              Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">{steps[currentStep - 1]?.description}</p>
        </CardHeader>
      </Card>

      {/* Step content */}
      <Card>
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
          Atrás
        </Button>
        <Button onClick={handleNext} disabled={!canProceed() || currentStep === steps.length}>
          {currentStep === steps.length ? "Confirmar Reserva" : "Siguiente"}
        </Button>
      </div>
    </div>
  )
}

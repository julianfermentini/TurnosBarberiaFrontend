"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface DateTimeSelectionProps {
  barberId?: string
  services: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  selectedDateTime?: {
    date: string
    time: string
  }
  onSelect: (dateTime: { date: string; time: string }) => void
}

// Mock available time slots
const generateTimeSlots = (date: Date) => {
  const slots = []
  const startHour = 9
  const endHour = 18
  const interval = 30 // minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      // Simulate some slots being unavailable
      const isAvailable = Math.random() > 0.3
      slots.push({
        time,
        available: isAvailable,
      })
    }
  }
  return slots
}

export function DateTimeSelection({ barberId, services, selectedDateTime, onSelect }: DateTimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    selectedDateTime?.date ? new Date(selectedDateTime.date) : undefined,
  )
  const [availableSlots, setAvailableSlots] = useState<Array<{ time: string; available: boolean }>>([])
  const [loading, setLoading] = useState(false)

  const totalDuration = services.reduce((sum, service) => sum + service.duration, 0)

  useEffect(() => {
    if (!selectedDate || !barberId) {
      setAvailableSlots([])
      return
    }

    // TODO: Replace with actual API call
    const fetchAvailableSlots = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const slots = generateTimeSlots(selectedDate)
        setAvailableSlots(slots)
        setLoading(false)
      }, 800)
    }

    fetchAvailableSlots()
  }, [selectedDate, barberId])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    // Clear selected time when date changes
    if (selectedDateTime?.time) {
      // Don't clear if same date
      if (!date || date.toDateString() !== new Date(selectedDateTime.date).toDateString()) {
        // Clear time selection
      }
    }
  }

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onSelect({
        date: selectedDate.toISOString().split("T")[0],
        time,
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (!barberId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Primero selecciona un barbero y servicios</p>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Primero selecciona al menos un servicio</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Selecciona fecha y hora</h3>
        <p className="text-muted-foreground">Elige cuándo quieres tu cita</p>
        {totalDuration > 0 && (
          <Badge variant="secondary" className="mt-2">
            <Clock className="h-3 w-3 mr-1" />
            Duración total: {totalDuration} minutos
          </Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selecciona una fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date() || date.getDay() === 0} // Disable past dates and Sundays
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Time slots */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate ? `Horarios disponibles - ${formatDate(selectedDate)}` : "Selecciona una fecha primero"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Selecciona una fecha para ver los horarios disponibles</p>
              </div>
            ) : loading ? (
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={
                      selectedDateTime?.time === slot.time ? "default" : slot.available ? "outline" : "secondary"
                    }
                    size="sm"
                    disabled={!slot.available}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    className="text-xs"
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDateTime && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h4 className="font-medium mb-2">Cita seleccionada</h4>
              <p className="text-sm text-muted-foreground">
                {formatDate(new Date(selectedDateTime.date))} a las {selectedDateTime.time}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

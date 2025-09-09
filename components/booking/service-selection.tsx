"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, DollarSign } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  category: string
}

interface ServiceSelectionProps {
  barberId?: string
  selectedServices: Array<{
    id: string
    name: string
    price: number
    duration: number
  }>
  onSelect: (services: Array<{ id: string; name: string; price: number; duration: number }>) => void
}

// Mock data - TODO: Replace with API call
const mockServices: Service[] = [
  {
    id: "s1",
    name: "Corte de Cabello",
    description: "Corte personalizado según tu estilo",
    price: 25000,
    duration: 30,
    category: "Corte",
  },
  {
    id: "s2",
    name: "Arreglo de Barba",
    description: "Recorte y perfilado de barba",
    price: 15000,
    duration: 20,
    category: "Barba",
  },
  {
    id: "s3",
    name: "Afeitado Clásico",
    description: "Afeitado tradicional con navaja",
    price: 20000,
    duration: 25,
    category: "Afeitado",
  },
  {
    id: "s4",
    name: "Corte + Barba",
    description: "Combo completo de corte y barba",
    price: 35000,
    duration: 45,
    category: "Combo",
  },
  {
    id: "s5",
    name: "Lavado y Styling",
    description: "Lavado y peinado profesional",
    price: 12000,
    duration: 15,
    category: "Styling",
  },
  {
    id: "s6",
    name: "Tratamiento Capilar",
    description: "Tratamiento nutritivo para el cabello",
    price: 30000,
    duration: 40,
    category: "Tratamiento",
  },
]

export function ServiceSelection({ barberId, selectedServices, onSelect }: ServiceSelectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!barberId) {
      setServices([])
      setLoading(false)
      return
    }

    // TODO: Replace with actual API call
    const fetchServices = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setServices(mockServices)
        setLoading(false)
      }, 600)
    }

    fetchServices()
  }, [barberId])

  const handleServiceToggle = (service: Service, checked: boolean) => {
    if (checked) {
      const newServices = [
        ...selectedServices,
        {
          id: service.id,
          name: service.name,
          price: service.price,
          duration: service.duration,
        },
      ]
      onSelect(newServices)
    } else {
      const newServices = selectedServices.filter((s) => s.id !== service.id)
      onSelect(newServices)
    }
  }

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some((s) => s.id === serviceId)
  }

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (!barberId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Primero selecciona un barbero</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Group services by category
  const servicesByCategory = services.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Selecciona los servicios</h3>
        <p className="text-muted-foreground">Puedes elegir múltiples servicios</p>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-3">
          <h4 className="font-medium text-foreground">{category}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {categoryServices.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isServiceSelected(service.id)
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleServiceToggle(service, !isServiceSelected(service.id))}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                    </div>
                    <Checkbox
                      checked={isServiceSelected(service.id)}
                      onChange={(checked) => handleServiceToggle(service, checked)}
                      className="ml-2"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatPrice(service.price)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {selectedServices.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Servicios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.name}</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-3">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Duración total</span>
                  <span>{totalDuration} minutos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

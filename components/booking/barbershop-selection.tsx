"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star } from "lucide-react"

interface BarberShop {
  id: string
  name: string
  address: string
  phone: string
  rating: number
  openHours: string
  services: string[]
  image?: string
}

interface BarberShopSelectionProps {
  selectedBarbershop?: {
    id: string
    name: string
    address: string
  }
  onSelect: (barbershop: { id: string; name: string; address: string }) => void
}

// Mock data - TODO: Replace with API call
const mockBarberShops: BarberShop[] = [
  {
    id: "1",
    name: "Barbería Clásica",
    address: "Av. Principal 123, Centro",
    phone: "+1234567890",
    rating: 4.8,
    openHours: "9:00 AM - 8:00 PM",
    services: ["Corte", "Barba", "Afeitado"],
  },
  {
    id: "2",
    name: "Modern Cuts",
    address: "Calle 45 #67-89, Norte",
    phone: "+1234567891",
    rating: 4.6,
    openHours: "10:00 AM - 9:00 PM",
    services: ["Corte Moderno", "Barba", "Styling"],
  },
  {
    id: "3",
    name: "Gentleman's Club",
    address: "Carrera 12 #34-56, Sur",
    phone: "+1234567892",
    rating: 4.9,
    openHours: "8:00 AM - 7:00 PM",
    services: ["Corte Premium", "Barba", "Tratamientos"],
  },
]

export function BarberShopSelection({ selectedBarbershop, onSelect }: BarberShopSelectionProps) {
  const [barbershops, setBarbershops] = useState<BarberShop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBarbershops = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setBarbershops(mockBarberShops)
        setLoading(false)
      }, 1000)
    }

    fetchBarbershops()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
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

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Selecciona tu barbería preferida</h3>
        <p className="text-muted-foreground">Elige la ubicación más conveniente para ti</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {barbershops.map((barbershop) => (
          <Card
            key={barbershop.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBarbershop?.id === barbershop.id
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() =>
              onSelect({
                id: barbershop.id,
                name: barbershop.name,
                address: barbershop.address,
              })
            }
          >
            <CardHeader>
              <CardTitle className="text-lg">{barbershop.name}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{barbershop.rating}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span>{barbershop.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{barbershop.openHours}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {barbershop.services.map((service) => (
                  <Badge key={service} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

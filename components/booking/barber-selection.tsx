"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock } from "lucide-react"

interface Barber {
  id: string
  name: string
  specialties: string[]
  rating: number
  experience: string
  avatar?: string
  workingHours: string
}

interface BarberSelectionProps {
  barbershopId?: string
  selectedBarber?: {
    id: string
    name: string
    specialties: string[]
  }
  onSelect: (barber: { id: string; name: string; specialties: string[] }) => void
}

// Mock data - TODO: Replace with API call
const mockBarbers: Record<string, Barber[]> = {
  "1": [
    {
      id: "b1",
      name: "Carlos Mendoza",
      specialties: ["Corte Clásico", "Barba", "Afeitado"],
      rating: 4.9,
      experience: "8 años",
      workingHours: "9:00 AM - 6:00 PM",
    },
    {
      id: "b2",
      name: "Miguel Torres",
      specialties: ["Corte Moderno", "Styling"],
      rating: 4.7,
      experience: "5 años",
      workingHours: "10:00 AM - 8:00 PM",
    },
  ],
  "2": [
    {
      id: "b3",
      name: "David Silva",
      specialties: ["Corte Fade", "Barba", "Diseños"],
      rating: 4.8,
      experience: "6 años",
      workingHours: "10:00 AM - 9:00 PM",
    },
    {
      id: "b4",
      name: "Roberto Díaz",
      specialties: ["Corte Clásico", "Tratamientos"],
      rating: 4.6,
      experience: "10 años",
      workingHours: "9:00 AM - 7:00 PM",
    },
  ],
  "3": [
    {
      id: "b5",
      name: "Fernando López",
      specialties: ["Corte Premium", "Barba", "Afeitado Clásico"],
      rating: 5.0,
      experience: "12 años",
      workingHours: "8:00 AM - 6:00 PM",
    },
  ],
}

export function BarberSelection({ barbershopId, selectedBarber, onSelect }: BarberSelectionProps) {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!barbershopId) {
      setBarbers([])
      setLoading(false)
      return
    }

    // TODO: Replace with actual API call
    const fetchBarbers = async () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setBarbers(mockBarbers[barbershopId] || [])
        setLoading(false)
      }, 800)
    }

    fetchBarbers()
  }, [barbershopId])

  if (!barbershopId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Primero selecciona una barbería</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full"></div>
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
        <h3 className="text-lg font-semibold mb-2">Selecciona tu barbero</h3>
        <p className="text-muted-foreground">Elige el profesional que prefieras</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {barbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedBarber?.id === barber.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
            }`}
            onClick={() =>
              onSelect({
                id: barber.id,
                name: barber.name,
                specialties: barber.specialties,
              })
            }
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={barber.avatar || "/placeholder.svg"} alt={barber.name} />
                  <AvatarFallback>
                    {barber.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{barber.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{barber.rating}</span>
                    <span>•</span>
                    <span>{barber.experience}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{barber.workingHours}</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {barber.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

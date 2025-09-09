"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp } from "lucide-react"

// Mock user statistics - TODO: Replace with actual API data
const mockStats = {
  totalAppointments: 24,
  upcomingAppointments: 2,
  favoriteBarber: "Carlos Mendoza",
  memberSince: "Enero 2024",
  loyaltyPoints: 150,
  averageRating: 4.8,
}

export function UserStats() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estadísticas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mockStats.totalAppointments}</div>
              <div className="text-xs text-muted-foreground">Citas totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{mockStats.upcomingAppointments}</div>
              <div className="text-xs text-muted-foreground">Próximas citas</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Barbero favorito</span>
              <span className="text-sm font-medium">{mockStats.favoriteBarber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Miembro desde</span>
              <span className="text-sm font-medium">{mockStats.memberSince}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Puntos de lealtad</span>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {mockStats.loyaltyPoints}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-4 w-4" />
            Tu Experiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-1">{mockStats.averageRating}</div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= mockStats.averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Calificación promedio</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

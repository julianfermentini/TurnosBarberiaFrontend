import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AppointmentsList } from "@/components/dashboard/appointments-list"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { UserStats } from "@/components/dashboard/user-stats"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Welcome section and quick actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">Bienvenido de vuelta</h1>
                <p className="text-muted-foreground">Gestiona tus citas y perfil desde aquí</p>
              </div>
              <QuickActions />
            </div>
            <div>
              <UserStats />
            </div>
          </div>

          {/* Appointments section */}
          <AppointmentsList />
        </div>
      </div>
    </div>
  )
}

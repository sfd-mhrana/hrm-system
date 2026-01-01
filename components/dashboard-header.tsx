"use client"
import { authService } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface DashboardHeaderProps {
  userName?: string
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await authService.logout()
    router.push("/")
  }

  return (
    <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">HRM Dashboard</h1>
        {userName && <p className="text-sm text-slate-600 dark:text-slate-400">Welcome, {userName}</p>}
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Logout
      </Button>
    </header>
  )
}

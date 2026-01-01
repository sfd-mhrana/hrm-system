"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarNav } from "@/components/sidebar-nav"
import { authService, initializeData } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

const adminNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Employees", href: "/dashboard/employees", icon: "👥" },
  { label: "Attendance", href: "/dashboard/attendance", icon: "📋" },
  { label: "Leave Requests", href: "/dashboard/leaves", icon: "📅" },
  { label: "Performance", href: "/dashboard/performance", icon: "⭐" },
  { label: "Reports", href: "/dashboard/reports", icon: "📈" },
  { label: "Database", href: "/dashboard/database", icon: "🗄️" },
]

const employeeNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "My Profile", href: "/dashboard/profile", icon: "👤" },
  { label: "My Attendance", href: "/dashboard/my-attendance", icon: "📋" },
  { label: "My Leaves", href: "/dashboard/my-leaves", icon: "📅" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [userRole, setUserRole] = useState<string>("employee")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetchProfile = async () => {
      try {
        initializeData()
        const currentUser = authService.getUser()

        if (!currentUser) {
          router.push("/auth/login")
          return
        }

        setUser(currentUser)
        setUserRole(currentUser.role)
      } catch (error) {
        console.error("Error fetching user:", error)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkUserAndFetchProfile()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  const navItems = userRole === "admin" ? adminNavItems : employeeNavItems

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-blue-600">HRM System</h2>
        </div>
        <SidebarNav items={navItems} userRole={userRole} />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader userName={user?.email} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}

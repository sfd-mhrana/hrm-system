"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, attendanceService, leaveService, initializeData } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    leaveRequests: 0,
  })
  const [userRole, setUserRole] = useState<string>("employee")

  useEffect(() => {
    initializeData()
    const fetchStats = async () => {
      const user = authService.getUser()

      if (!user) return

      setUserRole(user.role)

      // Fetch stats based on role
      if (user.role === "admin") {
        const employees = await employeeService.getAll()
        const today = new Date().toISOString().split("T")[0]
        const todayAttendance = await attendanceService.getByDate(today)
        const presentCount = todayAttendance.filter((a) => a.status === "present").length
        const pendingLeaves = await leaveService.getPending()

        setStats({
          totalEmployees: employees.length,
          presentToday: presentCount,
          leaveRequests: pendingLeaves.length,
        })
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Welcome to the HRM System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.presentToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.leaveRequests}</div>
          </CardContent>
        </Card>
      </div>

      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400">
              Navigate to Employees, Attendance, or Leave sections using the sidebar menu.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

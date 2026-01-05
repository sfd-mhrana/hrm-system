"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, attendanceService, leaveService, reviewService, initializeData } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface ReportData {
  totalEmployees: number
  activeEmployees: number
  totalAttendanceRecords: number
  averageAttendanceRate: number
  pendingLeaves: number
  approvedLeaves: number
  averagePerformanceRating: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalEmployees: 0,
    activeEmployees: 0,
    totalAttendanceRecords: 0,
    averageAttendanceRate: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    averagePerformanceRating: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchReports = async () => {
      try {
        initializeData()
        const user = authService.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        if (user.role !== "admin") {
          router.push("/dashboard")
          return
        }

        // Fetch all data
        const employees = await employeeService.getAll()
        const activeEmployees = employees.filter((e) => e.status === "active")
        const attendance = await attendanceService.getAll()
        const leaves = await leaveService.getAll()
        const reviews = await reviewService.getAll()

        // Calculate statistics
        const presentCount = attendance.filter((a) => a.status === "present").length
        const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0
        const pendingLeavesCount = leaves.filter((l) => l.status === "pending").length
        const approvedLeavesCount = leaves.filter((l) => l.status === "approved").length
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

        setReportData({
          totalEmployees: employees.length,
          activeEmployees: activeEmployees.length,
          totalAttendanceRecords: attendance.length,
          averageAttendanceRate: Math.round(attendanceRate),
          pendingLeaves: pendingLeavesCount,
          approvedLeaves: approvedLeavesCount,
          averagePerformanceRating: Math.round(avgRating * 10) / 10,
        })
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Comprehensive HR insights and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{reportData.totalEmployees}</div>
            <p className="text-sm text-slate-500 mt-2">{reportData.activeEmployees} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{reportData.averageAttendanceRate}%</div>
            <p className="text-sm text-slate-500 mt-2">{reportData.totalAttendanceRecords} total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-600">{reportData.pendingLeaves}</div>
            <p className="text-sm text-slate-500 mt-2">{reportData.approvedLeaves} approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Avg Performance Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-purple-600">{reportData.averagePerformanceRating}/5</div>
            <div className="flex mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={i < Math.round(reportData.averagePerformanceRating) ? "text-yellow-500" : "text-gray-300"}
                >
                  ⭐
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

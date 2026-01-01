"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, attendanceService, initializeData, type Attendance } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function MyAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchMyAttendance = async () => {
    try {
      initializeData()
      const user = authService.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const employee = employeeService.getByUserId(user.id)
      if (employee) {
        const attendanceRecords = attendanceService.getByEmployee(employee.id)
        setRecords(attendanceRecords)
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyAttendance()
  }, [])

  const markAttendance = async (status: "present" | "absent" | "late" | "half-day") => {
    try {
      const user = authService.getUser()
      if (!user) return

      const employee = employeeService.getByUserId(user.id)
      if (!employee) return

      const today = new Date().toISOString().split("T")[0]
      const currentTime = new Date().toTimeString().split(" ")[0]

      // Check if attendance already exists for today
      const existingRecords = attendanceService.getByEmployee(employee.id)
      const todayRecord = existingRecords.find((r) => r.date === today)

      if (todayRecord) {
        attendanceService.update(todayRecord.id, {
          status,
          check_in: status === "present" ? currentTime : undefined,
        })
      } else {
        attendanceService.add({
          employee_id: employee.id,
          date: today,
          status,
          check_in: status === "present" ? currentTime : undefined,
        })
      }

      await fetchMyAttendance()
    } catch (error) {
      console.error("Error marking attendance:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Attendance</h1>
        <p className="text-slate-600 dark:text-slate-400">Your attendance records</p>
      </div>

      <div className="flex gap-4">
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => markAttendance("present")}>
          Mark Present Today
        </Button>
        <Button variant="outline" onClick={() => markAttendance("absent")}>
          Mark Absent Today
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-10">No attendance records yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.check_in || "-"}</TableCell>
                      <TableCell>{record.check_out || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {record.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

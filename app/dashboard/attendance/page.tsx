"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, attendanceService, initializeData, type Attendance } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function AttendancePage() {
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [userRole, setUserRole] = useState<string>("employee")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchAttendance = async () => {
    try {
      initializeData()
      const user = authService.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserRole(user.role)

      if (user.role === "admin") {
        // Admin views all attendance for selected date
        const records = attendanceService.getByDate(selectedDate)
        setAttendanceRecords(records)
      } else {
        // Employee views only their own
        const employee = employeeService.getByUserId(user.id)
        if (employee) {
          const records = attendanceService.getByEmployee(employee.id)
          setAttendanceRecords(records)
        }
      }
    } catch (error) {
      console.error("Error fetching attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [selectedDate])

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
        // Update existing record
        attendanceService.update(todayRecord.id, {
          status,
          check_in: status === "present" ? currentTime : undefined,
        })
      } else {
        // Create new record
        attendanceService.add({
          employee_id: employee.id,
          date: today,
          status,
          check_in: status === "present" ? currentTime : undefined,
        })
      }

      await fetchAttendance()
    } catch (error) {
      console.error("Error marking attendance:", error)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  const isAdmin = userRole === "admin"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Attendance</h1>
        <p className="text-slate-600 dark:text-slate-400">Track daily attendance records</p>
      </div>

      {isAdmin && (
        <div className="flex gap-4">
          <div>
            <label className="text-sm font-medium">Filter by Date:</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="flex gap-4">
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => markAttendance("present")}>
            Mark Present
          </Button>
          <Button variant="outline" onClick={() => markAttendance("absent")}>
            Mark Absent
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-10">No attendance records</p>
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
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.check_in || "-"}</TableCell>
                      <TableCell>{record.check_out || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.status === "present"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : record.status === "absent"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
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

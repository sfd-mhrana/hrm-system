"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { authService, employeeService, leaveService, initializeData, type LeaveRequest } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function MyLeavesPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const fetchMyLeaves = async () => {
    try {
      initializeData()
      const user = authService.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const employee = await employeeService.getByUserId(user.id)
      if (employee) {
        const employeeLeaves = await leaveService.getByEmployee(employee.id)
        setLeaves(employeeLeaves)
      }
    } catch (error) {
      console.error("Error fetching leaves:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyLeaves()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Leave Requests</h1>
          <p className="text-slate-600 dark:text-slate-400">Your leave request history</p>
        </div>
        <LeaveRequestDialog onLeaveRequested={fetchMyLeaves} open={openDialog} onOpenChange={setOpenDialog} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
        </CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-10">No leave requests yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{leave.leave_type}</TableCell>
                      <TableCell>{leave.start_date}</TableCell>
                      <TableCell>{leave.end_date}</TableCell>
                      <TableCell className="max-w-xs truncate">{leave.reason || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : leave.status === "rejected"
                                ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {leave.status}
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

interface LeaveRequestDialogProps {
  onLeaveRequested: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

function LeaveRequestDialog({ onLeaveRequested, open, onOpenChange }: LeaveRequestDialogProps) {
  const [formData, setFormData] = useState({
    leaveType: "sick" as "sick" | "casual" | "vacation" | "personal",
    startDate: "",
    endDate: "",
    reason: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = authService.getUser()
      if (!user) return

      const employee = await employeeService.getByUserId(user.id)
      if (!employee) return

      await leaveService.add({
        employee_id: employee.id,
        leave_type: formData.leaveType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        reason: formData.reason,
        status: "pending",
      })

      setFormData({
        leaveType: "sick",
        startDate: "",
        endDate: "",
        reason: "",
      })
      onOpenChange(false)
      onLeaveRequested()
    } catch (error) {
      console.error("Error requesting leave:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Request Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit a leave request</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Leave Type</Label>
            <select
              value={formData.leaveType}
              onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as typeof formData.leaveType })}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="vacation">Vacation</option>
              <option value="personal">Personal Leave</option>
            </select>
          </div>
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Reason</Label>
            <Input
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Optional reason"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Request Leave"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

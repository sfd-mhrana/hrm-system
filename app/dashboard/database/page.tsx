"use client"

import { useEffect, useState } from "react"
import { employeeService, attendanceService, leaveService, reviewService, authService, initializeData } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export default function DatabasePage() {
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [leaves, setLeaves] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    initializeData()
    const user = authService.getUser()

    if (!user || user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setEmployees(employeeService.getAll())
    setAttendance(attendanceService.getAll())
    setLeaves(leaveService.getAll())
    setReviews(reviewService.getAll())
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Viewer</h1>
        <p className="text-muted-foreground">View all data in your HRM system</p>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees ({employees.length})</TabsTrigger>
          <TabsTrigger value="attendance">Attendance ({attendance.length})</TabsTrigger>
          <TabsTrigger value="leaves">Leave Requests ({leaves.length})</TabsTrigger>
          <TabsTrigger value="reviews">Performance Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employees Table</CardTitle>
              <CardDescription>All employee records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-mono text-xs">{emp.id}</TableCell>
                        <TableCell>
                          {emp.first_name} {emp.last_name}
                        </TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{emp.department || "-"}</TableCell>
                        <TableCell>{emp.position || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={emp.status === "active" ? "default" : "secondary"}>{emp.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Table</CardTitle>
              <CardDescription>All attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((att) => (
                      <TableRow key={att.id}>
                        <TableCell className="font-mono text-xs">{att.id}</TableCell>
                        <TableCell className="font-mono text-xs">{att.employee_id}</TableCell>
                        <TableCell>{att.date}</TableCell>
                        <TableCell>
                          <Badge variant={att.status === "present" ? "default" : "secondary"}>{att.status}</Badge>
                        </TableCell>
                        <TableCell>{att.check_in || "-"}</TableCell>
                        <TableCell>{att.check_out || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests Table</CardTitle>
              <CardDescription>All leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell className="font-mono text-xs">{leave.id}</TableCell>
                        <TableCell className="font-mono text-xs">{leave.employee_id}</TableCell>
                        <TableCell>{leave.leave_type}</TableCell>
                        <TableCell>{leave.start_date}</TableCell>
                        <TableCell>{leave.end_date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              leave.status === "approved"
                                ? "default"
                                : leave.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews Table</CardTitle>
              <CardDescription>All performance evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Employee ID</TableHead>
                      <TableHead>Reviewer ID</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-mono text-xs">{review.id}</TableCell>
                        <TableCell className="font-mono text-xs">{review.employee_id}</TableCell>
                        <TableCell className="font-mono text-xs">{review.reviewer_id}</TableCell>
                        <TableCell>
                          <Badge>{review.rating}/5</Badge>
                        </TableCell>
                        <TableCell>{review.review_date}</TableCell>
                        <TableCell className="max-w-xs truncate">{review.comments || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

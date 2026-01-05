"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, initializeData, type Employee } from "@/lib/api-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddEmployeeDialog } from "@/components/add-employee-dialog"
import { useRouter } from "next/navigation"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [userRole, setUserRole] = useState<string>("employee")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchEmployees = async () => {
    try {
      initializeData()
      const user = authService.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserRole(user.role)

      // If admin, fetch all employees; if employee, fetch own profile
      if (user.role === "admin") {
        const allEmployees = await employeeService.getAll()
        setEmployees(allEmployees)
      } else {
        // Fetch own employee record
        const ownEmployee = await employeeService.getByUserId(user.id)
        if (ownEmployee) {
          setEmployees([ownEmployee])
        }
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const isAdmin = userRole === "admin"

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{isAdmin ? "Employees" : "My Profile"}</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isAdmin ? "Manage all employee records" : "Your employee information"}
          </p>
        </div>
        {isAdmin && <AddEmployeeDialog onEmployeeAdded={fetchEmployees} />}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee List</CardTitle>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-10">No employees found</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.first_name} {employee.last_name}
                      </TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{employee.department || "-"}</TableCell>
                      <TableCell>{employee.position || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {employee.status}
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

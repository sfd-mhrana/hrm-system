"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, reviewService, initializeData, type PerformanceReview } from "@/lib/api-client"
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
import type React from "react"

export default function PerformancePage() {
  const [reviews, setReviews] = useState<PerformanceReview[]>([])
  const [userRole, setUserRole] = useState<string>("employee")
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()

  const fetchReviews = async () => {
    try {
      initializeData()
      const user = authService.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUserRole(user.role)

      if (user.role === "admin") {
        const allReviews = await reviewService.getAll()
        setReviews(allReviews)
      } else {
        const employee = await employeeService.getByUserId(user.id)
        if (employee) {
          const employeeReviews = await reviewService.getByEmployee(employee.id)
          setReviews(employeeReviews)
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  const isAdmin = userRole === "admin"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {isAdmin ? "Performance Reviews" : "My Performance"}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isAdmin ? "Manage employee performance reviews" : "Your performance review history"}
          </p>
        </div>
        {isAdmin && (
          <AddReviewDialog onReviewAdded={fetchReviews} open={openDialog} onOpenChange={setOpenDialog} />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-slate-600 dark:text-slate-400 text-center py-10">No performance reviews</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {isAdmin && <TableHead>Employee</TableHead>}
                    <TableHead>Reviewer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      {isAdmin && (
                        <TableCell>
                          <div className="font-medium">
                            {review.employee?.first_name} {review.employee?.last_name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {review.employee?.email}
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="text-sm">
                          {review.reviewer?.first_name} {review.reviewer?.last_name}
                        </div>
                      </TableCell>
                      <TableCell>{review.review_date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">({review.rating}/5)</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{review.comments || "-"}</TableCell>
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

interface AddReviewDialogProps {
  onReviewAdded: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

function AddReviewDialog({ onReviewAdded, open, onOpenChange }: AddReviewDialogProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    rating: 5,
    comments: "",
    reviewDate: new Date().toISOString().split("T")[0],
  })
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      if (open) {
        setError(null) // Clear error when dialog opens
        const allEmployees = await employeeService.getAll()
        setEmployees(allEmployees)
      }
    }
    fetchEmployees()
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const user = authService.getUser()
      if (!user) {
        setError("User not authenticated")
        return
      }

      // Don't pass reviewer_id - backend will auto-assign from current admin's employee record
      await reviewService.add({
        employee_id: formData.employeeId,
        rating: formData.rating,
        comments: formData.comments,
        review_date: formData.reviewDate,
      })

      // Reset form
      setFormData({
        employeeId: "",
        rating: 5,
        comments: "",
        reviewDate: new Date().toISOString().split("T")[0],
      })

      // Close dialog and refresh list
      onOpenChange(false)
      onReviewAdded()
    } catch (error) {
      console.error("Error adding review:", error)
      setError(error instanceof Error ? error.message : "Failed to add review")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Performance Review</DialogTitle>
          <DialogDescription>Create a new performance review for an employee</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Employee</Label>
            <select
              required
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Rating (1-5)</Label>
            <Input
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label>Review Date</Label>
            <Input
              type="date"
              required
              value={formData.reviewDate}
              onChange={(e) => setFormData({ ...formData, reviewDate: e.target.value })}
            />
          </div>
          <div>
            <Label>Comments</Label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background min-h-[100px]"
              placeholder="Performance comments..."
            />
          </div>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

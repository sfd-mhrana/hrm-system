"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, reviewService, initializeData, type PerformanceReview } from "@/lib/mock-data"
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
        const allReviews = reviewService.getAll()
        setReviews(allReviews)
      } else {
        const employee = employeeService.getByUserId(user.id)
        if (employee) {
          const employeeReviews = reviewService.getByEmployee(employee.id)
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
                    <TableHead>Date</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>{review.review_date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>
                              ⭐
                            </span>
                          ))}
                          <span className="ml-2 text-sm text-slate-600">({review.rating}/5)</span>
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

  useEffect(() => {
    if (open) {
      const allEmployees = employeeService.getAll()
      setEmployees(allEmployees)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = authService.getUser()
      if (!user) return

      reviewService.add({
        employee_id: formData.employeeId,
        reviewer_id: user.id,
        rating: formData.rating,
        comments: formData.comments,
        review_date: formData.reviewDate,
      })

      setFormData({
        employeeId: "",
        rating: 5,
        comments: "",
        reviewDate: new Date().toISOString().split("T")[0],
      })
      onOpenChange(false)
      onReviewAdded()
    } catch (error) {
      console.error("Error adding review:", error)
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

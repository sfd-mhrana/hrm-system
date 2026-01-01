"use client"

import { useEffect, useState } from "react"
import { authService, employeeService, initializeData, type Employee } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        initializeData()
        const user = authService.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const employee = employeeService.getByUserId(user.id)
        if (employee) {
          setProfile(employee)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-600 dark:text-slate-400">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-400">Your employee information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">First Name</p>
              <p className="text-lg">{profile.first_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Last Name</p>
              <p className="text-lg">{profile.last_name}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Email</p>
            <p className="text-lg">{profile.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Department</p>
              <p className="text-lg">{profile.department || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Position</p>
              <p className="text-lg">{profile.position || "-"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Hire Date</p>
              <p className="text-lg">{profile.hire_date || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Phone</p>
              <p className="text-lg">{profile.phone || "-"}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Status</p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                profile.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {profile.status}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

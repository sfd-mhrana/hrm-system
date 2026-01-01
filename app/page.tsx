"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authService } from "@/lib/mock-data"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = authService.getUser()
      setUser(currentUser)
    }
    checkUser()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white">HRM System</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Professional Human Resource Management Platform
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            {user ? (
              <>
                <Button size="lg" onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={async () => {
                    await authService.logout()
                    router.push("/")
                    setUser(null)
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="lg" variant="outline">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-blue-600 mb-2">👥</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Employee Management</h3>
              <p className="text-slate-600 dark:text-slate-400">Manage employee profiles, departments, and positions</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-green-600 mb-2">📋</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Attendance & Leaves</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Track attendance, manage leave requests with approvals
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
              <div className="text-3xl font-bold text-purple-600 mb-2">📊</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Reports & Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400">View performance reviews and HR analytics</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

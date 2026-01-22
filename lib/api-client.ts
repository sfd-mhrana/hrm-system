// API Client Service - Replaces mock-data.ts
// This provides the same interface but uses API routes with MySQL database

export interface User {
    id: string
    email: string
    role: "admin" | "employee"
    full_name: string
}

export interface Employee {
    id: string
    user_id?: string | null
    first_name: string
    last_name: string
    email: string
    department: string | null
    position: string | null
    hire_date?: string | null
    phone?: string | null
    status: "active" | "inactive"
    created_at: string
}

export interface Attendance {
    id: string
    employee_id: string
    date: string
    status: "present" | "absent" | "late" | "half-day"
    check_in?: string | null
    check_out?: string | null
    notes?: string | null
}

export interface LeaveRequest {
    id: string
    employee_id: string
    leave_type: "sick" | "casual" | "vacation" | "personal"
    start_date: string
    end_date: string
    reason: string
    status: "pending" | "approved" | "rejected"
    created_at: string
}

export interface PerformanceReview {
    id: string
    employee_id: string
    reviewer_id: string
    rating: number
    comments: string
    review_date: string
    created_at: string
    employee?: {
        id: string
        first_name: string
        last_name: string
        email: string
    }
    reviewer?: {
        id: string
        first_name: string
        last_name: string
        email: string
    }
}

// Local storage keys
const STORAGE_KEYS = {
    CURRENT_USER: "hrm_current_user",
}

// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue
    try {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : defaultValue
    } catch {
        return defaultValue
    }
}

const setInStorage = <T>(key: string, value: T): void => {
    if (typeof window === "undefined") return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.error("Error saving to localStorage:", error)
    }
}

// API helper function
const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> => {
    const user = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
    
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    }

    if (user) {
        headers["x-user-id"] = user.id
        headers["x-user-role"] = user.role
    }

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Unknown error" }))
        const errorMessage = error.error || `HTTP error! status: ${response.status}`
        console.error(`API Error [${endpoint}]:`, errorMessage, { status: response.status, error })
        throw new Error(errorMessage)
    }

    return response.json()
}

// Initialize data - no longer needed with database, but kept for compatibility
export const initializeData = () => {
    // No-op: database is initialized via migrations
}

// Auth service
export const authService = {
    login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
        try {
            const response = await apiRequest<{ user: User }>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            })
            
            setInStorage(STORAGE_KEYS.CURRENT_USER, response.user)
            return { user: response.user, error: null }
        } catch (error) {
            return { user: null, error: error instanceof Error ? error.message : "Login failed" }
        }
    },

    signUp: async (email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }> => {
        try {
            const response = await apiRequest<{ user: User }>("/auth/signup", {
                method: "POST",
                body: JSON.stringify({ email, password, fullName }),
            })
            
            setInStorage(STORAGE_KEYS.CURRENT_USER, response.user)
            return { user: response.user, error: null }
        } catch (error) {
            return { user: null, error: error instanceof Error ? error.message : "Signup failed" }
        }
    },

    logout: async (): Promise<void> => {
        try {
            await apiRequest("/auth/logout", {
                method: "POST",
            })
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            if (typeof window !== "undefined") {
                localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
            }
        }
    },

    getUser: (): User | null => {
        return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
    },
}

// Employee service
export const employeeService = {
    getAll: async (): Promise<Employee[]> => {
        try {
            const response = await apiRequest<{ employees: Employee[] }>("/employees")
            return response.employees
        } catch (error) {
            console.error("Error fetching employees:", error)
            return []
        }
    },

    getById: async (id: string): Promise<Employee | null> => {
        try {
            const response = await apiRequest<{ employee: Employee }>(`/employees/${id}`)
            return response.employee
        } catch (error) {
            console.error("Error fetching employee:", error)
            return null
        }
    },

    getByUserId: async (userId: string): Promise<Employee | null> => {
        try {
            const response = await apiRequest<{ employee: Employee }>(`/employees/by-user/${userId}`)
            return response.employee
        } catch (error) {
            console.error("Error fetching employee by user ID:", error)
            return null
        }
    },

    add: async (employee: Omit<Employee, "id" | "created_at">): Promise<Employee> => {
        const response = await apiRequest<{ employee: Employee }>("/employees", {
            method: "POST",
            body: JSON.stringify(employee),
        })
        return response.employee
    },

    update: async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
        try {
            const response = await apiRequest<{ employee: Employee }>(`/employees/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            })
            return response.employee
        } catch (error) {
            console.error("Error updating employee:", error)
            return null
        }
    },

    delete: async (id: string): Promise<boolean> => {
        try {
            await apiRequest(`/employees/${id}`, {
                method: "DELETE",
            })
            return true
        } catch (error) {
            console.error("Error deleting employee:", error)
            return false
        }
    },
}

// Attendance service
export const attendanceService = {
    getAll: async (): Promise<Attendance[]> => {
        try {
            const response = await apiRequest<{ attendance: Attendance[] }>("/attendance")
            return response.attendance
        } catch (error) {
            console.error("Error fetching attendance:", error)
            return []
        }
    },

    getByEmployee: async (employeeId: string): Promise<Attendance[]> => {
        try {
            const response = await apiRequest<{ attendance: Attendance[] }>(`/attendance?employeeId=${employeeId}`)
            return response.attendance
        } catch (error) {
            console.error("Error fetching attendance by employee:", error)
            return []
        }
    },

    getByDate: async (date: string): Promise<Attendance[]> => {
        try {
            const response = await apiRequest<{ attendance: Attendance[] }>(`/attendance?date=${date}`)
            return response.attendance
        } catch (error) {
            console.error("Error fetching attendance by date:", error)
            return []
        }
    },

    add: async (attendance: Omit<Attendance, "id">): Promise<Attendance> => {
        const response = await apiRequest<{ attendance: Attendance }>("/attendance", {
            method: "POST",
            body: JSON.stringify(attendance),
        })
        return response.attendance
    },

    update: async (id: string, updates: Partial<Attendance>): Promise<Attendance | null> => {
        try {
            const response = await apiRequest<{ attendance: Attendance }>(`/attendance/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            })
            return response.attendance
        } catch (error) {
            console.error("Error updating attendance:", error)
            return null
        }
    },
}

// Leave service
export const leaveService = {
    getAll: async (): Promise<LeaveRequest[]> => {
        try {
            const response = await apiRequest<{ leaves: LeaveRequest[] }>("/leaves")
            return response.leaves
        } catch (error) {
            console.error("Error fetching leaves:", error)
            return []
        }
    },

    getByEmployee: async (employeeId: string): Promise<LeaveRequest[]> => {
        try {
            const response = await apiRequest<{ leaves: LeaveRequest[] }>(`/leaves?employeeId=${employeeId}`)
            return response.leaves
        } catch (error) {
            console.error("Error fetching leaves by employee:", error)
            return []
        }
    },

    getPending: async (): Promise<LeaveRequest[]> => {
        try {
            const response = await apiRequest<{ leaves: LeaveRequest[] }>("/leaves?status=pending")
            return response.leaves
        } catch (error) {
            console.error("Error fetching pending leaves:", error)
            return []
        }
    },

    add: async (leave: Omit<LeaveRequest, "id" | "created_at">): Promise<LeaveRequest> => {
        const response = await apiRequest<{ leave: LeaveRequest }>("/leaves", {
            method: "POST",
            body: JSON.stringify(leave),
        })
        return response.leave
    },

    update: async (id: string, updates: Partial<LeaveRequest>): Promise<LeaveRequest | null> => {
        try {
            const response = await apiRequest<{ leave: LeaveRequest }>(`/leaves/${id}`, {
                method: "PUT",
                body: JSON.stringify(updates),
            })
            return response.leave
        } catch (error) {
            console.error("Error updating leave:", error)
            return null
        }
    },
}

// Performance review service
export const reviewService = {
    getAll: async (): Promise<PerformanceReview[]> => {
        try {
            const response = await apiRequest<{ reviews: PerformanceReview[] }>("/reviews")
            return response.reviews
        } catch (error) {
            console.error("Error fetching reviews:", error)
            return []
        }
    },

    getByEmployee: async (employeeId: string): Promise<PerformanceReview[]> => {
        try {
            const response = await apiRequest<{ reviews: PerformanceReview[] }>(`/reviews?employeeId=${employeeId}`)
            return response.reviews
        } catch (error) {
            console.error("Error fetching reviews by employee:", error)
            return []
        }
    },

    add: async (review: Omit<PerformanceReview, "id" | "created_at" | "reviewer_id"> & { reviewer_id?: string }): Promise<PerformanceReview> => {
        const response = await apiRequest<{ review: PerformanceReview }>("/reviews", {
            method: "POST",
            body: JSON.stringify(review),
        })
        return response.review
    },
}


// Mock Data Service - Replaces Supabase
// This provides local state management and mock data for the HRM system

export interface User {
    id: string
    email: string
    role: "admin" | "employee"
    full_name: string
}

export interface Employee {
    id: string
    user_id?: string
    first_name: string
    last_name: string
    email: string
    department: string
    position: string
    hire_date?: string
    phone?: string
    status: "active" | "inactive"
    created_at: string
}

export interface Attendance {
    id: string
    employee_id: string
    date: string
    status: "present" | "absent" | "late" | "half-day"
    check_in?: string
    check_out?: string
    notes?: string
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
}

// Local storage keys
const STORAGE_KEYS = {
    USERS: "hrm_users",
    CURRENT_USER: "hrm_current_user",
    EMPLOYEES: "hrm_employees",
    ATTENDANCE: "hrm_attendance",
    LEAVES: "hrm_leaves",
    REVIEWS: "hrm_reviews",
}

// Initialize default data
const DEFAULT_ADMIN: User = {
    id: "admin-001",
    email: "admin@hrmsystem.com",
    role: "admin",
    full_name: "Admin User",
}

const DEFAULT_EMPLOYEES: Employee[] = [
    {
        id: "emp-001",
        user_id: "admin-001",
        first_name: "Admin",
        last_name: "User",
        email: "admin@hrmsystem.com",
        department: "Management",
        position: "System Administrator",
        hire_date: "2024-01-01",
        phone: "+1234567890",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "emp-002",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@hrmsystem.com",
        department: "Engineering",
        position: "Software Engineer",
        hire_date: "2024-02-15",
        phone: "+1234567891",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "emp-003",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@hrmsystem.com",
        department: "HR",
        position: "HR Manager",
        hire_date: "2024-01-10",
        phone: "+1234567892",
        status: "active",
        created_at: new Date().toISOString(),
    },
    {
        id: "emp-004",
        first_name: "Mike",
        last_name: "Johnson",
        email: "mike.johnson@hrmsystem.com",
        department: "Sales",
        position: "Sales Manager",
        hire_date: "2024-03-01",
        phone: "+1234567893",
        status: "active",
        created_at: new Date().toISOString(),
    },
]

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

// Initialize data if not exists
export const initializeData = () => {
    if (typeof window === "undefined") return

    // Initialize users
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, [])
    if (users.length === 0) {
        setInStorage(STORAGE_KEYS.USERS, [DEFAULT_ADMIN])
    }

    // Initialize employees
    const employees = getFromStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES, [])
    if (employees.length === 0) {
        setInStorage(STORAGE_KEYS.EMPLOYEES, DEFAULT_EMPLOYEES)
    }

    // Initialize other data
    getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, [])
    getFromStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVES, [])
    getFromStorage<PerformanceReview[]>(STORAGE_KEYS.REVIEWS, [])
}

// Auth service
export const authService = {
    login: async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
        // Simple mock authentication
        if (email === "admin@hrmsystem.com" && password === "admin123") {
            const user = DEFAULT_ADMIN
            setInStorage(STORAGE_KEYS.CURRENT_USER, user)
            return { user, error: null }
        }
        return { user: null, error: "Invalid email or password" }
    },

    signUp: async (email: string, password: string, fullName: string): Promise<{ user: User | null; error: string | null }> => {
        const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, [])

        // Check if user already exists
        if (users.find((u) => u.email === email)) {
            return { user: null, error: "User already exists" }
        }

        const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            role: "employee",
            full_name: fullName,
        }

        users.push(newUser)
        setInStorage(STORAGE_KEYS.USERS, users)
        setInStorage(STORAGE_KEYS.CURRENT_USER, newUser)

        return { user: newUser, error: null }
    },

    logout: async (): Promise<void> => {
        if (typeof window !== "undefined") {
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
        }
    },

    getUser: (): User | null => {
        return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
    },
}

// Employee service
export const employeeService = {
    getAll: (): Employee[] => {
        return getFromStorage<Employee[]>(STORAGE_KEYS.EMPLOYEES, [])
    },

    getById: (id: string): Employee | null => {
        const employees = employeeService.getAll()
        return employees.find((e) => e.id === id) || null
    },

    getByUserId: (userId: string): Employee | null => {
        const employees = employeeService.getAll()
        return employees.find((e) => e.user_id === userId) || null
    },

    add: (employee: Omit<Employee, "id" | "created_at">): Employee => {
        const employees = employeeService.getAll()
        const newEmployee: Employee = {
            ...employee,
            id: `emp-${Date.now()}`,
            created_at: new Date().toISOString(),
        }
        employees.push(newEmployee)
        setInStorage(STORAGE_KEYS.EMPLOYEES, employees)
        return newEmployee
    },

    update: (id: string, updates: Partial<Employee>): Employee | null => {
        const employees = employeeService.getAll()
        const index = employees.findIndex((e) => e.id === id)
        if (index === -1) return null

        employees[index] = { ...employees[index], ...updates }
        setInStorage(STORAGE_KEYS.EMPLOYEES, employees)
        return employees[index]
    },

    delete: (id: string): boolean => {
        const employees = employeeService.getAll()
        const filtered = employees.filter((e) => e.id !== id)
        setInStorage(STORAGE_KEYS.EMPLOYEES, filtered)
        return filtered.length < employees.length
    },
}

// Attendance service
export const attendanceService = {
    getAll: (): Attendance[] => {
        return getFromStorage<Attendance[]>(STORAGE_KEYS.ATTENDANCE, [])
    },

    getByEmployee: (employeeId: string): Attendance[] => {
        return attendanceService.getAll().filter((a) => a.employee_id === employeeId)
    },

    getByDate: (date: string): Attendance[] => {
        return attendanceService.getAll().filter((a) => a.date === date)
    },

    add: (attendance: Omit<Attendance, "id">): Attendance => {
        const records = attendanceService.getAll()
        const newRecord: Attendance = {
            ...attendance,
            id: `att-${Date.now()}`,
        }
        records.push(newRecord)
        setInStorage(STORAGE_KEYS.ATTENDANCE, records)
        return newRecord
    },

    update: (id: string, updates: Partial<Attendance>): Attendance | null => {
        const records = attendanceService.getAll()
        const index = records.findIndex((a) => a.id === id)
        if (index === -1) return null

        records[index] = { ...records[index], ...updates }
        setInStorage(STORAGE_KEYS.ATTENDANCE, records)
        return records[index]
    },
}

// Leave service
export const leaveService = {
    getAll: (): LeaveRequest[] => {
        return getFromStorage<LeaveRequest[]>(STORAGE_KEYS.LEAVES, [])
    },

    getByEmployee: (employeeId: string): LeaveRequest[] => {
        return leaveService.getAll().filter((l) => l.employee_id === employeeId)
    },

    getPending: (): LeaveRequest[] => {
        return leaveService.getAll().filter((l) => l.status === "pending")
    },

    add: (leave: Omit<LeaveRequest, "id" | "created_at">): LeaveRequest => {
        const leaves = leaveService.getAll()
        const newLeave: LeaveRequest = {
            ...leave,
            id: `leave-${Date.now()}`,
            created_at: new Date().toISOString(),
        }
        leaves.push(newLeave)
        setInStorage(STORAGE_KEYS.LEAVES, leaves)
        return newLeave
    },

    update: (id: string, updates: Partial<LeaveRequest>): LeaveRequest | null => {
        const leaves = leaveService.getAll()
        const index = leaves.findIndex((l) => l.id === id)
        if (index === -1) return null

        leaves[index] = { ...leaves[index], ...updates }
        setInStorage(STORAGE_KEYS.LEAVES, leaves)
        return leaves[index]
    },
}

// Performance review service
export const reviewService = {
    getAll: (): PerformanceReview[] => {
        return getFromStorage<PerformanceReview[]>(STORAGE_KEYS.REVIEWS, [])
    },

    getByEmployee: (employeeId: string): PerformanceReview[] => {
        return reviewService.getAll().filter((r) => r.employee_id === employeeId)
    },

    add: (review: Omit<PerformanceReview, "id" | "created_at">): PerformanceReview => {
        const reviews = reviewService.getAll()
        const newReview: PerformanceReview = {
            ...review,
            id: `review-${Date.now()}`,
            created_at: new Date().toISOString(),
        }
        reviews.push(newReview)
        setInStorage(STORAGE_KEYS.REVIEWS, reviews)
        return newReview
    },
}


# HRM System - Complete System Overview

**Version:** 2.0 (MySQL Backend)
**Status:** 🟢 Production Ready
**Last Updated:** January 2025

---

## System Architecture

### Technology Stack

**Frontend:**
- Next.js 16.0.7 (App Router)
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4.1.9
- Shadcn/ui components
- Recharts for data visualization

**Backend:**
- Next.js API Routes
- Prisma ORM 6.19.1
- MySQL 8.0+
- bcryptjs for password hashing
- mysql2 driver

### Architecture Diagram

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │ API Client   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP Requests (REST API)
┌───────────────────────▼─────────────────────────────────┐
│              API Routes (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth    │ │ Employees│ │Attendance│ │  Leaves  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐                                           │
│  │ Reviews  │                                           │
│  └──────────┘                                           │
└───────────────────────┬─────────────────────────────────┘
                        │ Prisma ORM
┌───────────────────────▼─────────────────────────────────┐
│              MySQL Database                              │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│  │Users │ │Employees│ │Attendance│ │Leaves│ │Reviews│  │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
└─────────────────────────────────────────────────────────┘
\`\`\`

---

## Database Schema

### Entity Relationship Diagram

\`\`\`
User (1) ──── (1) Employee
                │
                ├─── (N) Attendance
                ├─── (N) LeaveRequest
                ├─── (N) PerformanceReview (as employee)
                └─── (N) PerformanceReview (as reviewer)
\`\`\`

### Table Structures

#### User
- \`id\` (UUID, PK)
- \`email\` (Unique)
- \`password\` (Hashed)
- \`role\` (admin/employee)
- \`full_name\`
- \`created_at\`, \`updated_at\`

#### Employee
- \`id\` (UUID, PK)
- \`user_id\` (FK to User, Optional)
- \`first_name\`, \`last_name\`
- \`email\` (Unique)
- \`department\`, \`position\`
- \`hire_date\`, \`phone\`
- \`status\` (active/inactive)
- \`created_at\`, \`updated_at\`

#### Attendance
- \`id\` (UUID, PK)
- \`employee_id\` (FK, Indexed)
- \`date\` (Date, Indexed)
- \`status\` (present/absent/late/half-day)
- \`check_in\`, \`check_out\` (DateTime)
- \`notes\` (Text)
- \`created_at\`, \`updated_at\`

#### LeaveRequest
- \`id\` (UUID, PK)
- \`employee_id\` (FK, Indexed)
- \`leave_type\` (sick/casual/vacation/personal)
- \`start_date\`, \`end_date\` (Date)
- \`reason\` (Text)
- \`status\` (pending/approved/rejected, Indexed)
- \`created_at\`, \`updated_at\`

#### PerformanceReview
- \`id\` (UUID, PK)
- \`employee_id\` (FK, Indexed)
- \`reviewer_id\` (FK, Indexed)
- \`rating\` (Integer 1-5)
- \`comments\` (Text)
- \`review_date\` (Date)
- \`created_at\`, \`updated_at\`

---

For complete details see:
- **[CREDENTIALS.md](./CREDENTIALS.md)** - Credentials & database access
- **[SETUP.md](./SETUP.md)** - Setup instructions
- **[BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Complete API documentation
- **[README.md](./README.md)** - Main documentation

---

**System Status:** 🟢 **PRODUCTION READY**

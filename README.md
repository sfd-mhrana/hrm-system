# HRM System - Human Resource Management Platform

A complete, production-ready Human Resource Management system built with Next.js 16, React 19, MySQL, and Tailwind CSS.

## 🎯 Project Overview

This HRM system provides comprehensive HR management capabilities including employee management, attendance tracking, leave management, performance reviews, and analytics - all with role-based access control and MySQL database backend.

## ✨ Key Features

### 1. **Employee Management**
- Add and manage employee records
- Track employee information (department, position, hire date, contact)
- View employee profiles and history
- Manage employee status (active/inactive)

### 2. **Attendance System**
- Daily attendance tracking
- Check-in/check-out time recording
- Mark attendance as present/absent/late/half-day
- Attendance history and reports
- Attendance statistics

### 3. **Leave Management**
- Employee leave requests (Sick, Casual, Vacation, Personal)
- Admin approval/rejection workflow
- Leave tracking and history
- Leave balance management
- Pending requests notifications

### 4. **Performance Reviews**
- Create performance reviews for employees
- 5-star rating system with comments
- Review history tracking
- Employee performance insights

### 5. **HR Analytics & Reports**
- Dashboard with key metrics
- Total employees count
- Attendance rate calculations
- Leave request summaries
- Performance statistics
- Exportable reports

### 6. **Security & Access Control**
- Role-based access (Admin vs Employee)
- Secure local storage authentication
- Session management
- Data isolation per user

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+ (installed and running)
- npm/yarn/pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   # Create MySQL database
   mysql -u root -p -e "CREATE DATABASE hrm_system;"
   
   # Configure environment (copy .env.example to .env and update credentials)
   cp .env.example .env
   
   # Generate Prisma Client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed initial data
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000/auth/login
   ```

For detailed setup instructions, see [SETUP.md](./SETUP.md)

## 📝 Admin Credentials

**Default Login:**

```
Email: admin@hrmsystem.com
Password: admin123
```

⚠️ **IMPORTANT:** Change password after first login for security!

## 📂 Project Structure

```
├── app/
│   ├── auth/
│   │   ├── login/              # Login page
│   │   ├── sign-up/            # User registration
│   │   ├── sign-up-success/    # Success confirmation
│   │   └── error/              # Auth error handling
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard
│   │   ├── employees/          # Employee management
│   │   ├── attendance/         # All attendance (Admin)
│   │   ├── my-attendance/      # Own attendance (Employee)
│   │   ├── leaves/             # All leave requests (Admin)
│   │   ├── my-leaves/          # Own leaves (Employee)
│   │   ├── performance/        # Performance reviews
│   │   ├── profile/            # User profile
│   │   ├── reports/            # HR reports & analytics
│   │   ├── database/           # Database viewer (Admin)
│   │   └── layout.tsx          # Dashboard layout
│   ├── page.tsx                # Landing page
│   └── layout.tsx              # Root layout
├── components/
│   ├── sidebar-nav.tsx         # Navigation sidebar
│   ├── dashboard-header.tsx    # Header with user menu
│   ├── add-employee-dialog.tsx # Employee form dialog
│   └── ui/                     # Shadcn UI components
├── lib/
│   ├── api-client.ts            # API client service
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utility functions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                # Database seed script
└── ADMIN_CREDENTIALS.txt       # Quick credentials reference
```

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** MySQL 8.0+
- **Styling:** Tailwind CSS 4, Shadcn/ui components
- **Authentication:** bcryptjs password hashing, session management
- **Charts:** Recharts for analytics visualization
- **UI Components:** Radix UI primitives

## 📊 Data Management

### MySQL Database
All data is stored in a MySQL database with the following tables:
- **Users** - User profiles with roles (admin/employee), password hashing
- **Employees** - Employee records and information
- **Attendance** - Daily attendance logs with timestamps
- **LeaveRequests** - Leave applications and approvals
- **PerformanceReviews** - Performance evaluations and ratings

Data persists permanently in the database and is accessible across all devices and browsers.

## 🔐 Security Features

- Role-based access control (RBAC)
- Secure password validation
- Session management
- Protected routes with middleware
- Data isolation per user role

## 🎨 UI/UX Features

- Clean, professional design with blue/gray color scheme
- Fully responsive layout (mobile, tablet, desktop)
- Dark mode support
- Real-time data updates
- Intuitive sidebar navigation
- Form validation and error handling
- Toast notifications for user feedback
- Loading states and skeleton screens
- Accessible components (ARIA labels)

## 📱 User Roles & Permissions

### Admin Access
- Full system access
- Employee management (add/edit/delete)
- Mark and view all attendance records
- Approve/reject leave requests
- Create performance reviews
- Access all reports and analytics
- View database tables
- System configuration

### Employee Access
- View and edit own profile
- Mark own attendance
- View own attendance history
- Request leave
- View own leave requests and status
- View own performance reviews
- Access personal dashboard

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Set up MySQL database (e.g., PlanetScale, Railway, or AWS RDS)
2. Configure environment variables in Vercel:
   - `DATABASE_URL` - MySQL connection string
   - Or individual DB variables (DB_HOST, DB_PORT, etc.)
3. Push code to GitHub repository
4. Import project to Vercel
5. Run database migrations: `npm run db:migrate`
6. Seed initial data: `npm run db:seed`
7. Deploy automatically

**Note:** You'll need a MySQL database instance for production deployment.

## 📝 Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint checks
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:setup-env # Setup environment variables
```

## 🎓 Perfect for Final Year Projects

This system demonstrates:
- Full-stack web development with modern technologies
- State management and data persistence
- Authentication and authorization implementation
- Role-based access control (RBAC)
- Modern React patterns and hooks
- TypeScript for type safety
- Responsive UI/UX design
- Security best practices
- Production-ready deployment

## ✅ System Status

**Authentication:** ✓ Active with bcryptjs password hashing  
**Database:** ✓ MySQL with Prisma ORM  
**API:** ✓ REST API with 13 endpoints  
**UI:** ✓ Complete and responsive  
**Sample Data:** ✓ 4 employees (1 admin + 3 test) seeded  
**Data Storage:** ✓ MySQL database configured  

**Status: 🟢 PRODUCTION READY**

See [MIGRATION_REPORT.md](./MIGRATION_REPORT.md) for detailed migration information.

## 📄 License

This project is provided for educational purposes (university final year project).

---

**Built with ❤️ for comprehensive HR management**

For questions or issues, check the console logs for debugging information.

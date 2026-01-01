# HRM System - Human Resource Management Platform

A complete, production-ready Human Resource Management system built with Next.js 16, React 19, and Tailwind CSS.

## 🎯 Project Overview

This HRM system provides comprehensive HR management capabilities including employee management, attendance tracking, leave management, performance reviews, and analytics - all with role-based access control and local data storage.

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
- npm/yarn/pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3000/auth/login
   ```

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
│   ├── mock-data.ts            # Local data service
│   └── utils.ts                # Utility functions
└── ADMIN_CREDENTIALS.txt       # Quick credentials reference
```

## 🛠 Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, Shadcn/ui components
- **Data Storage:** Local Storage (Browser)
- **Authentication:** Local state management
- **Charts:** Recharts for analytics visualization
- **UI Components:** Radix UI primitives

## 📊 Data Management

### Local Storage
All data is stored locally in your browser using localStorage:
- **Users** - User profiles with roles (admin/employee)
- **Employees** - Employee records and information
- **Attendance** - Daily attendance logs with timestamps
- **Leave Requests** - Leave applications and approvals
- **Performance Reviews** - Performance evaluations and ratings

Data persists across browser sessions but is specific to each browser.

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

1. Push code to GitHub repository
2. Import project to Vercel
3. Deploy automatically
4. Access via provided URL

Note: All data is stored locally in the browser, so no backend/database configuration is needed.

## 📝 Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint checks
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

**Authentication:** ✓ Active with admin account  
**UI:** ✓ Complete and responsive  
**Sample Data:** ✓ 4 employees (1 admin + 3 test)  
**Data Storage:** ✓ Local storage configured  

**Status: 🟢 PRODUCTION READY**

## 📄 License

This project is provided for educational purposes (university final year project).

---

**Built with ❤️ for comprehensive HR management**

For questions or issues, check the console logs for debugging information.

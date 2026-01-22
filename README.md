# HRM System - Human Resource Management Platform

A complete, production-ready Human Resource Management system built with Next.js 16, React 19, MySQL, and Tailwind CSS.

## 🎯 Overview

This HRM system provides comprehensive HR management capabilities including employee management, attendance tracking, leave management, performance reviews, and analytics - all with role-based access control and MySQL database backend.

## ✨ Key Features

- **Employee Management** - Add, view, update, and manage employee records
- **Attendance System** - Daily attendance tracking with check-in/check-out times
- **Leave Management** - Employee leave requests with admin approval workflow
- **Performance Reviews** - 5-star rating system with reviewer comments
- **HR Analytics & Reports** - Dashboard with key metrics and statistics
- **Security & Access Control** - Role-based access (Admin vs Employee)

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

   # Copy environment template
   cp .env.example .env

   # Edit .env with your database credentials
   # Then setup database
   npm run db:setup
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000/auth/login
   ```

## 📝 Default Credentials

**Admin Login:**
```
Email:    admin@hrmsystem.com
Password: admin123
```

⚠️ **Change password after first login!**

For complete credentials and database details, see **[CREDENTIALS.md](./CREDENTIALS.md)**

## 📚 Documentation

- **[CREDENTIALS.md](./CREDENTIALS.md)** - Login credentials & database access
- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[OVERVIEW.md](./OVERVIEW.md)** - Complete system overview
- **[BACKEND_GUIDE.md](./BACKEND_GUIDE.md)** - Backend API documentation
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing instructions
- **[SCRIPTS_REFERENCE.md](./SCRIPTS_REFERENCE.md)** - npm scripts reference
- **[MIGRATION_REPORT.md](./MIGRATION_REPORT.md)** - Migration details

## 🛠 Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Next.js API Routes, Prisma ORM 6.19.1
- **Database:** MySQL 8.0+
- **UI Components:** Shadcn/ui (Radix UI primitives)
- **Authentication:** bcryptjs password hashing

## 📊 Database Schema

- **User** - Authentication and user accounts
- **Employee** - Employee records and profiles
- **Attendance** - Daily attendance logs
- **LeaveRequest** - Leave applications and approvals
- **PerformanceReview** - Performance evaluations

## 🔐 Security Features

- Role-based access control (RBAC)
- Password hashing with bcryptjs
- Protected routes with authorization
- Data isolation per user role
- SQL injection prevention (Prisma ORM)

## 📱 User Roles

### Admin Access
- Full system access and employee management
- Mark and view all attendance records
- Approve/reject leave requests
- Create performance reviews
- Access all reports and database viewer

### Employee Access
- View and edit own profile
- Mark own attendance
- Request leave and view status
- View own performance reviews

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run db:setup     # Complete database setup
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:reset     # Reset database (WARNING: deletes all data)
```

See **[SCRIPTS_REFERENCE.md](./SCRIPTS_REFERENCE.md)** for complete list.

## 🚢 Deployment

### Deploy to Vercel

1. Set up MySQL database (PlanetScale, Railway, AWS RDS)
2. Configure `DATABASE_URL` environment variable in Vercel
3. Push code to GitHub repository
4. Import project to Vercel
5. Run migrations: `npm run db:migrate:deploy`
6. Seed data: `npm run db:seed`

## ✅ System Status

**Status: 🟢 PRODUCTION READY**

- ✅ Authentication with bcryptjs
- ✅ MySQL database with Prisma ORM
- ✅ REST API with 13 endpoints
- ✅ Complete and responsive UI
- ✅ Sample data seeded (1 admin + 3 employees)

## 🎓 Perfect for Learning

This system demonstrates:
- Full-stack development with modern technologies
- REST API implementation
- Database design and relationships
- Authentication and authorization
- Role-based access control (RBAC)
- TypeScript for type safety
- Responsive UI/UX design
- Production-ready deployment

## 📄 License

This project is provided for educational purposes.

---

**Built with ❤️ for comprehensive HR management**

For questions or issues, check the documentation files or console logs for debugging.

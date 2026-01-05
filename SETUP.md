# HRM System - MySQL Setup Guide

This guide will help you set up the HRM system with MySQL database.

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8.0 or higher)
- npm or pnpm

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Database

1. Create a MySQL database:
```sql
CREATE DATABASE hrm_system;
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hrm_system
```

4. Generate the DATABASE_URL from these variables:
```bash
npm run db:setup-env
```

This will automatically construct the `DATABASE_URL` from your individual database variables.

**Note:** You can also manually set `DATABASE_URL` in `.env` if you prefer:
```
DATABASE_URL="mysql://root:root@localhost:3306/hrm_system"
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Push Database Schema

This will create all tables in your MySQL database:
```bash
npm run db:push
```

Alternatively, you can use migrations:
```bash
npm run db:migrate
```

### 5. Seed Initial Data

This will create the default admin user and sample employees:
```bash
npm run db:seed
```

**Default Admin Credentials:**
- Email: `admin@hrmsystem.com`
- Password: `admin123`

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Commands

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (for development)
- `npm run db:migrate` - Create and apply migrations (for production)
- `npm run db:seed` - Seed database with initial data

## API Endpoints

All API endpoints are under `/api`:

- **Auth**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/user`
- **Employees**: `/api/employees`, `/api/employees/[id]`, `/api/employees/by-user/[userId]`
- **Attendance**: `/api/attendance`, `/api/attendance/[id]`
- **Leaves**: `/api/leaves`, `/api/leaves/[id]`
- **Reviews**: `/api/reviews`, `/api/reviews/[id]`

## Troubleshooting

### Database Connection Issues

1. Ensure MySQL server is running
2. Verify your connection string in `.env`
3. Check that the database exists
4. Verify user permissions

### Prisma Client Issues

If you get "Prisma Client not generated" errors:
```bash
npm run db:generate
```

### Migration Issues

If you need to reset the database:
```bash
npx prisma migrate reset
npm run db:seed
```

## Production Deployment

For production:

1. Use migrations instead of `db:push`:
```bash
npm run db:migrate
```

2. Set `DATABASE_URL` environment variable in your hosting platform

3. Build the application:
```bash
npm run build
npm start
```


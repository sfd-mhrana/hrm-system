# Backend API Guide

## How to Run the Backend

In Next.js, the backend (API routes) runs together with the frontend in a single server.

### Development Mode

```bash
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000/api/*

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## Backend API Endpoints

All API endpoints are located in `app/api/` directory and are automatically served at `/api/*`

### Base URL
```
http://localhost:3000/api
```

### Available Endpoints

#### Authentication (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

#### Employees (`/api/employees`)
- `GET /api/employees` - List all employees
- `GET /api/employees/[id]` - Get employee by ID
- `GET /api/employees/by-user/[userId]` - Get employee by user ID
- `POST /api/employees` - Create employee (admin only)
- `PUT /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee (admin only)

#### Attendance (`/api/attendance`)
- `GET /api/attendance` - List attendance records
- `GET /api/attendance?employeeId=X` - Filter by employee
- `GET /api/attendance?date=YYYY-MM-DD` - Filter by date
- `GET /api/attendance/[id]` - Get attendance record
- `POST /api/attendance` - Create attendance record
- `PUT /api/attendance/[id]` - Update attendance record
- `DELETE /api/attendance/[id]` - Delete attendance record (admin only)

#### Leaves (`/api/leaves`)
- `GET /api/leaves` - List leave requests
- `GET /api/leaves?employeeId=X` - Filter by employee
- `GET /api/leaves?status=pending` - Filter by status
- `GET /api/leaves/[id]` - Get leave request
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/[id]` - Update leave request
- `DELETE /api/leaves/[id]` - Delete leave request

#### Reviews (`/api/reviews`)
- `GET /api/reviews` - List performance reviews
- `GET /api/reviews?employeeId=X` - Filter by employee
- `GET /api/reviews/[id]` - Get performance review
- `POST /api/reviews` - Create review (admin only)
- `PUT /api/reviews/[id]` - Update review (admin only)
- `DELETE /api/reviews/[id]` - Delete review (admin only)

---

## Testing the Backend

### 1. Using Browser
Open your browser and navigate to:
```
http://localhost:3000/api/auth/user
```

### 2. Using curl

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrmsystem.com","password":"admin123"}'

# Test get employees (requires auth headers)
curl http://localhost:3000/api/employees \
  -H "x-user-id: <user-id>" \
  -H "x-user-role: admin"
```

### 3. Using Postman/Insomnia
- Import the API endpoints
- Set base URL: `http://localhost:3000/api`
- Add headers: `x-user-id` and `x-user-role` for authenticated requests

### 4. Using the Frontend
The frontend automatically calls these APIs through `lib/api-client.ts`

---

## Backend Architecture

### File Structure
```
app/api/
├── auth/
│   ├── login/route.ts
│   ├── signup/route.ts
│   ├── logout/route.ts
│   └── user/route.ts
├── employees/
│   ├── route.ts
│   ├── [id]/route.ts
│   └── by-user/[userId]/route.ts
├── attendance/
│   ├── route.ts
│   └── [id]/route.ts
├── leaves/
│   ├── route.ts
│   └── [id]/route.ts
└── reviews/
    ├── route.ts
    └── [id]/route.ts
```

### How It Works

1. **Request** → Next.js receives HTTP request
2. **Route Handler** → Matches URL to route file
3. **Prisma Query** → Executes database query
4. **Response** → Returns JSON response

### Example API Route

```typescript
// app/api/employees/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const employees = await prisma.employee.findMany()
  return NextResponse.json({ employees })
}
```

---

## Database Connection

The backend connects to MySQL using Prisma ORM:

1. **Prisma Client** (`lib/prisma.ts`) - Database client
2. **Schema** (`prisma/schema.prisma`) - Database schema
3. **Connection** - Via `DATABASE_URL` environment variable

### Verify Database Connection

```bash
# Check if database is accessible
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555 where you can view/edit database.

---

## Environment Variables

Backend requires these environment variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hrm_system

# Prisma Connection String
DATABASE_URL="mysql://root:root@localhost:3306/hrm_system"
```

---

## Common Backend Tasks

### Start Backend
```bash
npm run dev
```

### Check Backend Status
```bash
# Visit API endpoint in browser
http://localhost:3000/api/auth/user
```

### View Database
```bash
npm run db:studio
```

### Reset Database
```bash
npm run db:reset
```

### Check Logs
Backend logs appear in the terminal where you ran `npm run dev`

---

## Troubleshooting

### Backend Not Starting
1. Check if port 3000 is available
2. Verify database connection in `.env`
3. Run `npm run db:generate` to ensure Prisma Client is generated

### API Returns 500 Error
1. Check database connection
2. Verify environment variables
3. Check terminal for error messages
4. Ensure database schema is pushed: `npm run db:push`

### Database Connection Error
1. Verify MySQL is running
2. Check `.env` file has correct credentials
3. Test connection: `npm run db:studio`

---

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `npm run dev` |
| Test API | Visit `http://localhost:3000/api/*` |
| View database | `npm run db:studio` |
| Reset database | `npm run db:reset` |
| Check types | `npm run type-check` |

---

**Note:** In Next.js, there's no separate backend server. The API routes are part of the Next.js server and run automatically when you start the dev server.


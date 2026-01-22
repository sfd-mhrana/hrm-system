# HRM System - Credentials & Access

## 🔐 Admin Login Credentials

**Login URL:** http://localhost:3000/auth/login

**Default Admin Account:**
```
Email:    admin@hrmsystem.com
Password: admin123
Role:     Administrator
```

⚠️ **SECURITY:** Change the default password after first login!

---

## 🗄️ Database Configuration

### MySQL Database Connection

**Database Details:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hrm_system
```

**Connection String:**
```
DATABASE_URL="mysql://root:root@localhost:3306/hrm_system"
```

### Database Management Tools

**Prisma Studio (GUI):**
```bash
npm run db:studio
# Opens at: http://localhost:5555
```

**MySQL CLI:**
```bash
mysql -u root -p hrm_system
```

---

## 👥 Sample Employee Accounts

The system includes 4 pre-seeded employees:

### 1. Admin User (You can login with this)
- **Email:** admin@hrmsystem.com
- **Password:** admin123
- **Department:** Management
- **Position:** System Administrator
- **Status:** Active

### 2. John Doe
- **Email:** john.doe@hrmsystem.com
- **Department:** Engineering
- **Position:** Software Engineer
- **Status:** Active
- **Note:** No user login credentials (employee record only)

### 3. Jane Smith
- **Email:** jane.smith@hrmsystem.com
- **Department:** HR
- **Position:** HR Manager
- **Status:** Active
- **Note:** No user login credentials (employee record only)

### 4. Mike Johnson
- **Email:** mike.johnson@hrmsystem.com
- **Department:** Sales
- **Position:** Sales Manager
- **Status:** Active
- **Note:** No user login credentials (employee record only)

---

## 🎯 Admin Capabilities

With the admin account, you can:

- ✅ Full employee management (add, edit, delete)
- ✅ View all attendance records
- ✅ Mark attendance for any employee
- ✅ Approve/reject all leave requests
- ✅ Create performance reviews for any employee
- ✅ Access all HR reports and analytics
- ✅ View database tables directly
- ✅ System configuration and management

---

## 🛠️ Quick Database Commands

### Reset Database
```bash
npm run db:reset
# Warning: Deletes all data and reseeds with defaults
```

### Seed Database
```bash
npm run db:seed
# Restores admin account and sample employees
```

### View Database
```bash
npm run db:studio
```

### Generate Prisma Client
```bash
npm run db:generate
```

### Push Schema Changes
```bash
npm run db:push
```

---

## 🔄 Creating New User Accounts

### Via Application UI:
1. Go to http://localhost:3000/auth/sign-up
2. Fill in registration form
3. New account will have "employee" role by default

### Via Database Seeding:
Edit `prisma/seed.ts` and add:
```typescript
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    password: await bcrypt.hash('password123', 10),
    role: 'employee', // or 'admin'
    full_name: 'New User',
  },
})
```

Then run: `npm run db:seed`

---

## 📝 Environment Variables Reference

Copy these to your `.env` file:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=hrm_system

# Prisma Connection String (auto-generated)
DATABASE_URL="mysql://root:root@localhost:3306/hrm_system"
```

---

## 🚨 Troubleshooting

### Cannot Login
- Verify database is running: `mysql -u root -p`
- Check if admin user exists: `npm run db:studio`
- Reset database: `npm run db:reset`

### Database Connection Error
- Verify MySQL is running
- Check credentials in `.env` file
- Test connection: `mysql -u root -p -e "SELECT 1"`

### Forgot Password
- Reset database: `npm run db:reset`
- This restores default admin password: `admin123`

---

## 🔒 Security Best Practices

1. **Change Default Password**
   - Login with admin123
   - Go to Profile settings
   - Update password immediately

2. **Database Security**
   - Don't use root user in production
   - Create dedicated MySQL user with limited permissions
   - Use strong passwords

3. **Environment Variables**
   - Never commit `.env` file to git
   - Use different credentials for production
   - Rotate passwords regularly

---

**Last Updated:** January 2025
**System Version:** 2.0 (MySQL Backend)

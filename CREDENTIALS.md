# HRM System - Credentials & Access

## 🎯 Quick Start - Available Logins

**Login URL:** http://localhost:3000/auth/login

### Pre-configured User Accounts (4 Total)

**✅ Admin Account:**
```
Email:    admin@hrmsystem.com
Password: admin123
Role:     Administrator
```

**✅ Employee Accounts:**
```
Email:    john.doe@hrmsystem.com
Password: john123
Role:     Employee (Engineering - Software Engineer)

Email:    jane.smith@hrmsystem.com
Password: jane123
Role:     Employee (HR - HR Manager)

Email:    mike.johnson@hrmsystem.com
Password: mike123
Role:     Employee (Sales - Sales Manager)
```

⚠️ **SECURITY:** Change all default passwords after first login!

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

## 👥 Pre-seeded Data in Database

After running `npm run db:seed`, you get **4 complete user accounts** with login credentials:

### ✅ Admin Account (1)
**Admin User:**
- **Email:** admin@hrmsystem.com
- **Password:** admin123
- **Role:** admin
- **Can Login:** ✅ YES
- **Department:** Management
- **Position:** System Administrator

### ✅ Employee Accounts (3)
All employees now have login credentials:

**1. John Doe:**
- **Email:** john.doe@hrmsystem.com
- **Password:** john123
- **Role:** employee
- **Can Login:** ✅ YES
- **Department:** Engineering
- **Position:** Software Engineer

**2. Jane Smith:**
- **Email:** jane.smith@hrmsystem.com
- **Password:** jane123
- **Role:** employee
- **Can Login:** ✅ YES
- **Department:** HR
- **Position:** HR Manager

**3. Mike Johnson:**
- **Email:** mike.johnson@hrmsystem.com
- **Password:** mike123
- **Role:** employee
- **Can Login:** ✅ YES
- **Department:** Sales
- **Position:** Sales Manager

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

## 🔄 How to Create New User Accounts

### Method 1: Via Application UI (Easiest)
1. **Go to signup page:** http://localhost:3000/auth/sign-up
2. **Fill in the form:**
   - First Name
   - Last Name
   - Email
   - Password
   - Confirm Password
3. **Click "Sign Up"**
4. **Result:** New user created with "employee" role
5. **Login:** Use the email and password you just created

**Example:**
```
Email: john@example.com
Password: MyPassword123
```

---

### Method 2: Via Seed Script (Programmatic)

**Step 1: Edit the seed file**
Open `prisma/seed.ts` and add new users:

```typescript
// Add this after the admin user creation
const employeeUser = await prisma.user.upsert({
  where: { email: 'employee@hrmsystem.com' },
  update: {},
  create: {
    email: 'employee@hrmsystem.com',
    password: await bcrypt.hash('employee123', 10),
    role: 'employee',
    full_name: 'Test Employee',
  },
})

console.log('Created employee user:', employeeUser.email)

// Create corresponding employee record (optional)
await prisma.employee.upsert({
  where: { user_id: employeeUser.id },
  update: {},
  create: {
    user_id: employeeUser.id,
    first_name: 'Test',
    last_name: 'Employee',
    email: 'employee@hrmsystem.com',
    department: 'IT',
    position: 'Developer',
    hire_date: new Date(),
    phone: '+1234567899',
    status: 'active',
  },
})
```

**Step 2: Run the seed script**
```bash
npm run db:seed
```

**Result:**
- **Email:** employee@hrmsystem.com
- **Password:** employee123
- **Role:** employee

---

### Method 3: Via Prisma Studio (GUI)

**Step 1: Open Prisma Studio**
```bash
npm run db:studio
# Opens at http://localhost:5555
```

**Step 2: Create User**
1. Click on "User" table
2. Click "Add record"
3. Fill in fields:
   - **id:** (auto-generated)
   - **email:** newuser@example.com
   - **password:** (⚠️ Must be bcrypt hashed - see note below)
   - **role:** employee or admin
   - **full_name:** New User Name
4. Click "Save 1 change"

⚠️ **Password Hashing:** You cannot enter plain text passwords in Prisma Studio. Use Method 1 or 2 instead.

---

### Method 4: Via MySQL CLI (Advanced)

**Step 1: Hash your password first**
Create a script `hash-password.js`:
```javascript
const bcrypt = require('bcryptjs');
const password = 'YourPassword123';
const hash = bcrypt.hashSync(password, 10);
console.log(hash);
```

Run: `node hash-password.js`

**Step 2: Insert into database**
```bash
mysql -u root -p hrm_system
```

```sql
-- Replace <HASHED_PASSWORD> with the hash from step 1
INSERT INTO User (id, email, password, role, full_name, created_at, updated_at)
VALUES (
  UUID(),
  'newuser@example.com',
  '<HASHED_PASSWORD>',
  'employee',
  'New User',
  NOW(),
  NOW()
);
```

---

## 📋 Complete List of Pre-configured Accounts

### All 4 Accounts Ready to Login

| Name | Email | Password | Role | Department |
|------|-------|----------|------|------------|
| Admin User | admin@hrmsystem.com | admin123 | admin | Management |
| John Doe | john.doe@hrmsystem.com | john123 | employee | Engineering |
| Jane Smith | jane.smith@hrmsystem.com | jane123 | employee | HR |
| Mike Johnson | mike.johnson@hrmsystem.com | mike123 | employee | Sales |

✅ **All accounts are ready to use immediately after running `npm run db:seed`**

---

## 💡 Quick User Creation Example

Want to create a test employee quickly? Use the signup page:

1. **Visit:** http://localhost:3000/auth/sign-up
2. **Enter:**
   ```
   First Name: Test
   Last Name: User
   Email: test@example.com
   Password: test123
   Confirm Password: test123
   ```
3. **Click:** Sign Up
4. **Done!** You can now login with test@example.com / test123

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

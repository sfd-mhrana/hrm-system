# Testing Guide - HRM System

## 🚀 Server Status

The development server should be running at:
**http://localhost:3000**

---

## 📋 Testing Checklist

### 1. Frontend Pages Testing

#### Home Page
- **URL:** http://localhost:3000
- **Expected:** Landing page with login/signup buttons
- **Test:** Click "Login" or "Sign Up" buttons

#### Login Page
- **URL:** http://localhost:3000/auth/login
- **Credentials:**
  ```
  Email: admin@hrmsystem.com
  Password: admin123
  ```
- **Test:** 
  - Enter credentials
  - Click "Login"
  - Should redirect to dashboard

#### Sign Up Page
- **URL:** http://localhost:3000/auth/sign-up
- **Test:**
  - Fill in form (First Name, Last Name, Email, Password)
  - Click "Sign Up"
  - Should create account and redirect

#### Dashboard
- **URL:** http://localhost:3000/dashboard
- **Test:**
  - Should show statistics cards
  - Should display total employees, present today, pending leaves
  - Check sidebar navigation

---

### 2. Dashboard Pages Testing (Admin)

#### Employees Page
- **URL:** http://localhost:3000/dashboard/employees
- **Test:**
  - View employee list
  - Click "Add Employee" button
  - Fill form and submit
  - Verify employee appears in list

#### Attendance Page
- **URL:** http://localhost:3000/dashboard/attendance
- **Test:**
  - Select date filter
  - View attendance records
  - Check table displays correctly

#### Leave Requests Page
- **URL:** http://localhost:3000/dashboard/leaves
- **Test:**
  - View all leave requests
  - Click "Approve" or "Reject" on pending leaves
  - Verify status changes

#### Performance Reviews Page
- **URL:** http://localhost:3000/dashboard/performance
- **Test:**
  - Click "Add Review"
  - Select employee, enter rating and comments
  - Submit and verify review appears

#### Reports Page
- **URL:** http://localhost:3000/dashboard/reports
- **Test:**
  - View statistics cards
  - Check all metrics display correctly
  - Verify calculations

#### Database Viewer
- **URL:** http://localhost:3000/dashboard/database
- **Test:**
  - Switch between tabs (Employees, Attendance, Leaves, Reviews)
  - Verify data displays in tables
  - Check all records are visible

---

### 3. Employee Pages Testing

#### My Profile
- **URL:** http://localhost:3000/dashboard/profile
- **Test:**
  - View own employee information
  - Verify all fields display correctly

#### My Attendance
- **URL:** http://localhost:3000/dashboard/my-attendance
- **Test:**
  - Click "Mark Present Today" or "Mark Absent Today"
  - Verify attendance record appears
  - Check history table

#### My Leaves
- **URL:** http://localhost:3000/dashboard/my-leaves
- **Test:**
  - Click "Request Leave"
  - Fill in leave form (type, dates, reason)
  - Submit and verify request appears
  - Check status updates

---

### 4. API Endpoints Testing

Open browser console (F12) or use these URLs directly:

#### Authentication APIs

**Test Login:**
```
POST http://localhost:3000/api/auth/login
Body: {
  "email": "admin@hrmsystem.com",
  "password": "admin123"
}
```

**Test Get User:**
```
GET http://localhost:3000/api/auth/user
Headers: {
  "x-user-id": "<user-id>",
  "x-user-role": "admin"
}
```

#### Employee APIs

**Get All Employees:**
```
GET http://localhost:3000/api/employees
Headers: {
  "x-user-id": "<user-id>",
  "x-user-role": "admin"
}
```

**Get Employee by ID:**
```
GET http://localhost:3000/api/employees/<employee-id>
```

#### Attendance APIs

**Get Attendance:**
```
GET http://localhost:3000/api/attendance
GET http://localhost:3000/api/attendance?date=2025-01-05
GET http://localhost:3000/api/attendance?employeeId=<id>
```

#### Leave APIs

**Get Leaves:**
```
GET http://localhost:3000/api/leaves
GET http://localhost:3000/api/leaves?status=pending
```

#### Review APIs

**Get Reviews:**
```
GET http://localhost:3000/api/reviews
```

---

### 5. Browser Console Testing

1. **Open Browser Console** (F12 or Right-click → Inspect)
2. **Navigate to any page**
3. **Check for errors:**
   - No red errors in console
   - Network requests return 200 status
   - API calls successful

4. **Test API calls manually:**
```javascript
// In browser console
fetch('/api/employees', {
  headers: {
    'x-user-id': '<your-user-id>',
    'x-user-role': 'admin'
  }
})
.then(r => r.json())
.then(data => console.log('Employees:', data))
```

---

### 6. Functional Testing

#### Test Employee Management
1. Login as admin
2. Go to Employees page
3. Add new employee
4. Verify employee appears in list
5. Try to edit employee
6. Try to delete employee (if admin)

#### Test Attendance
1. Login as employee
2. Go to My Attendance
3. Mark present for today
4. Verify record appears
5. Check attendance history

#### Test Leave Request
1. Login as employee
2. Go to My Leaves
3. Request a leave
4. Login as admin
5. Go to Leave Requests
6. Approve the leave
7. Login back as employee
8. Verify leave status changed

#### Test Performance Review
1. Login as admin
2. Go to Performance page
3. Add a review for an employee
4. Verify review appears
5. Login as that employee
6. Check if review is visible

---

### 7. UI/UX Testing

#### Responsive Design
- **Test on different screen sizes:**
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)

#### Dark Mode
- **Test theme toggle:**
  - Click theme switcher
  - Verify colors change
  - Check readability

#### Navigation
- **Test sidebar:**
  - Click all menu items
  - Verify navigation works
  - Check active state highlighting

#### Forms
- **Test validation:**
  - Submit empty forms
  - Enter invalid data
  - Verify error messages
  - Check required fields

---

### 8. Error Handling Testing

#### Test Invalid Login
- Enter wrong email/password
- Should show error message
- Should not redirect

#### Test Unauthorized Access
- Try to access admin pages as employee
- Should redirect or show error

#### Test Network Errors
- Disconnect internet
- Try to make API calls
- Should handle gracefully

---

## 🐛 Common Issues & Solutions

### Server Not Starting
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Restart server
npm run dev
```

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u root -p -e "SELECT 1"

# Check .env file
cat .env | grep DATABASE_URL

# Regenerate Prisma Client
npm run db:generate
```

### API Returns 500 Error
- Check browser console for errors
- Check terminal for server errors
- Verify database is accessible
- Run `npm run db:push` to ensure schema is synced

### Page Not Loading
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check network tab in DevTools

---

## ✅ Success Criteria

All tests pass if:
- ✅ Server starts without errors
- ✅ Login works with admin credentials
- ✅ Dashboard loads and shows data
- ✅ All pages are accessible
- ✅ CRUD operations work (Create, Read, Update, Delete)
- ✅ API endpoints return correct data
- ✅ No console errors
- ✅ Responsive design works
- ✅ Dark mode works
- ✅ Forms validate correctly

---

## 📝 Testing Notes

**Default Admin Account:**
- Email: `admin@hrmsystem.com`
- Password: `admin123`

**Test Data:**
- 1 Admin user
- 4 Employees (including admin)
- Sample data seeded automatically

**API Base URL:**
- http://localhost:3000/api

---

## 🎯 Quick Test Commands

```bash
# Check server status
curl http://localhost:3000

# Test API endpoint
curl http://localhost:3000/api/auth/user

# View database
npm run db:studio
```

---

**Happy Testing! 🚀**


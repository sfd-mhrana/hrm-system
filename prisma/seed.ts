import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables - must be called before importing PrismaClient
dotenv.config()

// For Prisma 7, we need to ensure DATABASE_URL is set
// The client should read it from environment automatically
// If it doesn't work, Prisma 7 may require adapter configuration
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hrmsystem.com' },
    update: {},
    create: {
      email: 'admin@hrmsystem.com',
      password: adminPassword,
      role: 'admin',
      full_name: 'Admin User',
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create admin employee record
  const adminEmployee = await prisma.employee.upsert({
    where: { user_id: adminUser.id },
    update: {},
    create: {
      user_id: adminUser.id,
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@hrmsystem.com',
      department: 'Management',
      position: 'System Administrator',
      hire_date: new Date('2024-01-01'),
      phone: '+1234567890',
      status: 'active',
    },
  })

  console.log('Created admin employee record')

  // Create John Doe user account and employee
  const johnPassword = await bcrypt.hash('john123', 10)
  const johnUser = await prisma.user.upsert({
    where: { email: 'john.doe@hrmsystem.com' },
    update: {},
    create: {
      email: 'john.doe@hrmsystem.com',
      password: johnPassword,
      role: 'employee',
      full_name: 'John Doe',
    },
  })
  console.log('Created user account: john.doe@hrmsystem.com')

  await prisma.employee.upsert({
    where: { email: 'john.doe@hrmsystem.com' },
    update: { user_id: johnUser.id },
    create: {
      user_id: johnUser.id,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@hrmsystem.com',
      department: 'Engineering',
      position: 'Software Engineer',
      hire_date: new Date('2024-02-15'),
      phone: '+1234567891',
      status: 'active',
    },
  })
  console.log('Created employee: John Doe')

  // Create Jane Smith user account and employee
  const janePassword = await bcrypt.hash('jane123', 10)
  const janeUser = await prisma.user.upsert({
    where: { email: 'jane.smith@hrmsystem.com' },
    update: {},
    create: {
      email: 'jane.smith@hrmsystem.com',
      password: janePassword,
      role: 'employee',
      full_name: 'Jane Smith',
    },
  })
  console.log('Created user account: jane.smith@hrmsystem.com')

  await prisma.employee.upsert({
    where: { email: 'jane.smith@hrmsystem.com' },
    update: { user_id: janeUser.id },
    create: {
      user_id: janeUser.id,
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@hrmsystem.com',
      department: 'HR',
      position: 'HR Manager',
      hire_date: new Date('2024-01-10'),
      phone: '+1234567892',
      status: 'active',
    },
  })
  console.log('Created employee: Jane Smith')

  // Create Mike Johnson user account and employee
  const mikePassword = await bcrypt.hash('mike123', 10)
  const mikeUser = await prisma.user.upsert({
    where: { email: 'mike.johnson@hrmsystem.com' },
    update: {},
    create: {
      email: 'mike.johnson@hrmsystem.com',
      password: mikePassword,
      role: 'employee',
      full_name: 'Mike Johnson',
    },
  })
  console.log('Created user account: mike.johnson@hrmsystem.com')

  await prisma.employee.upsert({
    where: { email: 'mike.johnson@hrmsystem.com' },
    update: { user_id: mikeUser.id },
    create: {
      user_id: mikeUser.id,
      first_name: 'Mike',
      last_name: 'Johnson',
      email: 'mike.johnson@hrmsystem.com',
      department: 'Sales',
      position: 'Sales Manager',
      hire_date: new Date('2024-03-01'),
      phone: '+1234567893',
      status: 'active',
    },
  })
  console.log('Created employee: Mike Johnson')

  console.log('Database seeded successfully!')
  console.log('\n=== Login Credentials ===')
  console.log('Admin: admin@hrmsystem.com / admin123')
  console.log('John Doe: john.doe@hrmsystem.com / john123')
  console.log('Jane Smith: jane.smith@hrmsystem.com / jane123')
  console.log('Mike Johnson: mike.johnson@hrmsystem.com / mike123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


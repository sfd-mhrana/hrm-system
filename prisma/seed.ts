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

  // Create sample employees
  const sampleEmployees = [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@hrmsystem.com',
      department: 'Engineering',
      position: 'Software Engineer',
      hire_date: new Date('2024-02-15'),
      phone: '+1234567891',
      status: 'active' as const,
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@hrmsystem.com',
      department: 'HR',
      position: 'HR Manager',
      hire_date: new Date('2024-01-10'),
      phone: '+1234567892',
      status: 'active' as const,
    },
    {
      first_name: 'Mike',
      last_name: 'Johnson',
      email: 'mike.johnson@hrmsystem.com',
      department: 'Sales',
      position: 'Sales Manager',
      hire_date: new Date('2024-03-01'),
      phone: '+1234567893',
      status: 'active' as const,
    },
  ]

  for (const emp of sampleEmployees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    })
    console.log(`Created employee: ${emp.first_name} ${emp.last_name}`)
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


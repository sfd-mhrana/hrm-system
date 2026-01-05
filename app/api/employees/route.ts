import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // If admin, return all employees; if employee, return only their own
    if (userRole === 'admin') {
      const employees = await prisma.employee.findMany({
        orderBy: { created_at: 'desc' },
      })
      return NextResponse.json({ employees }, { status: 200 })
    } else {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      return NextResponse.json({ employees: employee ? [employee] : [] }, { status: 200 })
    }
  } catch (error) {
    console.error('Get employees error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { first_name, last_name, email, department, position, hire_date, phone, status } = data

    // Check if employee with email already exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    })

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 400 }
      )
    }

    const employee = await prisma.employee.create({
      data: {
        first_name,
        last_name,
        email,
        department: department || null,
        position: position || null,
        hire_date: hire_date ? new Date(hire_date) : null,
        phone: phone || null,
        status: status || 'active',
      },
    })

    return NextResponse.json({ employee }, { status: 201 })
  } catch (error) {
    console.error('Create employee error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


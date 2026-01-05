import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const employeeId = request.nextUrl.searchParams.get('employeeId')
    const status = request.nextUrl.searchParams.get('status')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let where: any = {}

    // If employee, only show their own leaves
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee) {
        return NextResponse.json({ leaves: [] }, { status: 200 })
      }
      where.employee_id = employee.id
    } else if (employeeId) {
      // Admin filtering by employee
      where.employee_id = employeeId
    }

    // Filter by status if provided
    if (status) {
      where.status = status
    }

    const leaves = await prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ leaves }, { status: 200 })
  } catch (error) {
    console.error('Get leaves error:', error)
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

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { employee_id, leave_type, start_date, end_date, reason } = data

    // If employee, only allow creating their own leave requests
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee || employee.id !== employee_id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        employee_id,
        leave_type,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        reason,
        status: 'pending',
      },
    })

    return NextResponse.json({ leave }, { status: 201 })
  } catch (error) {
    console.error('Create leave error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


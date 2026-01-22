import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const employeeId = request.nextUrl.searchParams.get('employeeId')
    const date = request.nextUrl.searchParams.get('date')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let where: any = {}

    // If employee, only show their own attendance
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee) {
        return NextResponse.json({ attendance: [] }, { status: 200 })
      }
      where.employee_id = employee.id
    } else if (employeeId) {
      // Admin filtering by employee
      where.employee_id = employeeId
    }

    // Filter by date if provided
    if (date) {
      where.date = new Date(date)
    }

    const attendance = await prisma.attendance.findMany({
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
      orderBy: { date: 'desc' },
    })

    return NextResponse.json({ attendance }, { status: 200 })
  } catch (error) {
    console.error('Get attendance error:', error)
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
    const { employee_id, date, status, check_in, check_out, notes } = data

    // Validate required fields
    if (!employee_id) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    if (!date) {
      return NextResponse.json(
        { error: 'Date is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Validate date
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Validate check_in and check_out if provided (ignore null, undefined, and empty strings)
    let checkInObj = null
    let checkOutObj = null

    if (check_in && typeof check_in === 'string' && check_in.trim() !== '') {
      checkInObj = new Date(check_in)
      if (isNaN(checkInObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid check_in time format' },
          { status: 400 }
        )
      }
    }

    if (check_out && typeof check_out === 'string' && check_out.trim() !== '') {
      checkOutObj = new Date(check_out)
      if (isNaN(checkOutObj.getTime())) {
        return NextResponse.json(
          { error: 'Invalid check_out time format' },
          { status: 400 }
        )
      }
    }

    // If employee, only allow creating their own attendance
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

    const attendance = await prisma.attendance.create({
      data: {
        employee_id,
        date: dateObj,
        status,
        check_in: checkInObj,
        check_out: checkOutObj,
        notes: notes || null,
      },
    })

    return NextResponse.json({ attendance }, { status: 201 })
  } catch (error) {
    console.error('Create attendance error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


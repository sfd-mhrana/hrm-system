import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const attendance = await prisma.attendance.findUnique({
      where: { id },
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
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ attendance }, { status: 200 })
  } catch (error) {
    console.error('Get attendance error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existingAttendance = await prisma.attendance.findUnique({
      where: { id },
    })

    if (!existingAttendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    // If employee, only allow updating their own attendance
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee || employee.id !== existingAttendance.employee_id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    const data = await request.json()
    const { date, status, check_in, check_out, notes } = data

    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(status && { status }),
        ...(check_in !== undefined && { check_in: check_in ? new Date(check_in) : null }),
        ...(check_out !== undefined && { check_out: check_out ? new Date(check_out) : null }),
        ...(notes !== undefined && { notes: notes || null }),
      },
    })

    return NextResponse.json({ attendance }, { status: 200 })
  } catch (error) {
    console.error('Update attendance error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const attendance = await prisma.attendance.findUnique({
      where: { id },
    })

    if (!attendance) {
      return NextResponse.json(
        { error: 'Attendance record not found' },
        { status: 404 }
      )
    }

    await prisma.attendance.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Attendance record deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete attendance error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


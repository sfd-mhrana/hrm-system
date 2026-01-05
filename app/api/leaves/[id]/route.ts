import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leave = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
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

    if (!leave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ leave }, { status: 200 })
  } catch (error) {
    console.error('Get leave error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
    })

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    const data = await request.json()
    const { leave_type, start_date, end_date, reason, status } = data

    // If employee, only allow updating their own pending leave requests
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee || employee.id !== existingLeave.employee_id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
      // Employees can only update pending leaves
      if (existingLeave.status !== 'pending') {
        return NextResponse.json(
          { error: 'Cannot update non-pending leave request' },
          { status: 400 }
        )
      }
      // Employees cannot change status
      if (status && status !== existingLeave.status) {
        return NextResponse.json(
          { error: 'Cannot change leave status' },
          { status: 403 }
        )
      }
    }

    const leave = await prisma.leaveRequest.update({
      where: { id: params.id },
      data: {
        ...(leave_type && { leave_type }),
        ...(start_date && { start_date: new Date(start_date) }),
        ...(end_date && { end_date: new Date(end_date) }),
        ...(reason !== undefined && { reason }),
        ...(status && { status }),
      },
    })

    return NextResponse.json({ leave }, { status: 200 })
  } catch (error) {
    console.error('Update leave error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existingLeave = await prisma.leaveRequest.findUnique({
      where: { id: params.id },
    })

    if (!existingLeave) {
      return NextResponse.json(
        { error: 'Leave request not found' },
        { status: 404 }
      )
    }

    // If employee, only allow deleting their own pending leave requests
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee || employee.id !== existingLeave.employee_id) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
      if (existingLeave.status !== 'pending') {
        return NextResponse.json(
          { error: 'Cannot delete non-pending leave request' },
          { status: 400 }
        )
      }
    }

    await prisma.leaveRequest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Leave request deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete leave error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


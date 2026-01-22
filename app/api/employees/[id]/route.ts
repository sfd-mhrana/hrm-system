import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const employee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ employee }, { status: 200 })
  } catch (error) {
    console.error('Get employee error:', error)
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

    const data = await request.json()
    const { first_name, last_name, email, department, position, hire_date, phone, status } = data

    // Check if employee exists
    const existingEmployee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!existingEmployee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // If not admin, only allow updating own employee record
    if (userRole !== 'admin' && existingEmployee.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // If email is being changed, check for duplicates
    if (email && email !== existingEmployee.email) {
      const emailExists = await prisma.employee.findUnique({
        where: { email },
      })
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        ...(first_name && { first_name }),
        ...(last_name && { last_name }),
        ...(email && { email }),
        ...(department !== undefined && { department: department || null }),
        ...(position !== undefined && { position: position || null }),
        ...(hire_date !== undefined && { hire_date: hire_date ? new Date(hire_date) : null }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(status && { status }),
      },
    })

    return NextResponse.json({ employee }, { status: 200 })
  } catch (error) {
    console.error('Update employee error:', error)
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

    const employee = await prisma.employee.findUnique({
      where: { id },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    await prisma.employee.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Delete employee error:', error)
    console.error('Error details:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}


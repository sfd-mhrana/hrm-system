import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')
    const employeeId = request.nextUrl.searchParams.get('employeeId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let where: any = {}

    // If employee, only show their own reviews
    if (userRole === 'employee') {
      const employee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })
      if (!employee) {
        return NextResponse.json({ reviews: [] }, { status: 200 })
      }
      where.employee_id = employee.id
    } else if (employeeId) {
      // Admin filtering by employee
      where.employee_id = employeeId
    }

    const reviews = await prisma.performanceReview.findMany({
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
        reviewer: {
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

    return NextResponse.json({ reviews }, { status: 200 })
  } catch (error) {
    console.error('Get reviews error:', error)
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
    const { employee_id, reviewer_id, rating, comments, review_date } = data

    // Get reviewer employee record (required for reviews)
    const reviewerEmployee = await prisma.employee.findUnique({
      where: { user_id: userId },
    })

    if (!reviewerEmployee) {
      return NextResponse.json(
        { error: 'Reviewer employee record not found. Please ensure you have an employee profile.' },
        { status: 404 }
      )
    }

    const review = await prisma.performanceReview.create({
      data: {
        employee_id,
        reviewer_id: reviewer_id || reviewerEmployee.id,
        rating,
        comments,
        review_date: new Date(review_date),
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


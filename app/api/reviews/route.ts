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

    // Validate employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employee_id },
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Determine the reviewer ID to use
    let finalReviewerId = reviewer_id

    // If no reviewer_id provided, use the current admin's employee record
    if (!finalReviewerId) {
      const reviewerEmployee = await prisma.employee.findUnique({
        where: { user_id: userId },
      })

      if (!reviewerEmployee) {
        return NextResponse.json(
          { error: 'Reviewer employee record not found. Please ensure you have an employee profile.' },
          { status: 404 }
        )
      }

      finalReviewerId = reviewerEmployee.id
    }

    // Validate reviewer exists
    const reviewer = await prisma.employee.findUnique({
      where: { id: finalReviewerId },
    })

    if (!reviewer) {
      return NextResponse.json(
        { error: 'Reviewer not found' },
        { status: 404 }
      )
    }

    const review = await prisma.performanceReview.create({
      data: {
        employee_id,
        reviewer_id: finalReviewerId,
        rating,
        comments,
        review_date: new Date(review_date),
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)

    // Provide more specific error messages for common issues
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        return NextResponse.json(
          { error: 'Invalid employee or reviewer ID provided' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


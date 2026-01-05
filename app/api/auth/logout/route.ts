import { NextResponse } from 'next/server'

export async function POST() {
  // Since we're using stateless authentication, logout is handled client-side
  // This endpoint exists for consistency
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
}


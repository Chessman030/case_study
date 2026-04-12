import { NextRequest, NextResponse } from 'next/server'
import { readUsers, verifyPassword } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const users = readUsers()
    const user = users.find((entry) => entry.email === email)

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.hasAttempted) {
      return NextResponse.json({ error: 'You have already attempted the exam. Only one attempt is allowed.' }, { status: 403 })
    }

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      token,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
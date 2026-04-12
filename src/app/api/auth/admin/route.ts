import { NextRequest, NextResponse } from 'next/server'

const ADMIN_CREDENTIALS = {
  email: 'rssstar07@gmail.com',
  password: 'ravi071011',
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
      return NextResponse.json({ token, isAdmin: true })
    }

    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
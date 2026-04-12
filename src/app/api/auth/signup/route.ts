import { NextRequest, NextResponse } from 'next/server'
import { readUsers, writeUsers, hashPassword, generateId } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const users = readUsers()

    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const newUser = {
      id: generateId(),
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
      hasAttempted: false,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    writeUsers(users)

    const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        userId: newUser.id,
        userName: newUser.name,
        userEmail: newUser.email,
      },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
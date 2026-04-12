import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb' // Bringing in your MongoDB connection
import { hashPassword, generateId } from '@/lib/database' // Keeping your helper functions

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // 1. Connect to MongoDB instead of reading a local file
    const client = await getMongoClient()
    const db = client.db()
    const usersCollection = db.collection('users') // Make sure this matches your DB setup

    // 2. Check for existing user in MongoDB
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    // 3. Prepare the new user
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

    // 4. Save to MongoDB instead of writing to a local file
    await usersCollection.insertOne(newUser)

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
  } catch (error) {
    console.error("Signup error:", error) // This will help log the error in Vercel if it fails again
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
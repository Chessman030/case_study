import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb' // Bring in MongoDB
import { verifyPassword } from '@/lib/database' // Keep your password verifier

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // 1. Connect to MongoDB instead of readUsers()
    const client = await getMongoClient()
    const db = client.db()
    const usersCollection = db.collection('users') // Make sure this matches your signup route

    // 2. Find the user in the database
    const user = await usersCollection.findOne({ email })

    // 3. Verify user exists and password is correct
    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // 4. Enforce the one-attempt rule
    if (user.hasAttempted) {
      return NextResponse.json({ 
        error: 'You have already attempted the exam. Only one attempt is allowed.' 
      }, { status: 403 })
    }

    // 5. Generate token (Safely checking for the custom 'id' we made in signup, or Mongo's '_id')
    const userId = user.id || user._id.toString()
    const token = Buffer.from(`${userId}:${Date.now()}`).toString('base64')

    return NextResponse.json({
      token,
      userId: userId,
      userName: user.name,
      userEmail: user.email,
    })
  } catch (error) {
    console.error("Login error:", error) // Helpful for Vercel logs
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
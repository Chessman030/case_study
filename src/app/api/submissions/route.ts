import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import { calculateScore, readUsers, writeUsers } from '@/lib/database'

interface SubmissionDocument {
  id: string
  userId: string
  userName: string
  userEmail: string
  answers: { [questionId: number]: string }
  score: number
  totalTime: number
  cheatScore: number
  tabSwitches: number
  submittedAt: string
  startedAt: string
}

export async function POST(request: NextRequest) {
  try {
    const { userId, answers, totalTime, tabSwitches, submittedAt, startedAt } = await request.json()

    if (!userId || !answers || typeof totalTime !== 'number' || typeof tabSwitches !== 'number') {
      return NextResponse.json({ error: 'Invalid submission payload' }, { status: 400 })
    }

    const users = readUsers()
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (users[userIndex].hasAttempted) {
      return NextResponse.json({ error: 'User has already attempted the exam' }, { status: 403 })
    }

    const score = calculateScore(answers)
    const cheatScore = tabSwitches > 0 ? tabSwitches : 0

    const submission: SubmissionDocument = {
      id: `${userId}-${Date.now()}`,
      userId,
      userName: users[userIndex].name,
      userEmail: users[userIndex].email,
      answers,
      score,
      totalTime,
      cheatScore,
      tabSwitches,
      submittedAt,
      startedAt,
    }

    const client = await getMongoClient()
    const db = client.db()
    await db.collection<SubmissionDocument>('submissions').insertOne(submission)

    users[userIndex].hasAttempted = true
    writeUsers(users)

    return NextResponse.json({
      success: true,
      score,
      totalTime,
      cheatScore,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const client = await getMongoClient()
    const db = client.db()
    const submissions = await db.collection<SubmissionDocument>('submissions').find().sort({ score: -1, totalTime: 1, submittedAt: 1 }).toArray()

    return NextResponse.json(
      submissions.map(({ _id, ...submission }) => submission),
    )
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
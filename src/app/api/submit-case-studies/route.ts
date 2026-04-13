import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import * as fallbackStorage from '@/lib/fallback-storage'
import { markUserAsAttempted } from '@/lib/database'

// Case Study 1 Answer Key with alternatives
const CASE_STUDY_1_ANSWER_KEY: Record<number, { primary: string; alternatives?: string[] }> = {
  1: { primary: 'quantumlogix-update.com' },
  2: { primary: 'tailgating', alternatives: ['piggybacking', 'piggybanking'] },
  3: { primary: 'robots.txt' },
  4: { primary: "admin' OR 1=1 --" },
  5: { primary: 'image/jpeg' },
  6: { primary: 'disabled={true}', alternatives: ['disabled'] },
  7: { primary: 'display: none' },
  8: { primary: 'git logs', alternatives: ['git history', 'commit history'] },
  9: { primary: 'salt', alternatives: ['salting'] },
  10: { primary: 'admin/admin' },
}

// Case Study 2 Answer Key with alternatives
const CASE_STUDY_2_ANSWER_KEY: Record<number, { primary: string; alternatives?: string[] }> = {
  1: { primary: 'color-formatter-pro' },
  2: { primary: 'SuperSecretKey123' },
  3: { primary: 'backup_svc' },
  4: { primary: 'fintech-flow-database-backups' },
  5: { primary: 'SCP' },
  6: { primary: '198.51.100.45' },
  7: { primary: 'AES-256', alternatives: ['AES256'] },
  8: { primary: 'XMR', alternatives: ['Monero'] },
  9: { primary: 'rm -rf /var/log/syslog' },
  10: { primary: 'Dev_Dave', alternatives: ['Dave'] },
}

interface SubmissionPayload {
  caseStudy1Answers?: Record<string, string>
  caseStudy2Answers?: Record<string, string>
  userId?: string
  userName?: string
  userEmail?: string
  totalTime?: number
  tabSwitches?: number
  submittedAt?: string
  startedAt?: string
}

interface CaseStudySubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  caseStudy1Answers: Record<string, string>
  caseStudy2Answers: Record<string, string>
  case1Score: number
  case2Score: number
  finalScore: number
  totalTime: number
  tabSwitches: number
  submittedAt: string
  startedAt: string
  createdAt: Date
}

function sanitize(value: string): string {
  return value.toLowerCase().trim()
}

function checkAnswer(
  userAnswer: string,
  answerEntry: { primary: string; alternatives?: string[] },
): boolean {
  const sanitized = sanitize(userAnswer)

  // Check primary answer
  if (sanitized === sanitize(answerEntry.primary)) {
    return true
  }

  // Check alternative answers
  if (answerEntry.alternatives) {
    return answerEntry.alternatives.some((alt) => sanitized === sanitize(alt))
  }

  return false
}

function scoreCaseStudy(
  answerKey: Record<number, { primary: string; alternatives?: string[] }>,
  submitted: Record<string, string>,
): number {
  let score = 0

  for (let index = 1; index <= 10; index += 1) {
    const userAnswer = submitted[String(index)] ?? ''
    const answerEntry = answerKey[index]

    if (answerEntry && checkAnswer(userAnswer, answerEntry)) {
      score += 1
    }
  }

  return score
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmissionPayload
    const { userId, userName, userEmail, totalTime, tabSwitches, submittedAt, startedAt } = body
    const caseStudy1Answers = body.caseStudy1Answers ?? {}
    const caseStudy2Answers = body.caseStudy2Answers ?? {}

    if (!userId) {
      console.warn('No userId provided in submission')
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Check if user has already submitted
    let existingSubmission: boolean
    try {
      const client = await getMongoClient()
      const db = client.db()
      const submissionsCollection = db.collection<CaseStudySubmission>('case_study_submissions')
      const existing = await submissionsCollection.findOne({ userId })
      existingSubmission = !!existing
    } catch (mongoErr) {
      console.warn('MongoDB unavailable, using fallback storage:', mongoErr)
      existingSubmission = fallbackStorage.hasUserSubmitted(userId)
    }

    if (existingSubmission) {
      console.info(`User ${userId} attempted duplicate submission`)
      return NextResponse.json(
        { success: false, message: 'You have already attempted this test. Only one attempt is allowed.' },
        { status: 403 },
      )
    }

    // Calculate scores
    const case1Score = scoreCaseStudy(CASE_STUDY_1_ANSWER_KEY, caseStudy1Answers)
    const case2Score = scoreCaseStudy(CASE_STUDY_2_ANSWER_KEY, caseStudy2Answers)
    const finalScore = case1Score + case2Score

    // Save submission to MongoDB or fallback storage
    const submission: CaseStudySubmission = {
      id: `${userId}-${Date.now()}`,
      userId,
      userName: userName || 'Anonymous',
      userEmail: userEmail || '',
      caseStudy1Answers,
      caseStudy2Answers,
      case1Score,
      case2Score,
      finalScore,
      totalTime: totalTime || 0,
      tabSwitches: tabSwitches || 0,
      submittedAt: submittedAt || new Date().toISOString(),
      startedAt: startedAt || new Date().toISOString(),
      createdAt: new Date(),
    }

    try {
      const client = await getMongoClient()
      const db = client.db()
      const submissionsCollection = db.collection<CaseStudySubmission>('case_study_submissions')
      await submissionsCollection.insertOne(submission)
      console.info(`Submission saved to MongoDB for user ${userId}: Score=${finalScore}`)

      // Update user profile to prevent duplicate attempts
      const usersCollection = db.collection('users')
      await usersCollection.updateOne(
        { id: userId },
        { $set: { hasAttempted: true } },
      )
      console.info(`User ${userId} marked as attempted in MongoDB`)
    } catch (mongoErr) {
      console.warn('MongoDB write failed, using fallback storage:', mongoErr)
      fallbackStorage.saveSubmission(submission)
      console.info(`Submission saved to JSON fallback for user ${userId}: Score=${finalScore}`)
      
      // Mark user as attempted in fallback storage
      markUserAsAttempted(userId)
    }

    return NextResponse.json({
      success: true,
      message: 'Responses securely recorded for grading.',
      case1Score,
      case2Score,
      finalScore,
      submissionId: submission.id,
    })
  } catch (error) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { success: false, message: 'Unable to process responses.' },
      { status: 500 },
    )
  }
}
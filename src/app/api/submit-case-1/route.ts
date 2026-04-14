import { NextRequest, NextResponse } from 'next/server'

// Answer key with primary answers and acceptable alternatives
const ANSWER_KEY: Record<number, { primary: string; alternatives?: string[] }> = {
  1: { primary: 'quantumlogix-update.com' },
  2: { primary: 'tailgating', alternatives: ['piggybacking', 'piggybanking'] },
  3: { primary: 'robots.txt' },
  4: { primary: "admin' OR 1=1 --" },
  5: { primary: 'image/jpeg' },
  6: { primary: 'disabled={true}', alternatives: ['disabled'] },
  7: { primary: 'display: none' , alternatives: ['display:none', 'display: none;' , "display: 'none'"] },
  8: { primary: 'git logs', alternatives: ['git history', 'commit history'] },
  9: { primary: 'salt', alternatives: ['salting'] },
  10: { primary: 'admin/admin' },
}

type RoundSubmissionPayload = {
  answers?: Record<string, string>
}

function sanitize(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+v\d+\.\d+.*$/g, '')  // Remove version patterns like ' v2.1'
    .replace(/[^a-z0-9\s-]/g, '')      // Keep only letters, numbers, spaces, and hyphens
    .replace(/\s+/g, ' ')              // Normalize multiple spaces to single space
    .trim()
}

function checkAnswer(userAnswer: string, questionId: number): boolean {
  const sanitized = sanitize(userAnswer)
  const answerEntry = ANSWER_KEY[questionId]

  if (!answerEntry) return false

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RoundSubmissionPayload
    const submittedAnswers = body.answers ?? {}

    let score = 0

    for (let index = 1; index <= 10; index += 1) {
      const userAnswer = submittedAnswers[String(index)] ?? ''
      if (checkAnswer(userAnswer, index)) {
        score += 1
      }
    }

    // Return success with score (backend-only validation, no answers exposed)
    return NextResponse.json({
      success: true,
      message: 'Round 1 Recorded.',
      score,
      totalQuestions: 10,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to process Round 1 submission.' },
      { status: 400 },
    )
  }
}
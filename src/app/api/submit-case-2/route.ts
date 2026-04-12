import { NextRequest, NextResponse } from 'next/server'

// Answer key for Case Study 2 - Backend only, not exposed to frontend
const ANSWER_KEY: Record<number, { primary: string; alternatives?: string[] }> = {
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

type RoundSubmissionPayload = {
  answers?: Record<string, string>
}

function sanitize(value: string): string {
  return value.toLowerCase().trim()
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
      message: 'Round 2 Recorded.',
      score,
      totalQuestions: 10,
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'Unable to process Round 2 submission.' },
      { status: 400 },
    )
  }
}
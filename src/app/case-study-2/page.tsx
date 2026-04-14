'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const ROUND_2_DRAFT_KEY = 'draft_round_2'
const EVENT_END_TIME_KEY = 'ctf_end_time'
const EVENT_DURATION_MS = 120 * 60 * 1000

const questionLabels = [
  'What is the exact name of the malicious third-party package Dev_Dave installed?',
  'What is the exact leaked JWT secret found in the auth config?',
  'What specific AWS service account was compromised?',
  'What is the exact name of the AWS S3 bucket the attacker deleted?',
  'What specific network protocol did the attacker use to exfiltrate the data?',
  'What is the exact external IP address the attacker sent the data to?',
  'What algorithm did the ransomware use to lock the files?',
  'What specific cryptocurrency ticker symbol did they request payment in?',
  'Enter the exact Linux command the attacker used to wipe the syslog.',
  'Which specific employee pushed the compromised code to production?',
]

const caseStudy2Evidence = `Case Study 2: The Midnight Ransom

Briefing for Participants: "At 11:45 PM on a Friday, the cloud infrastructure of 'FinTech Flow' went completely offline. When the engineering team woke up, their databases were encrypted, and their backup servers were wiped. We have collected 5 artifacts: Slack logs, Server configurations, AWS CloudTrail logs, Network traffic, and a Ransom Note. Read the evidence, trace the attacker's lateral movement, and submit the 10 exact answers below to close the case."

Part 1: The Evidence

Artifact A: Slack Chat Logs (Friday, 4:30 PM)

[4:30 PM] @Dev_Dave: Hey team, the CI/CD pipeline is failing on the new logging module.
[4:32 PM] @Senior_Sarah: Did you update the text formatting package?
[4:35 PM] @Dev_Dave: Yeah, I just swapped to color-formatter-pro. It fixed the build! Pushing to production now.
[4:36 PM] @Senior_Sarah: Wait, didn't the security team flag that author last week?
[4:37 PM] @Dev_Dave: Hmm, let me check... Actually, I don't see any recent comms about it. Code's already running on prod.
[4:38 PM] @Senior_Sarah: This is concerning. Can you roll it back?
[4:40 PM] @Dev_Dave: It's fine, we're running it in a container. Worst case we restart.

Artifact B: Application Config (auth.config.ts)

export const authConfig = {
  tokenExpiration: '24h',
  algorithm: 'HS256',
  // WARNING: Move this to .env before Monday's audit!
  jwt_secret: 'SuperSecretKey123',
  issuer: 'fintech-flow-auth'
};

Artifact C: AWS CloudTrail Logs (Friday, 11:15 PM)

{"time": "23:15:02", "eventName": "AssumeRole", "userIdentity": {"userName": "backup_svc"}, "requestParameters": {"roleArn": "arn:aws:iam::123456789:role/AdminAccess"}}
{"time": "23:15:05", "eventName": "ListBuckets", "userIdentity": {"userName": "backup_svc"}}
{"time": "23:18:40", "eventName": "DeleteBucket", "requestParameters": {"bucketName": "fintech-flow-database-backups"}}

Artifact D: Network Firewall Logs (Friday, 11:30 PM)

[23:30:10] ALLOWED - PROTOCOL: SCP - SRC: 10.0.0.5 - DST: 198.51.100.45 - BYTES: 4.2GB
[23:45:00] ALLOWED - PROTOCOL: SSH - SRC: 10.0.0.5 - CMD_EXECUTED: "rm -rf /var/log/syslog"

Artifact E: The Ransom Note (Found on all servers at 11:50 PM)

YOUR FILES HAVE BEEN ENCRYPTED.
Algorithm: AES-256
Do not attempt to decrypt them yourself, or the data will be corrupted.
To purchase the decryption key, send exactly 50 XMR to the wallet address below.
Wallet: 44AFFq5kSiGBoZ...
You have 48 hours.`

type AnswersState = Record<string, string>

function buildInitialAnswers(): AnswersState {
  const state: AnswersState = {}
  for (let index = 1; index <= 10; index += 1) {
    state[String(index)] = ''
  }
  return state
}

function getOrCreateSharedEndTime(): number {
  const now = Date.now()
  const storedValue = localStorage.getItem(EVENT_END_TIME_KEY)

  if (storedValue) {
    const parsed = Number(storedValue)
    if (Number.isFinite(parsed) && parsed > now) {
      return parsed
    }
  }

  const endTime = now + EVENT_DURATION_MS
  localStorage.setItem(EVENT_END_TIME_KEY, String(endTime))
  return endTime
}

function formatRemainingTime(milliseconds: number): string {
  const clamped = Math.max(0, milliseconds)
  const totalSeconds = Math.floor(clamped / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default function CaseStudyTwoPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<AnswersState>(buildInitialAnswers)
  const [timeLeftMs, setTimeLeftMs] = useState(EVENT_DURATION_MS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const answersRef = useRef<AnswersState>(answers)
  const isSubmittingRef = useRef(false)
  const isSubmittedRef = useRef(false)

  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    isSubmittingRef.current = isSubmitting
  }, [isSubmitting])

  useEffect(() => {
    isSubmittedRef.current = isSubmitted
  }, [isSubmitted])

  useEffect(() => {
    const storedDraft = localStorage.getItem(ROUND_2_DRAFT_KEY)
    if (!storedDraft) return

    try {
      const parsed = JSON.parse(storedDraft) as Partial<AnswersState>
      setAnswers((current) => {
        const merged = { ...current }
        for (let index = 1; index <= 10; index += 1) {
          const key = String(index)
          if (typeof parsed[key] === 'string') {
            merged[key] = parsed[key] as string
          }
        }
        return merged
      })
    } catch {
      localStorage.removeItem(ROUND_2_DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (isSubmitted) return
    localStorage.setItem(ROUND_2_DRAFT_KEY, JSON.stringify(answers))
  }, [answers, isSubmitted])

  const submitRoundTwo = async (isAutoSubmit: boolean) => {
    if (isSubmittingRef.current || isSubmittedRef.current) return

    setIsSubmitting(true)
    setErrorMessage('')
    if (!isAutoSubmit) {
      setShowConfirmModal(false)
    }

    try {
      const response = await fetch('/api/submit-case-2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersRef.current }),
      })

      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error('Submission failed')
      }

      localStorage.removeItem(ROUND_2_DRAFT_KEY)
      setIsSubmitted(true)
      router.push('/results')
    } catch {
      setErrorMessage('Could not submit Round 2. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (isSubmitted) return

    const endTime = getOrCreateSharedEndTime()
    setTimeLeftMs(Math.max(0, endTime - Date.now()))

    const timer = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now())
      setTimeLeftMs(remaining)

      if (remaining <= 0) {
        clearInterval(timer)
        // Force submission when timer ends. No confirmation modal allowed here.
        void submitRoundTwo(true)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [isSubmitted])

  const handleInputChange = (questionNumber: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionNumber]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting || isSubmitted) return
    setShowConfirmModal(true)
  }

  const timerToneClass =
    timeLeftMs <= 5 * 60 * 1000
      ? 'text-red-400'
      : timeLeftMs <= 30 * 60 * 1000
      ? 'text-yellow-300'
      : 'text-green-300'

  if (isSubmitted) {
    return (
      <div className="min-h-screen p-6 sm:p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-green-400/40 bg-slate-900/70 p-10 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-green-300">Submission Recorded.</h1>
          <p className="mt-4 text-lg text-slate-100">Redirecting to results...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/20 bg-slate-900/70 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-widest text-slate-300">Incident Response Challenge</p>
          <h1 className="mt-2 text-2xl font-bold text-white">The Midnight Ransom</h1>
          <p className={`mt-3 text-xl font-semibold ${timerToneClass}`}>
            Shared Event Timer: {formatRemainingTime(timeLeftMs)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/20 bg-slate-900/70 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Case Study 2 Evidence</h2>
            <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
              <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{caseStudy2Evidence}</pre>
            </div>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-slate-100">
              {questionLabels.map((question, index) => (
                <li key={String(index + 1)}>{question}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-white/20 bg-slate-900/70 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Round 2 Submission</h2>
            <p className="mt-2 text-sm text-slate-300">Draft auto-save is enabled in this browser.</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {questionLabels.map((label, index) => {
                const questionNumber = String(index + 1)
                return (
                  <div key={questionNumber}>
                    <label
                      htmlFor={`answer-${questionNumber}`}
                      className="mb-1 block text-sm font-medium text-slate-100"
                    >
                      Q{questionNumber}
                    </label>
                    <input
                      id={`answer-${questionNumber}`}
                      type="text"
                      value={answers[questionNumber]}
                      onChange={(event) => handleInputChange(questionNumber, event.target.value)}
                      className="w-full rounded-lg border border-white/20 bg-slate-950/50 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-300"
                      placeholder={label}
                      autoComplete="off"
                    />
                  </div>
                )
              })}

              {errorMessage && (
                <div className="rounded-lg border border-red-400/60 bg-red-500/10 p-3 text-sm text-red-200">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="mt-2 w-full rounded-xl bg-cyan-500 px-4 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Recording...' : 'Submit Investigation'}
              </button>
            </form>
          </section>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-white">Confirm Submission</h3>
            <p className="mt-2 text-sm text-slate-200">
              Are you sure you want to submit your investigation?
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => void submitRoundTwo(false)}
                disabled={isSubmitting}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
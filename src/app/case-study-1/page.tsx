'use client'

import Link from 'next/link'
import { FormEvent, useEffect, useRef, useState } from 'react'

const ROUND_1_DRAFT_KEY = 'draft_round_1'
const EVENT_END_TIME_KEY = 'ctf_end_time'
const EVENT_DURATION_MS = 120 * 60 * 1000

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

const round1Questions = [
  'What is the exact root domain the attacker used in the phishing email?',
  "What is the specific industry term for exploiting someone's politeness to get through a locked door?",
  'What file did the attacker check to find hidden directories?',
  'Enter the exact payload the attacker typed to bypass the SQL login.',
  'What specific HTTP header (MIME type) did the attacker spoof to upload the shell?',
  'What exact HTML attribute did the attacker delete to unlock the "Wipe Database" button?',
  'What exact CSS property and value was used to hide the secret flag? (Format: property: value)',
  'Where exactly should the attacker look to find the deleted API key?',
  'What cryptographic measure did the database admin fail to use to protect identical passwords?',
  'What "Factory Default" username/password did the attacker try first? (Format: user/pass)',
]

export default function CaseStudyOnePage() {
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
    const storedDraft = localStorage.getItem(ROUND_1_DRAFT_KEY)
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
      localStorage.removeItem(ROUND_1_DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    if (isSubmitted) return
    localStorage.setItem(ROUND_1_DRAFT_KEY, JSON.stringify(answers))
  }, [answers, isSubmitted])

  const submitRoundOne = async (isAutoSubmit: boolean) => {
    if (isSubmittingRef.current || isSubmittedRef.current) return

    setIsSubmitting(true)
    setErrorMessage('')
    if (!isAutoSubmit) {
      setShowConfirmModal(false)
    }

    try {
      const response = await fetch('/api/submit-case-1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersRef.current }),
      })

      const result = await response.json()
      if (!response.ok || !result?.success) {
        throw new Error('Round 1 submission failed')
      }

      localStorage.removeItem(ROUND_1_DRAFT_KEY)
      setIsSubmitted(true)
    } catch {
      setErrorMessage('Could not submit Round 1. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (isSubmitted) return

    const endTime = getOrCreateSharedEndTime()
    setTimeLeftMs(Math.max(0, endTime - Date.now()))

    const intervalId = setInterval(() => {
      const remaining = Math.max(0, endTime - Date.now())
      setTimeLeftMs(remaining)

      if (remaining <= 0) {
        clearInterval(intervalId)
        // Force submission when timer ends. No confirmation modal allowed here.
        void submitRoundOne(true)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [isSubmitted])

  const handleInputChange = (questionNumber: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionNumber]: value,
    }))
  }

  const handleSubmitClick = (event: FormEvent<HTMLFormElement>) => {
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

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl border border-white/20 bg-slate-900/70 p-5 shadow-lg">
          <p className="text-xs uppercase tracking-widest text-slate-300">Operation Quantum Breach</p>
          <h1 className="mt-2 text-2xl font-bold text-white">Case Study Round 1</h1>
          {!isSubmitted && (
            <p className={`mt-3 text-xl font-semibold ${timerToneClass}`}>
              Shared Event Timer: {formatRemainingTime(timeLeftMs)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/20 bg-slate-900/70 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Case Study 1 Evidence</h2>
            <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-200">
              Placeholder: Timeline logs, phishing traces, access control telemetry, code snapshots, and backend incidents.
            </div>
            <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-slate-100">
              {round1Questions.map((question, index) => (
                <li key={String(index + 1)}>{question}</li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-white/20 bg-slate-900/70 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Round 1 Submission</h2>
            <p className="mt-2 text-sm text-slate-300">Draft auto-save is enabled in this browser.</p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmitClick} className="mt-5 space-y-4">
                {round1Questions.map((label, index) => {
                  const questionNumber = String(index + 1)
                  return (
                    <div key={questionNumber}>
                      <label
                        htmlFor={`round1-answer-${questionNumber}`}
                        className="mb-1 block text-sm font-medium text-slate-100"
                      >
                        Q{questionNumber}
                      </label>
                      <input
                        id={`round1-answer-${questionNumber}`}
                        type="text"
                        value={answers[questionNumber]}
                        onChange={(event) => handleInputChange(questionNumber, event.target.value)}
                        className="w-full rounded-lg border border-white/20 bg-slate-950/50 px-3 py-2 text-slate-100 outline-none transition focus:border-cyan-300"
                        placeholder={`Enter answer for Question ${questionNumber}`}
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
                  disabled={isSubmitting}
                  className="mt-2 w-full rounded-xl bg-cyan-500 px-4 py-3 text-lg font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Recording...' : 'Submit Investigation'}
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-xl border border-green-400/40 bg-green-500/10 p-5 text-center">
                <p className="text-lg font-semibold text-green-300">Submission Recorded.</p>
                <p className="mt-2 text-sm text-slate-100">Round 1 is complete. Proceed to Round 2.</p>
                <Link
                  href="/case-study-2"
                  className="mt-4 inline-block rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Proceed to Round 2
                </Link>
              </div>
            )}
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
                onClick={() => void submitRoundOne(false)}
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
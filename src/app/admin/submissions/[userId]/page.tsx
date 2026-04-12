'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface SubmissionDetail {
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
}

const case1Questions = [
  'What is the exact root domain the attacker used in the phishing email?',
  'What is the specific industry term for exploiting someone\'s politeness to get through a locked door?',
  'What file did the attacker check to find hidden directories?',
  'Enter the exact payload the attacker typed to bypass the SQL login.',
  'What specific HTTP header (MIME type) did the attacker spoof to upload the shell?',
  'What exact HTML attribute did the attacker delete to unlock the "Wipe Database" button?',
  'What exact CSS property and value was used to hide the secret flag? (Format: property: value)',
  'Where exactly should the attacker look to find the deleted API key?',
  'What cryptographic measure did the database admin fail to use to protect identical passwords?',
  'What "Factory Default" username/password did the attacker try first? (Format: user/pass)',
]

const case2Questions = [
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

export default function SubmissionDetailPage() {
  const params = useParams()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchData = async () => {
      try {
        if (!params?.userId) {
          setError('Invalid user ID')
          setLoading(false)
          return
        }

        const userId = Array.isArray(params.userId) ? params.userId[0] : String(params.userId)

        const response = await fetch(`/api/admin/submissions/${userId}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch submission')
        }

        const data = await response.json()
        if (data.submission) {
          setSubmission(data.submission)
        } else {
          setError('Submission not found')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load submission')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [mounted, params])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-slate-950">
        <div className="text-center text-slate-300">Loading submission...</div>
      </div>
    )
  }

  if (!submission || error) {
    return (
      <div className="min-h-screen p-8 bg-slate-950">
        <div className="mx-auto max-w-6xl">
          <Link href="/admin/submissions" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Submissions
          </Link>
          <div className="mt-8 rounded-lg border border-red-400/60 bg-red-500/10 p-4 text-red-200">
            {error || 'Submission not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/admin/submissions"
          className="text-cyan-400 hover:text-cyan-300"
        >
          ← Back to Submissions
        </Link>

        <div className="mt-8 rounded-lg border border-white/20 bg-slate-900/70 p-8">
          <div className="border-b border-white/10 pb-6">
            <h1 className="text-3xl font-bold text-white">{submission.userName}</h1>
            <p className="text-slate-400">{submission.userEmail}</p>

            <div className="mt-6 grid grid-cols-4 gap-4">
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-3xl font-bold text-cyan-300">{submission.finalScore}</p>
                <p className="text-xs text-slate-400">Total Score</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-3xl font-bold text-emerald-300">{submission.case1Score}/10</p>
                <p className="text-xs text-slate-400">Case Study 1</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-3xl font-bold text-emerald-300">{submission.case2Score}/10</p>
                <p className="text-xs text-slate-400">Case Study 2</p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-sm text-slate-100">{formatTime(submission.totalTime)}</p>
                <p className="text-xs text-slate-400">
                  {submission.tabSwitches} tab switches
                </p>
              </div>
            </div>
          </div>

          {/* Case Study 1 Answers */}
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Case Study 1: Operation Quantum Breach</h2>
            <div className="space-y-4">
              {case1Questions.map((question, index) => {
                const qNum = String(index + 1)
                const answer = submission.caseStudy1Answers[qNum] || '(No answer)'
                return (
                  <div key={qNum} className="rounded-lg bg-slate-950/50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-300">
                      Q{qNum}: {question}
                    </p>
                    <p className="text-slate-100">
                      <span className="text-slate-500">Answer: </span>
                      {answer}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Case Study 2 Answers */}
          <div className="mt-8">
            <h2 className="mb-6 text-2xl font-bold text-white">Case Study 2: The Midnight Ransom</h2>
            <div className="space-y-4">
              {case2Questions.map((question, index) => {
                const qNum = String(index + 1)
                const answer = submission.caseStudy2Answers[qNum] || '(No answer)'
                return (
                  <div key={qNum} className="rounded-lg bg-slate-950/50 p-4">
                    <p className="mb-2 text-sm font-semibold text-slate-300">
                      Q{qNum}: {question}
                    </p>
                    <p className="text-slate-100">
                      <span className="text-slate-500">Answer: </span>
                      {answer}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4 text-xs text-slate-500">
            <p>Submitted: {new Date(submission.submittedAt).toLocaleString()}</p>
            <p>Started: {new Date(submission.startedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  case1Score: number
  case2Score: number
  finalScore: number
  totalTime: number
  tabSwitches: number
  submittedAt: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/submissions')
        if (!response.ok) throw new Error('Failed to fetch submissions')
        
        const data = await response.json()
        setSubmissions(data.submissions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-slate-950">
        <div className="text-center text-slate-300">Loading submissions...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-white">All Submissions</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-400/60 bg-red-500/10 p-4 text-red-200">
            {error}
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-8 text-center text-slate-300">
            No submissions yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Link
                key={submission.id}
                href={`/admin/submissions/${submission.userId}`}
                className="block rounded-lg border border-white/20 bg-slate-900/70 p-6 transition hover:border-cyan-400/50 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{submission.userName}</h2>
                    <p className="text-sm text-slate-400">{submission.userEmail}</p>
                  </div>
                  <div className="flex gap-8 text-right">
                    <div>
                      <p className="text-2xl font-bold text-cyan-300">{submission.finalScore}/20</p>
                      <p className="text-xs text-slate-400">Final Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-100">
                        Q1: {submission.case1Score}/10 | Q2: {submission.case2Score}/10
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatTime(submission.totalTime)} | Tab Switches: {submission.tabSwitches}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Submitted: {new Date(submission.submittedAt).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { questions, totalMarks } from '@/data/questions'

interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  answers: { [questionId: number]: string }
  finalScore: number // FIX 1: Updated from 'score' to 'finalScore'
  totalTime: number
  cheatScore: number
  tabSwitches: number
  submittedAt: string
  startedAt: string
}

export default function AdminPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'scoreboard' | 'detailed'>('scoreboard')

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (!adminToken) {
      router.push('/')
      return
    }

    fetchSubmissions()
  }, [router])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions') // Note: Ensure this path matches your API folder exactly
      if (response.ok) {
        const data = await response.json()
        // FIX 2: Extract the array from the object Vercel returns
        setSubmissions(data.submissions || []) 
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getScoreBadgeColor = (score: number) => {
    if (score === totalMarks) return 'bg-emerald-100 text-emerald-800'
    if (score >= totalMarks / 2) return 'bg-amber-100 text-amber-800'
    if (score > 0) return 'bg-orange-100 text-orange-800'
    return 'bg-rose-100 text-rose-800'
  }

  const getCheatBadgeColor = (tabSwitches: number) => {
    if (tabSwitches === 0) return 'bg-emerald-100 text-emerald-800'
    if (tabSwitches <= 3) return 'bg-amber-100 text-amber-800'
    return 'bg-rose-100 text-rose-800'
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
          <p className="text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Admin Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-white">Case Study Round 2</h1>
              <p className="mt-1 text-slate-300">Results stored in MongoDB</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300">Total Submissions: {submissions.length}</span>
              <button onClick={handleLogout} className="rounded-2xl bg-rose-500 px-4 py-2 font-medium text-white transition hover:bg-rose-400">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/80 p-2 shadow-xl shadow-cyan-950/10 backdrop-blur-xl">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('scoreboard')}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${activeTab === 'scoreboard' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              Scoreboard
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition ${activeTab === 'detailed' ? 'bg-cyan-500 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
            >
              Detailed View
            </button>
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'scoreboard' && (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl">
              <div className="border-b border-white/10 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Competition Scoreboard</h2>
                <p className="mt-1 text-sm text-slate-300">Ranked by score, then by time.</p>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 text-center text-slate-400">No submissions yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-3">Rank</th>
                        <th className="px-6 py-3">Participant</th>
                        <th className="px-6 py-3">Score</th>
                        <th className="px-6 py-3">Time</th>
                        <th className="px-6 py-3">Tab Switches</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {submissions.map((submission, index) => (
                        <tr key={submission.id} className={index < 3 ? 'bg-amber-400/5' : ''}>
                          <td className="px-6 py-4 text-slate-200">#{index + 1}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-white">{submission.userName}</div>
                              <div className="text-sm text-slate-400">{submission.userEmail}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {/* FIX 3: Updated to finalScore */}
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getScoreBadgeColor(submission.finalScore)}`}>
                              {submission.finalScore}/{totalMarks}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-200">{formatTime(submission.totalTime)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getCheatBadgeColor(submission.tabSwitches)}`}>
                              {submission.tabSwitches}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-emerald-300">Completed</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="space-y-6">
              {submissions.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center text-slate-400 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl">
                  No submissions yet.
                </div>
              ) : (
                submissions.map((submission) => (
                  <div key={submission.id} className="rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl">
                    <div className="border-b border-white/10 px-6 py-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{submission.userName}</h3>
                          <p className="text-slate-400">{submission.userEmail}</p>
                        </div>
                        <div className="text-right">
                          {/* FIX 4: Updated to finalScore in detailed view */}
                          <div className={`mb-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${getScoreBadgeColor(submission.finalScore)}`}>
                            Score: {submission.finalScore}/{totalMarks}
                          </div>
                          <div className="text-sm text-slate-400">Submitted: {formatDate(submission.submittedAt)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4">
                      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-cyan-400/10 p-3">
                          <div className="text-sm font-medium text-cyan-100">Time Taken</div>
                          <div className="text-cyan-200">{formatTime(submission.totalTime)}</div>
                        </div>
                        <div className={`rounded-2xl p-3 ${submission.tabSwitches === 0 ? 'bg-emerald-400/10' : 'bg-rose-400/10'}`}>
                          <div className={`text-sm font-medium ${submission.tabSwitches === 0 ? 'text-emerald-100' : 'text-rose-100'}`}>Tab Switches</div>
                          <div className={submission.tabSwitches === 0 ? 'text-emerald-200' : 'text-rose-200'}>{submission.tabSwitches}</div>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-3">
                          <div className="text-sm font-medium text-slate-200">Started At</div>
                          <div className="text-sm text-slate-400">{formatDate(submission.startedAt)}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-white">Answers</h4>
                        {questions.map((question) => {
                          const answer = submission.answers[question.id] || ''
                          const correct = answer.toLowerCase().trim() === question.answer.toLowerCase().trim()

                          return (
                            <div key={question.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <div className="mb-2 text-sm font-medium text-slate-200">
                                Question {question.id} ({question.marks} marks)
                              </div>
                              <div className="mb-3 text-sm text-slate-400">{question.text}</div>
                              <div className="rounded-xl bg-slate-900/70 p-3 text-sm text-slate-200">{answer || '<No answer>'}</div>
                              <div className={`mt-2 text-xs ${correct ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {correct ? '[✓] Correct' : '[✗] Incorrect'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
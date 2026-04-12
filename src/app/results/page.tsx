'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { totalMarks } from '@/data/questions'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [score, setScore] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)

  useEffect(() => {
    const scoreParam = searchParams.get('score')
    const timeParam = searchParams.get('time')
    const switchesParam = searchParams.get('switches')

    if (scoreParam) setScore(parseInt(scoreParam, 10))
    if (timeParam) setTotalTime(parseInt(timeParam, 10))
    if (switchesParam) setTabSwitches(parseInt(switchesParam, 10))
  }, [searchParams])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  const getScoreColor = (value: number) => {
    if (value === totalMarks) return 'text-emerald-300'
    if (value >= totalMarks / 2) return 'text-amber-300'
    if (value > 0) return 'text-orange-300'
    return 'text-rose-300'
  }

  const getPerformanceMessage = (value: number, switches: number) => {
    if (value === totalMarks && switches === 0) return 'Perfect submission. Strong work.'
    if (value === totalMarks) return 'All questions correct.'
    if (value >= totalMarks / 2) return 'Good effort. Review the missed answers.'
    if (value > 0) return 'Partial credit achieved. Keep practicing.'
    return 'No marks earned this attempt.'
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Submission Complete</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Exam Completed</h1>
          <p className="mt-2 text-slate-300">Your result has been recorded in MongoDB.</p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <h2 className="text-lg font-semibold text-slate-200">Your Score</h2>
            <div className={`mt-2 text-6xl font-bold ${getScoreColor(score)}`}>
              {score}/{totalMarks}
            </div>
            <p className="mt-2 text-slate-300">Total marks earned</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/10 p-4 text-center">
              <h3 className="font-semibold text-cyan-100">Time Taken</h3>
              <p className="mt-2 text-2xl font-bold text-cyan-200">{formatTime(totalTime)}</p>
            </div>

            <div className={`rounded-3xl border p-4 text-center ${tabSwitches === 0 ? 'border-emerald-400/15 bg-emerald-400/10' : 'border-rose-400/15 bg-rose-400/10'}`}>
              <h3 className={`font-semibold ${tabSwitches === 0 ? 'text-emerald-100' : 'text-rose-100'}`}>Tab Switches</h3>
              <p className={`mt-2 text-2xl font-bold ${tabSwitches === 0 ? 'text-emerald-200' : 'text-rose-200'}`}>{tabSwitches}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-lg font-medium text-white">{getPerformanceMessage(score, tabSwitches)}</p>
          </div>

          <div className="rounded-3xl border border-amber-400/15 bg-amber-400/10 p-4">
            <h3 className="font-semibold text-amber-100">Performance Summary</h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-50/90">
              <li>• Questions answered: {score / 10} out of 2</li>
              <li>• Completion time: {formatTime(totalTime)}</li>
              <li>• Clean attempt: {tabSwitches === 0 ? 'Yes' : `No, ${tabSwitches} tab switches recorded`}</li>
              <li>• Final marks: {score === totalMarks ? 'Perfect' : score >= totalMarks / 2 ? 'Good' : score > 0 ? 'Partial' : 'Needs improvement'}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => router.push('/')}
            className="flex-1 rounded-2xl bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition hover:bg-cyan-400"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
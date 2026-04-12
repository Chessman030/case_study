'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EventPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (!token) {
      router.push('/')
      return
    }

    setUserName('Participant')
  }, [router])

  const handleEnterEvent = () => {
    router.push('/competition')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-950/75 p-10 text-center shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-cyan-300/80">Round 2 Overview</p>
        <h1 className="text-4xl font-bold text-white">Welcome to the Case Study Round</h1>
        <p className="mt-4 text-lg text-slate-300">Hello, {userName || 'Participant'}. You have 2 hours to answer 2 text questions.</p>

        <div className="mt-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left md:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-white">Rules</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Time limit: 2 hours</li>
              <li>• 2 text-based questions</li>
              <li>• Each question carries 10 marks</li>
              <li>• All questions must be answered before submit</li>
              <li>• Only one attempt is allowed</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Submission</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>• Answers are checked as text</li>
              <li>• Tab switching is recorded</li>
              <li>• Results are stored in MongoDB</li>
              <li>• Keep your answers precise and readable</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleEnterEvent}
          className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-[1.02]"
        >
          Enter the Round
        </button>
      </div>
    </div>
  )
}
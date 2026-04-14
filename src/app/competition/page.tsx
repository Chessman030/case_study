'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const DRAFT_STORAGE_KEY = 'draft_case_study_competition'

type CaseStudyId = 1 | 2
type CaseAnswers = { [questionNumber: number]: string }

const caseStudyDefinitions: {
  id: CaseStudyId
  title: string
  subtitle: string
  marks: number
  evidencePlaceholder: string
  questions: string[]
}[] = [
  {
    id: 1,
    title: 'Question 1',
    subtitle: 'Operation Quantum Breach',
    marks: 10,
    evidencePlaceholder: `Case Study 1: Operation: Quantum Breach
Briefing: At 2:00 AM last night, QuantumLogix (a rising tech startup) suffered a massive data breach. The attacker stole the entire user database and defaced the admin dashboard. You are the Incident Response Team. We have gathered 5 pieces of evidence from the crime scene: Emails, Server Logs, Code Snippets, Database records, and Security Reports. Read the evidence carefully, reconstruct the attacker's steps, and submit the answers to the 10 questions to close the case.

Part 1: The Evidence

Artifact A: Intercepted Employee Email (Monday, 9:00 AM)

Plaintext
From: IT-Support <admin@quantumlogix-update.com>
To: John Doe (Senior Developer) <j.doe@quantumlogix.com>
Subject: URGENT: Mandatory Server Migration Update

Hi John,
We are currently migrating our internal servers. Please log in immediately to confirm your developer credentials migrate over safely.
Click here to authenticate: https://secure.quantumlogix-update.com/auth/login

Thank you,
The IT Team

Artifact B: Incident Report - Physical Security (Monday, 11:30 AM)

Plaintext
Security Guard Log:
11:15 AM: A technician wearing a generic "Telecom Services" jacket arrived carrying a heavy server rack unit.
11:16 AM: John Doe (Senior Dev) was walking through the lobby. Because the technician's hands were full, John held the secure RFID-locked door open for him.
11:30 AM: The technician was seen leaving the building empty-handed. No telecom maintenance was scheduled for today.

Artifact C: Apache Web Server Logs (Monday, 1:00 PM - 1:15 PM)

Plaintext
[13:02:11] GET / HTTP/1.1 200 OK - IP: 192.168.1.50
[13:02:15] GET /robots.txt HTTP/1.1 200 OK - IP: 192.168.1.50
[13:02:40] GET /hidden-dev-portal/ HTTP/1.1 200 OK - IP: 192.168.1.50
[13:05:10] POST /api/login HTTP/1.1 401 Unauthorized - IP: 192.168.1.50 payload={"user":"admin", "pass":"admin"}
[13:05:12] POST /api/login HTTP/1.1 401 Unauthorized - IP: 192.168.1.50 payload={"user":"admin", "pass":"password"}
[13:06:00] POST /api/login HTTP/1.1 200 OK - IP: 192.168.1.50 payload={"user":"admin' OR 1=1 --", "pass":"anything"}
[13:10:22] POST /api/upload_profile_pic HTTP/1.1 200 OK - IP: 192.168.1.50 Content-Type: image/jpeg filename="shell.php"

Artifact D: Frontend Source Code Snippet (Found on GitHub)

JavaScript
// admin-dashboard.jsx
import React from 'react';

export default function AdminDashboard() {
  // TODO: Remove this before pushing to production!!!
  // The temporary API master key is: QL-88492-API-KEY
  // I deleted it from the active code, but it might still be in the git logs.

  return (
    <div>
      <h1>Welcome Admin</h1>
      <button disabled={true} id="nuclear-delete-btn">Wipe Database</button>
      <div style={{ display: none }} className="secret-flag">
        Flag: Quantum{DOM_M4n1pul4t10n}
      </div>
    </div>
  )
}

Artifact E: The Leaked Database Dump (Monday, 2:00 PM)

JSON
[
  { "id": 1, "username": "CEO_Alice", "password_hash": "e10adc3949ba59abbe56e057f20f883e" },
  { "id": 2, "username": "Intern_Bob", "password_hash": "e10adc3949ba59abbe56e057f20f883e" },
  { "id": 3, "username": "John_Doe", "password_hash": "5f4dcc3b5aa765d61d8327deb882cf99" }
]`,
    questions: [
      '1. What is the exact root domain the attacker used in the phishing email?',
      '2. What is the specific industry term for exploiting someone\'s politeness to get through a locked door?',
      '3. What file did the attacker check to find hidden directories?',
      '4. Enter the exact payload the attacker typed to bypass the SQL login.',
      '5. What specific HTTP header (MIME type) did the attacker spoof to upload the shell?',
      '6. What exact HTML attribute did the attacker delete to unlock the "Wipe Database" button?',
      '7. What exact CSS property and value was used to hide the secret flag? (Format: property: value)',
      '8. Where exactly should the attacker look to find the deleted API key?',
      '9. What cryptographic measure did the database admin fail to use to protect identical passwords?',
      '10. What "Factory Default" username/password did the attacker try first? (Format: user/pass)',
    ],
  },
  {
    id: 2,
    title: 'Question 2',
    subtitle: 'The Midnight Ransom',
    marks: 10,
    evidencePlaceholder: `Case Study 2: The Midnight Ransom

Briefing for Participants: "At 11:45 PM on a Friday, the cloud infrastructure of 'FinTech Flow' went completely offline. When the engineering team woke up, their databases were encrypted, and their backup servers were wiped. We have collected 5 artifacts: Slack logs, Server configurations, AWS CloudTrail logs, Network traffic, and a Ransom Note. Read the evidence, trace the attacker's lateral movement, and submit the 10 exact answers below to close the case."

Part 1: The Evidence

Artifact A: Slack Chat Logs (Friday, 4:30 PM)

[4:30 PM] @Dev_Dave: Hey team, the CI/CD pipeline is failing on the new logging module. 
[4:32 PM] @Senior_Sarah: Did you update the text formatting package? 
[4:35 PM] @Dev_Dave: Yeah, I just swapped to \`color-formatter-pro\` v2.1. It fixed the build! Pushing to production now.
[4:36 PM] @Senior_Sarah: Wait, didn't the security team flag that author last week?

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
You have 48 hours.`,
    questions: [
      '1. What is the exact name of the malicious third-party package Dev_Dave installed?',
      '2. What is the exact leaked JWT secret found in the auth config?',
      '3. What specific AWS service account was compromised?',
      '4. What is the exact name of the AWS S3 bucket the attacker deleted?',
      '5. What specific network protocol did the attacker use to exfiltrate the data?',
      '6. What is the exact external IP address the attacker sent the data to?',
      '7. What algorithm did the ransomware use to lock the files?',
      '8. What specific cryptocurrency ticker symbol did they request payment in?',
      '9. Enter the exact Linux command the attacker used to wipe the syslog.',
      '10. Which specific employee pushed the compromised code to production?',
    ],
  },
]

const initialCaseAnswers = (): CaseAnswers =>
  Object.fromEntries(Array.from({ length: 10 }, (_, index) => [index + 1, ''])) as CaseAnswers

export default function CompetitionPage() {
  const router = useRouter()
  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudyId>(1)
  const [answersByCaseStudy, setAnswersByCaseStudy] = useState<{ [key in CaseStudyId]: CaseAnswers }>(
    () => ({
      1: initialCaseAnswers(),
      2: initialCaseAnswers(),
    }),
  )
  const [timeLeft, setTimeLeft] = useState(2 * 60 * 60)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [startTime] = useState(new Date())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityRef = useRef(true)

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (!savedDraft) return
      const parsed = JSON.parse(savedDraft) as {
        caseStudy1Answers?: { [key: string]: string }
        caseStudy2Answers?: { [key: string]: string }
        timeLeft?: number
        tabSwitches?: number
      }

      setAnswersByCaseStudy((previous) => {
        const merged = {
          1: { ...previous[1] },
          2: { ...previous[2] },
        }

        for (let index = 1; index <= 10; index += 1) {
          const key = String(index)
          if (typeof parsed.caseStudy1Answers?.[key] === 'string') {
            merged[1][index] = parsed.caseStudy1Answers[key]
          }
          if (typeof parsed.caseStudy2Answers?.[key] === 'string') {
            merged[2][index] = parsed.caseStudy2Answers[key]
          }
        }

        return merged
      })

      if (typeof parsed.timeLeft === 'number' && Number.isFinite(parsed.timeLeft)) {
        setTimeLeft(Math.max(0, Math.floor(parsed.timeLeft)))
      }

      if (typeof parsed.tabSwitches === 'number' && Number.isFinite(parsed.tabSwitches)) {
        setTabSwitches(Math.max(0, Math.floor(parsed.tabSwitches)))
      }
    } catch {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (isSubmitted) return
    localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        caseStudy1Answers: Object.fromEntries(
          Object.entries(answersByCaseStudy[1]).map(([key, value]) => [String(key), value]),
        ),
        caseStudy2Answers: Object.fromEntries(
          Object.entries(answersByCaseStudy[2]).map(([key, value]) => [String(key), value]),
        ),
        timeLeft,
        tabSwitches,
      }),
    )
  }, [answersByCaseStudy, timeLeft, tabSwitches, isSubmitted])

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    const storedUserId = localStorage.getItem('userId')
    const storedUserEmail = localStorage.getItem('userEmail')

    if (!token || !storedUserId) {
      router.push('/')
      return
    }

    setUserId(storedUserId)
    setUserName('Participant')
    setUserEmail(storedUserEmail || '')

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }

        return prev - 1
      })
    }, 1000)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && visibilityRef.current) {
        setTabSwitches((prev) => prev + 1)
      }

      visibilityRef.current = document.visibilityState === 'visible'
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    const preventCheating = (event: KeyboardEvent) => {
      if (
        event.key === 'F12' ||
        (event.ctrlKey && event.shiftKey && event.key === 'I') ||
        (event.ctrlKey && event.shiftKey && event.key === 'C') ||
        (event.ctrlKey && event.key.toLowerCase() === 'u')
      ) {
        event.preventDefault()
      }
    }

    const preventContextMenu = (event: MouseEvent) => {
      event.preventDefault()
    }

    document.addEventListener('keydown', preventCheating)
    document.addEventListener('contextmenu', preventContextMenu)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('keydown', preventCheating)
      document.removeEventListener('contextmenu', preventContextMenu)
    }
  }, [router])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (caseStudyId: CaseStudyId, questionNumber: number, value: string) => {
    setAnswersByCaseStudy((previous) => ({
      ...previous,
      [caseStudyId]: {
        ...previous[caseStudyId],
        [questionNumber]: value,
      },
    }))
  }

  const handleSubmit = async () => {
    await submitExam()
  }

  const handleAutoSubmit = async () => {
    await submitExam()
  }

  const submitExam = async () => {
    if (isSubmitted) return

    setIsSubmitted(true)

    const endTime = new Date()
    const totalTime = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    try {
      const response = await fetch('/api/submit-case-studies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseStudy1Answers: Object.fromEntries(
            Object.entries(answersByCaseStudy[1]).map(([key, value]) => [String(key), value]),
          ),
          caseStudy2Answers: Object.fromEntries(
            Object.entries(answersByCaseStudy[2]).map(([key, value]) => [String(key), value]),
          ),
          userId,
          userName,
          userEmail,
          totalTime,
          tabSwitches,
          submittedAt: endTime.toISOString(),
          startedAt: startTime.toISOString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        localStorage.removeItem(DRAFT_STORAGE_KEY)
        
        // Pass score and other data to results page
        const finalScore = result.finalScore ?? 0
        router.push(
          `/results?score=${finalScore}&time=${totalTime}&switches=${tabSwitches}`,
        )
      } else {
        alert('Error submitting exam. Please try again.')
        setIsSubmitted(false)
      }
    } catch {
      alert('Error submitting exam. Please try again.')
      setIsSubmitted(false)
    }
  }

  const getCaseStudyStatus = (caseStudyId: CaseStudyId) => {
    const answeredCount = Object.values(answersByCaseStudy[caseStudyId]).filter(
      (answer) => answer.trim().length > 0,
    ).length
    return answeredCount === 10 ? 'answered' : 'unanswered'
  }

  const activeDefinition = caseStudyDefinitions.find((entry) => entry.id === activeCaseStudy)!
  const activeAnswers = answersByCaseStudy[activeCaseStudy]
  const activeAnsweredCount = Object.values(activeAnswers).filter((answer) => answer.trim().length > 0).length
  const totalAnsweredCount =
    Object.values(answersByCaseStudy[1]).filter((answer) => answer.trim().length > 0).length +
    Object.values(answersByCaseStudy[2]).filter((answer) => answer.trim().length > 0).length

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 text-center shadow-2xl shadow-cyan-950/30">
          <h2 className="text-2xl font-bold text-white">Submitting your exam...</h2>
          <div className="mx-auto mt-5 h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-white">
      <div className="flex min-h-screen flex-col gap-6 lg:flex-row">
        <aside className="w-full bg-slate-950/85 px-5 py-6 shadow-2xl shadow-cyan-950/25 backdrop-blur-xl lg:w-72">
          <div className="mb-6 border-b border-white/10 pb-4">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">Question Map</p>
            <h2 className="mt-2 text-xl font-semibold">Navigation</h2>
          </div>

          <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className={`text-2xl font-bold ${timeLeft <= 300 ? 'text-rose-400 timer-danger' : 'text-cyan-300'}`}>
              {formatTime(timeLeft)}
            </div>
            <p className="mt-1 text-sm text-slate-300">Time left</p>
          </div>

          <div className="space-y-3">
            {caseStudyDefinitions.map((caseStudy) => {
              return (
              <button
                key={caseStudy.id}
                onClick={() => setActiveCaseStudy(caseStudy.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left transition ${activeCaseStudy === caseStudy.id ? 'border-cyan-400/40 bg-cyan-500/15' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{caseStudy.title}</div>
                    <div className="text-xs text-slate-300">{caseStudy.marks} marks</div>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${getCaseStudyStatus(caseStudy.id) === 'answered' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
              </button>
              )
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            <div className="font-semibold">Cheat Detection</div>
            <div className="mt-1">Tab switches: {tabSwitches}</div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <header className="rounded-3xl border border-white/10 bg-slate-950/75 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">CTF Case Study Round 2</p>
                  <h1 className="mt-2 text-2xl font-bold text-white">Two-Case Submission</h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span>Welcome, {userName}</span>
                  <span className={`${timeLeft <= 300 ? 'text-rose-400' : 'text-emerald-300'}`}>{timeLeft <= 300 ? 'Time running out' : 'Active'}</span>
                </div>
              </div>
            </header>

            <section className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Case Study Evidence</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {activeDefinition.subtitle} (10 questions, 1 mark each)
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="max-h-72 min-h-48 overflow-y-auto whitespace-pre-wrap text-slate-200">
                  {activeDefinition.evidencePlaceholder}
                  {'\n\n'}
                  Keep this evidence block as your primary reference while solving all 10 questions in {activeDefinition.title}.
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-950/75 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">Your Answers</h3>
                <span className="text-sm text-slate-300">10-question case study form (1 mark each)</span>
              </div>

              <div className="max-h-[28rem] space-y-4 overflow-y-auto pr-1">
                {activeDefinition.questions.map((questionLabel, index) => {
                  const questionId = index + 1
                  return (
                    <div key={questionId}>
                      <label
                        htmlFor={`question-input-${activeCaseStudy}-${questionId}`}
                        className="mb-1 block text-sm font-medium text-slate-200"
                      >
                        {questionLabel}
                      </label>
                      <input
                        id={`question-input-${activeCaseStudy}-${questionId}`}
                        type="text"
                        value={activeAnswers[questionId] || ''}
                        onChange={(event) => handleAnswerChange(activeCaseStudy, questionId, event.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:bg-white/10"
                        placeholder={`Answer for question ${questionId}`}
                        autoComplete="off"
                      />
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-300">Draft auto-save: enabled</div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className={`rounded-2xl px-6 py-2.5 font-semibold transition ${!isSubmitted ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'cursor-not-allowed bg-white/10 text-slate-400'}`}
                >
                  Submit Exam
                </button>
              </div>

              <div className="mt-4 text-sm text-slate-300">
                Progress: {activeAnsweredCount}/10 questions answered in {activeDefinition.title}
                <span className="ml-3 text-slate-400">Total marks: 20</span>
                <span className="ml-3 text-slate-400">Overall answered: {totalAnsweredCount}/20</span>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
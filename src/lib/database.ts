import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { questions } from '@/data/questions'

const dataDir = path.join(process.cwd(), 'data')
const usersFile = path.join(dataDir, 'users.json')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify([], null, 2))
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  isAdmin: boolean
  hasAttempted: boolean
  createdAt: string
}

export interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  answers: { [questionId: number]: string }
  score: number
  totalTime: number
  cheatScore: number
  tabSwitches: number
  submittedAt: string
  startedAt: string
}

export function readUsers(): User[] {
  try {
    const data = fs.readFileSync(usersFile, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function writeUsers(users: User[]): void {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateScore(answers: { [questionId: number]: string }): number {
  let score = 0

  questions.forEach((question) => {
    const userAnswer = answers[question.id]?.toLowerCase().trim()
    const correctAnswer = question.answer.toLowerCase().trim()

    if (userAnswer === correctAnswer) {
      score += question.marks
    }
  })

  return score
}

export function markUserAsAttempted(userId: string): void {
  const users = readUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex !== -1) {
    users[userIndex].hasAttempted = true
    writeUsers(users)
  }
}
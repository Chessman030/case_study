import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json')

interface CaseStudySubmission {
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
  createdAt: Date
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

// Get all submissions from JSON file
export function getAllSubmissions(): CaseStudySubmission[] {
  try {
    ensureDataDir()
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8')
      return JSON.parse(data) as CaseStudySubmission[]
    }
  } catch (error) {
    console.error('Error reading submissions:', error)
  }
  return []
}

// Get submission by userId
export function getSubmissionByUserId(userId: string): CaseStudySubmission | null {
  try {
    const submissions = getAllSubmissions()
    return submissions.find((s) => s.userId === userId) || null
  } catch (error) {
    console.error('Error getting submission:', error)
  }
  return null
}

// Save submission to JSON file
export function saveSubmission(submission: CaseStudySubmission): boolean {
  try {
    ensureDataDir()
    const submissions = getAllSubmissions()
    
    // Remove if exists, then add new one
    const filtered = submissions.filter((s) => s.userId !== submission.userId)
    filtered.push(submission)
    
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(filtered, null, 2))
    return true
  } catch (error) {
    console.error('Error saving submission:', error)
    return false
  }
}

// Check if user already submitted
export function hasUserSubmitted(userId: string): boolean {
  try {
    return getSubmissionByUserId(userId) !== null
  } catch (error) {
    console.error('Error checking submission status:', error)
    return false
  }
}

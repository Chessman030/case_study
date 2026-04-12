import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import * as fallbackStorage from '@/lib/fallback-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    try {
      const client = await getMongoClient()
      const db = client.db()
      const submission = await db
        .collection('case_study_submissions')
        .findOne({ userId })

      if (!submission) {
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        submission: (() => {
          const { _id, ...doc } = submission
          return doc
        })(),
        source: 'mongodb',
      })
    } catch (mongoErr) {
      console.warn('MongoDB unavailable, using fallback storage:', mongoErr)
      const submission = fallbackStorage.getSubmissionByUserId(userId)

      if (!submission) {
        return NextResponse.json(
          { success: false, message: 'Submission not found' },
          { status: 404 },
        )
      }

      return NextResponse.json({
        success: true,
        submission,
        source: 'fallback',
      })
    }
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submission' },
      { status: 500 },
    )
  }
}

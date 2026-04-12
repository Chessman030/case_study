import { NextRequest, NextResponse } from 'next/server'
import { getMongoClient } from '@/lib/mongodb'
import * as fallbackStorage from '@/lib/fallback-storage'

export async function GET() {
  try {
    try {
      const client = await getMongoClient()
      const db = client.db()
      const submissions = await db
        .collection('case_study_submissions')
        .find()
        .sort({ finalScore: -1, totalTime: 1 })
        .toArray()

      return NextResponse.json({
        success: true,
        submissions: submissions.map(({ _id, ...doc }) => doc),
        source: 'mongodb',
      })
    } catch (mongoErr) {
      console.warn('MongoDB unavailable, using fallback storage:', mongoErr)
      const submissions = fallbackStorage.getAllSubmissions()
      
      return NextResponse.json({
        success: true,
        submissions: submissions.sort((a, b) => {
          // Primary sort: finalScore descending (highest first)
          if (b.finalScore !== a.finalScore) {
            return b.finalScore - a.finalScore
          }
          // Secondary sort: totalTime ascending (lowest time first)
          return a.totalTime - b.totalTime
        }),
        source: 'fallback',
      })
    }
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch submissions' },
      { status: 500 },
    )
  }
}

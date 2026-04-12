import { MongoClient } from 'mongodb'
import * as fs from 'fs'
import * as path from 'path'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

let clientPromise: Promise<MongoClient> | undefined

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  if (!clientPromise) {
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      })
      const connected = await Promise.race([
        client.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), 6000),
        ),
      ])
      
      clientPromise = Promise.resolve(client as MongoClient)

      if (process.env.NODE_ENV !== 'production') {
        global._mongoClientPromise = clientPromise
      }
    } catch (error) {
      console.error('MongoDB connection failed, using fallback storage:', error)
      // Return a mock client that uses local storage
      throw new Error(
        `MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}. Check your MONGODB_URI and network connectivity.`,
      )
    }
  }

  return clientPromise
}
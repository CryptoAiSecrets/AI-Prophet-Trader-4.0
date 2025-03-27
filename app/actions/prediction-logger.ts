"use server"

import { revalidatePath } from "next/cache"

export type PredictionType = "NASDAQ" | "Bitcoin" | "Stock" | "Portfolio"

export interface Prediction {
  id: string
  type: PredictionType
  symbol?: string
  timestamp: string
  currentValue: number
  predictedValue: number
  confidenceScore: number
  timeframe: string
  actualValue?: number
  accuracy?: number
}

// In a real application, this would connect to a database
// For demo purposes, we're using a server-side cache
let predictions: Prediction[] = []

// Initialize with some historical predictions for demo
if (predictions.length === 0) {
  const pastDays = 30
  const baseDate = new Date()

  // NASDAQ predictions
  for (let i = pastDays; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)

    const currentValue = 16000 + Math.random() * 1000
    const predictedValue = currentValue * (1 + (Math.random() * 0.1 - 0.03))
    const actualValue = i > 0 ? currentValue * (1 + (Math.random() * 0.08 - 0.03)) : undefined

    predictions.push({
      id: `nasdaq-${date.getTime()}`,
      type: "NASDAQ",
      timestamp: date.toISOString(),
      currentValue,
      predictedValue,
      confidenceScore: 70 + Math.random() * 25,
      timeframe: "24h",
      actualValue,
      accuracy: i > 0 ? 100 - Math.abs(((actualValue! - predictedValue) / predictedValue) * 100) : undefined,
    })
  }

  // Bitcoin predictions
  for (let i = pastDays; i >= 0; i--) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)

    const currentValue = 60000 + Math.random() * 5000
    const predictedValue = currentValue * (1 + (Math.random() * 0.15 - 0.05))
    const actualValue = i > 0 ? currentValue * (1 + (Math.random() * 0.12 - 0.06)) : undefined

    predictions.push({
      id: `bitcoin-${date.getTime()}`,
      type: "Bitcoin",
      timestamp: date.toISOString(),
      currentValue,
      predictedValue,
      confidenceScore: 65 + Math.random() * 25,
      timeframe: "24h",
      actualValue,
      accuracy: i > 0 ? 100 - Math.abs(((actualValue! - predictedValue) / predictedValue) * 100) : undefined,
    })
  }
}

export async function logPrediction(prediction: Omit<Prediction, "id">) {
  const id = `${prediction.type.toLowerCase()}-${Date.now()}`
  const newPrediction = { ...prediction, id }

  // Add to predictions array (in real app, save to database)
  predictions.unshift(newPrediction)

  // Keep only the last 1000 predictions
  if (predictions.length > 1000) {
    predictions = predictions.slice(0, 1000)
  }

  revalidatePath("/dashboard")
  return newPrediction
}

export async function updatePredictionActual(id: string, actualValue: number) {
  const prediction = predictions.find((p) => p.id === id)
  if (prediction) {
    prediction.actualValue = actualValue
    prediction.accuracy = 100 - Math.abs(((actualValue - prediction.predictedValue) / prediction.predictedValue) * 100)
  }

  revalidatePath("/dashboard")
  return prediction
}

export async function getPredictions(type?: PredictionType, limit = 100, offset = 0) {
  if (type) {
    return predictions.filter((p) => p.type === type).slice(offset, offset + limit)
  }

  return predictions.slice(offset, offset + limit)
}

export async function getPredictionById(id: string) {
  return predictions.find((p) => p.id === id)
}


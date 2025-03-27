"use server"

import { type Prediction, type PredictionType, logPrediction } from "../actions/prediction-logger"

// Simulate ML prediction models
// In a real implementation, this would use actual ML models

/**
 * Time series forecasting using a simulated ARIMA model
 * In a real app, this would use proper ML libraries and trained models
 */
function simulateTimeSeries(
  historicalData: number[],
  confidenceAdjustment = 0,
): {
  prediction: number
  confidence: number
} {
  if (historicalData.length < 5) {
    return { prediction: historicalData[historicalData.length - 1], confidence: 60 }
  }

  // Get the last few values for trend calculation
  const lastValues = historicalData.slice(-5)

  // Calculate mean
  const mean = lastValues.reduce((sum, val) => sum + val, 0) / lastValues.length

  // Calculate trend direction and magnitude
  const trends = []
  for (let i = 1; i < lastValues.length; i++) {
    trends.push((lastValues[i] - lastValues[i - 1]) / lastValues[i - 1])
  }

  // Average trend
  const avgTrend = trends.reduce((sum, val) => sum + val, 0) / trends.length

  // Apply moving average with trend adjustment
  const baselinePrediction = lastValues[lastValues.length - 1] * (1 + avgTrend)

  // Add some randomness to simulate market dynamics
  const volatility = (Math.std(historicalData) / mean) * 100 || 0.02
  const marketNoise = ((Math.random() * 2 - 1) * volatility * baselinePrediction) / 100

  // Calculate final prediction
  const prediction = baselinePrediction + marketNoise

  // Calculate confidence based on volatility and data quality
  let confidence = 90 - volatility * 200

  // Adjust confidence
  confidence = Math.min(95, Math.max(50, confidence + confidenceAdjustment))

  return { prediction, confidence }
}

// Add a standard deviation function to Math
declare global {
  interface Math {
    std(values: number[]): number
  }
}

Math.std = (values: number[]): number => {
  if (values.length === 0) return 0

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2))
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length

  return Math.sqrt(variance)
}

export async function generatePrediction(
  type: PredictionType,
  symbol: string,
  timeframe: string,
  currentValue: number,
  historicalValues: number[],
) {
  // Different adjustment factors for different assets
  let confidenceAdjustment = 0
  switch (type) {
    case "NASDAQ":
      confidenceAdjustment = 5 // More stable, higher confidence
      break
    case "Bitcoin":
      confidenceAdjustment = -10 // More volatile, lower confidence
      break
    case "Stock":
      // Adjust based on specific stock volatility profiles
      if (["AAPL", "MSFT", "GOOGL"].includes(symbol)) {
        confidenceAdjustment = 3 // Stable blue chips
      } else if (["TSLA", "NVDA", "COIN"].includes(symbol)) {
        confidenceAdjustment = -5 // More volatile
      }
      break
  }

  // Generate prediction with our simulated ML model
  const { prediction, confidence } = simulateTimeSeries(
    historicalValues.length > 0
      ? historicalValues
      : [currentValue * 0.99, currentValue * 0.995, currentValue, currentValue * 1.005],
    confidenceAdjustment,
  )

  // Create and log the prediction
  const newPrediction: Omit<Prediction, "id"> = {
    type,
    symbol: symbol !== type ? symbol : undefined,
    timestamp: new Date().toISOString(),
    currentValue,
    predictedValue: prediction,
    confidenceScore: confidence,
    timeframe,
  }

  return await logPrediction(newPrediction)
}


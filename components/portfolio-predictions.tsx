"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, RefreshCw, Lightbulb } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { PredictionHistory } from "@/components/prediction-history"
import { generatePrediction } from "@/app/ml/prediction-engine"

export function PortfolioPredictions() {
  const [mounted, setMounted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 300 })
  const [predictionValue, setPredictionValue] = useState<number | null>(null)
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [predictionGenerated, setPredictionGenerated] = useState(false)

  // Generate realistic financial data with daily fluctuations
  const generateFinancialData = () => {
    const data = []
    let value = 10000
    const today = new Date()

    // Historical data (25 days)
    for (let i = 0; i < 25; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (25 - i))

      // Create realistic daily fluctuations
      const dailyChange = Math.random() * 2 - 0.8 // Between -0.8% and 1.2%
      value = value * (1 + dailyChange / 100)

      data.push({
        day: i + 1,
        date: date.toISOString().split("T")[0],
        value: Math.round(value),
        isHistorical: true,
      })
    }

    const lastValue = data[data.length - 1].value

    // If we have a prediction, use it for the last few days
    let predictionTarget = predictionValue
    if (!predictionTarget) {
      // Otherwise generate a reasonable prediction
      const dailyChange = Math.random() * 1.5 - 0.3 // Between -0.3% and 1.2%
      predictionTarget = lastValue * (1 + (5 + dailyChange) / 100)
    }

    // Prediction data (5 days)
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + (i + 1))

      // Create a smooth curve from current value to prediction
      const progress = (i + 1) / 5
      const value = lastValue + (predictionTarget - lastValue) * progress

      data.push({
        day: i + 26,
        date: date.toISOString().split("T")[0],
        value: Math.round(value),
        isHistorical: false,
      })
    }

    return data
  }

  // Update dimensions on resize
  const updateDimensions = () => {
    if (containerRef.current) {
      const width = Math.max(containerRef.current.clientWidth - 16, 280) // Ensure minimum width
      const height = Math.min(300, Math.max(200, width * 0.6)) // Responsive height
      setDimensions({ width, height })
    }
  }

  // Generate portfolio prediction
  const generatePortfolioPrediction = async (portfolioData) => {
    try {
      const historicalValues = portfolioData.filter((d) => d.isHistorical).map((item) => item.value)

      const currentValue = historicalValues[historicalValues.length - 1]

      const predictionResult = await generatePrediction(
        "Portfolio",
        "USER_PORTFOLIO",
        "7d",
        currentValue,
        historicalValues,
      )

      setPredictionValue(predictionResult.predictedValue)
      setConfidenceScore(predictionResult.confidenceScore)
      setPredictionGenerated(true)
    } catch (err) {
      console.error("Error generating portfolio prediction:", err)
    }
  }

  // Make sure we only render on client
  useEffect(() => {
    setMounted(true)
    updateDimensions()

    const handleResize = () => {
      updateDimensions()
    }

    // Generate prediction if not already done
    if (!predictionGenerated) {
      const portfolioData = generateFinancialData()
      generatePortfolioPrediction(portfolioData)
    }

    // Add a small delay to ensure the container is properly rendered
    const timer = setTimeout(() => {
      updateDimensions()
    }, 100)

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timer)
    }
  }, [predictionGenerated])

  if (!mounted) {
    return (
      <Card className="bg-black/60 border-white/10">
        <CardHeader className="pb-2 p-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-[#00FF00]" />
            Portfolio Predictions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-sm">Loading chart...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const data = generateFinancialData()

  // Find min and max values for scaling
  const values = data.map((d) => d.value)
  const minValue = Math.floor((Math.min(...values) * 0.98) / 1000) * 1000 // Add some padding
  const maxValue = Math.ceil((Math.max(...values) * 1.02) / 1000) * 1000 // Add some padding

  // SVG dimensions
  const { width, height } = dimensions
  const padding = {
    top: Math.max(20, height * 0.1),
    right: Math.max(40, width * 0.1),
    bottom: Math.max(20, height * 0.1),
    left: Math.max(10, width * 0.05),
  }

  // Calculate the width of each day's section
  const dayWidth = (width - padding.left - padding.right) / 30

  // Scale a value to fit in the SVG
  const scaleY = (value) => {
    return (
      height - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (height - padding.top - padding.bottom)
    )
  }

  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Create path for historical data
  const historicalData = data.filter((d) => d.isHistorical)
  const historicalPath = historicalData
    .map((point, i) => {
      const x = padding.left + (point.day - 1) * dayWidth
      const y = scaleY(point.value)
      return `${i === 0 ? "M" : "L"} ${x},${y}`
    })
    .join(" ")

  // Create path for prediction data
  const predictionData = data.filter((d) => !d.isHistorical)
  const lastHistoricalPoint = historicalData[historicalData.length - 1]
  const lastHistoricalX = padding.left + (lastHistoricalPoint.day - 1) * dayWidth
  const lastHistoricalY = scaleY(lastHistoricalPoint.value)

  const predictionPath =
    `M ${lastHistoricalX},${lastHistoricalY} ` +
    predictionData
      .map((point) => {
        const x = padding.left + (point.day - 1) * dayWidth
        const y = scaleY(point.value)
        return `L ${x},${y}`
      })
      .join(" ")

  // Determine if we should show all grid lines or just a few on small screens
  const gridStep = width < 400 ? 2 : 1
  const labelStep = width < 400 ? 10 : 5

  // Calculate prediction change percentage
  const portfolioValue = lastHistoricalPoint.value
  const predictionChangePercent = predictionValue
    ? (((predictionValue - portfolioValue) / portfolioValue) * 100).toFixed(2)
    : (((predictionData[predictionData.length - 1].value - portfolioValue) / portfolioValue) * 100).toFixed(2)

  return (
    <Card className="bg-black/60 border-white/10">
      <CardHeader className="pb-1 flex flex-row items-center justify-between p-3">
        <CardTitle className="flex items-center gap-1 text-base">
          <TrendingUp className="h-4 w-4 text-[#00FF00]" />
          Portfolio Predictions
        </CardTitle>
        <div className="flex items-center gap-2">
          <PredictionHistory />
          <div className="flex items-center text-xs text-white/60">
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Live data</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 p-3" ref={containerRef}>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-lg font-bold">${portfolioValue.toLocaleString()}</div>
          {predictionValue && (
            <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full text-sm">
              <Lightbulb className="h-3.5 w-3.5 text-[#0088FF]" />
              <span className="font-medium text-[#0088FF]">+{predictionChangePercent}% (7d)</span>
              <span className="text-xs text-white/50">
                {confidenceScore ? `${confidenceScore.toFixed(0)}% confidence` : ""}
              </span>
            </div>
          )}
        </div>

        <div className="bg-black/30 p-2 sm:p-4 rounded-lg border border-white/10 relative">
          <svg width={width} height={height}>
            {/* Background grid - horizontal lines */}
            {Array.from({ length: 6 }).map((_, i) => {
              if (i % gridStep !== 0 && i !== 0 && i !== 5) return null
              const value = minValue + (i * (maxValue - minValue)) / 5
              const y = scaleY(value)
              return (
                <line
                  key={`grid-h-${i}`}
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#333"
                  strokeWidth="1"
                />
              )
            })}

            {/* Background grid - vertical day lines */}
            {Array.from({ length: 30 }).map((_, i) => {
              if (i % gridStep !== 0 && i !== 0 && i !== 29) return null
              const x = padding.left + i * dayWidth
              return (
                <line
                  key={`grid-v-${i}`}
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={height - padding.bottom}
                  stroke="#333"
                  strokeWidth={i % 5 === 0 ? "1" : "0.5"}
                  strokeDasharray={i % 5 === 0 ? "none" : "1,3"}
                />
              )
            })}

            {/* X-axis line */}
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              stroke="#666"
              strokeWidth="1.5"
            />

            {/* Y-axis labels on RIGHT side */}
            {Array.from({ length: 6 }).map((_, i) => {
              if (i % gridStep !== 0 && i !== 0 && i !== 5) return null
              const value = minValue + (i * (maxValue - minValue)) / 5
              return (
                <text
                  key={`y-label-${i}`}
                  x={width - padding.right + 5}
                  y={scaleY(value)}
                  textAnchor="start"
                  dominantBaseline="middle"
                  fill="#999"
                  fontSize="8"
                >
                  ${(value / 1000).toFixed(1)}k
                </text>
              )
            })}

            {/* X-axis labels (every few days) */}
            {data
              .filter((_, i) => i % labelStep === 0)
              .map((day) => (
                <text
                  key={`x-label-${day.day}`}
                  x={padding.left + (day.day - 1) * dayWidth}
                  y={height - padding.bottom + 12}
                  textAnchor="middle"
                  fill="#999"
                  fontSize="8"
                >
                  {formatDate(day.date)}
                </text>
              ))}

            {/* Divider between historical and prediction */}
            <line
              x1={padding.left + 25 * dayWidth}
              y1={padding.top}
              x2={padding.left + 25 * dayWidth}
              y2={height - padding.bottom}
              stroke="#666"
              strokeDasharray="5,5"
              strokeWidth="1.5"
            />

            {/* Historical data - Solid green line */}
            <path d={historicalPath} fill="none" stroke="#00FF00" strokeWidth="2" strokeLinejoin="round" />

            {/* Area under historical line */}
            <path
              d={`${historicalPath} L ${padding.left + (historicalData.length - 1) * dayWidth},${height - padding.bottom} L ${padding.left},${height - padding.bottom} Z`}
              fill="url(#greenGradient)"
              opacity="0.2"
            />

            {/* Prediction data - Dotted blue line */}
            <path
              d={predictionPath}
              fill="none"
              stroke="#0088FF"
              strokeWidth="2"
              strokeDasharray="5,5"
              strokeLinejoin="round"
            />

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00FF00" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00FF00" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Day markers on the historical line - only show a few on mobile */}
            {historicalData
              .filter((_, i) => (width < 400 ? i % 5 === 0 : true))
              .map((day) => (
                <circle
                  key={`marker-${day.day}`}
                  cx={padding.left + (day.day - 1) * dayWidth}
                  cy={scaleY(day.value)}
                  r="1.5"
                  fill="#00FF00"
                />
              ))}

            {/* Day markers on the prediction line */}
            {predictionData.map((day) => (
              <circle
                key={`marker-${day.day}`}
                cx={padding.left + (day.day - 1) * dayWidth}
                cy={scaleY(day.value)}
                r="1.5"
                fill="#0088FF"
              />
            ))}

            {/* Labels - only on larger screens */}
            {width > 350 && (
              <>
                <text x={padding.left + 5} y={padding.top - 8} fill="#00FF00" fontSize="8">
                  Historical
                </text>
                <text x={padding.left + 27 * dayWidth - 30} y={padding.top - 8} fill="#0088FF" fontSize="8">
                  Prediction
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Compact legend */}
        <div className="mt-2 flex justify-between text-xs">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-[#00FF00]"></div>
              <span className="text-white/80 text-[10px] sm:text-xs">Historical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-2 bg-[#0088FF]" style={{ borderTop: "1px dashed #0088FF" }}></div>
              <span className="text-white/80 text-[10px] sm:text-xs">Prediction</span>
            </div>
          </div>

          {predictionValue && (
            <div className="text-[10px] sm:text-xs text-white/80">
              ML Model Confidence: {confidenceScore.toFixed(0)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}


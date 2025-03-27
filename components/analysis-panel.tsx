"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, BarChart2, RefreshCw, Filter } from "lucide-react"
import { getPredictions } from "@/app/actions/prediction-logger"

export function AnalysisPanel() {
  const [predictions, setPredictions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("7d")
  const [assetType, setAssetType] = useState("all")

  useEffect(() => {
    loadPredictions()
    // Refresh data every 5 minutes
    const interval = setInterval(loadPredictions, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [timeframe, assetType])

  const loadPredictions = async () => {
    setIsLoading(true)
    try {
      // Get predictions from the server
      const data = await getPredictions(assetType !== "all" ? (assetType as any) : undefined, 100)
      setPredictions(data)
    } catch (error) {
      console.error("Failed to load predictions for analysis:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate accuracy metrics
  const accuracyMetrics = () => {
    if (predictions.length === 0) return { avg: 0, correct: 0, total: 0 }

    const withAccuracy = predictions.filter((p) => p.accuracy !== undefined)
    if (withAccuracy.length === 0) return { avg: 0, correct: 0, total: 0 }

    const avgAccuracy = withAccuracy.reduce((sum, p) => sum + (p.accuracy || 0), 0) / withAccuracy.length
    const correctPredictions = withAccuracy.filter((p) => p.accuracy > 70).length

    return {
      avg: avgAccuracy,
      correct: correctPredictions,
      total: withAccuracy.length,
    }
  }

  // Calculate prediction direction metrics
  const directionMetrics = () => {
    if (predictions.length === 0) return { up: 0, down: 0, upCorrect: 0, downCorrect: 0 }

    const withActual = predictions.filter((p) => p.actualValue !== undefined)
    if (withActual.length === 0) return { up: 0, down: 0, upCorrect: 0, downCorrect: 0 }

    const upPredictions = withActual.filter((p) => p.predictedValue > p.currentValue)
    const downPredictions = withActual.filter((p) => p.predictedValue <= p.currentValue)

    const upCorrect = upPredictions.filter((p) => (p.actualValue || 0) > p.currentValue).length
    const downCorrect = downPredictions.filter((p) => (p.actualValue || 0) <= p.currentValue).length

    return {
      up: upPredictions.length,
      down: downPredictions.length,
      upCorrect,
      downCorrect,
    }
  }

  // Prepare data for accuracy by asset type chart
  const accuracyByAssetType = () => {
    const types = ["NASDAQ", "Bitcoin", "Stock", "Portfolio"]
    return types.map((type) => {
      const typeData = predictions.filter((p) => p.type === type && p.accuracy !== undefined)
      const avgAccuracy =
        typeData.length > 0 ? typeData.reduce((sum, p) => sum + (p.accuracy || 0), 0) / typeData.length : 0

      return {
        name: type,
        accuracy: avgAccuracy,
        count: typeData.length,
      }
    })
  }

  // Prepare data for prediction confidence distribution
  const confidenceDistribution = () => {
    const ranges = [
      { name: "90-100%", min: 90, max: 100 },
      { name: "80-90%", min: 80, max: 90 },
      { name: "70-80%", min: 70, max: 80 },
      { name: "60-70%", min: 60, max: 70 },
      { name: "50-60%", min: 50, max: 60 },
      { name: "<50%", min: 0, max: 50 },
    ]

    return ranges.map((range) => {
      const count = predictions.filter((p) => p.confidenceScore >= range.min && p.confidenceScore < range.max).length

      return {
        name: range.name,
        value: count,
      }
    })
  }

  const metrics = accuracyMetrics()
  const directions = directionMetrics()
  const assetTypeData = accuracyByAssetType()
  const confidenceData = confidenceDistribution()

  // Colors for charts
  const COLORS = ["#00DC82", "#0088FE", "#FFBB28", "#FF8042", "#8884d8", "#FF5733"]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
            Prediction Analysis
          </h2>
          <p className="text-sm text-white/70">Detailed analysis of ML prediction performance</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center bg-black/40 rounded-lg border border-white/10 p-1">
            <Button
              variant={timeframe === "7d" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("7d")}
              className={timeframe === "7d" ? "bg-blue-500 text-white" : ""}
            >
              7D
            </Button>
            <Button
              variant={timeframe === "30d" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("30d")}
              className={timeframe === "30d" ? "bg-blue-500 text-white" : ""}
            >
              30D
            </Button>
            <Button
              variant={timeframe === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe("all")}
              className={timeframe === "all" ? "bg-blue-500 text-white" : ""}
            >
              All
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={loadPredictions}>
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>

            <div className="relative">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Overall Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">{metrics.avg.toFixed(1)}%</div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent">
                    <BarChart2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="text-xs text-white/60 mt-1">Based on {metrics.total} verified predictions</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Direction Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex justify-between">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span className="text-xl font-bold">
                        {directions.upCorrect}/{directions.up}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">Upward</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center text-red-500">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      <span className="text-xl font-bold">
                        {directions.downCorrect}/{directions.down}
                      </span>
                    </div>
                    <div className="text-xs text-white/60">Downward</div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold">
                      {directions.up + directions.down > 0
                        ? (
                            ((directions.upCorrect + directions.downCorrect) / (directions.up + directions.down)) *
                            100
                          ).toFixed(0)
                        : 0}
                      %
                    </div>
                    <div className="text-xs text-white/60">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Prediction Success Rate</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-3xl font-bold">
                    {metrics.total > 0 ? ((metrics.correct / metrics.total) * 100).toFixed(0) : 0}%
                  </div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent">
                    {metrics.total > 0 && metrics.correct / metrics.total > 0.7 ? (
                      <TrendingUp className="h-6 w-6 text-green-500" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {metrics.correct} successful predictions out of {metrics.total}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-black/40 border-white/10">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Accuracy by Asset Type</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={assetTypeData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid #0088FE",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/10">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Confidence Distribution</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={confidenceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {confidenceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.8)",
                        border: "1px solid #0088FE",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent predictions table */}
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="p-3">
              <CardTitle className="text-sm">Recent Predictions Analysis</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-3 py-2 text-left">Asset</th>
                      <th className="px-3 py-2 text-right">Current</th>
                      <th className="px-3 py-2 text-right">Predicted</th>
                      <th className="px-3 py-2 text-right">Actual</th>
                      <th className="px-3 py-2 text-center">Direction</th>
                      <th className="px-3 py-2 text-right">Accuracy</th>
                      <th className="px-3 py-2 text-right">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.slice(0, 10).map((prediction, index) => {
                      const isPredictionUp = prediction.predictedValue > prediction.currentValue
                      const isActualUp =
                        prediction.actualValue !== undefined && prediction.actualValue > prediction.currentValue
                      const isDirectionCorrect =
                        prediction.actualValue !== undefined &&
                        ((isPredictionUp && isActualUp) || (!isPredictionUp && !isActualUp))

                      return (
                        <tr key={index} className="border-t border-white/5 hover:bg-white/5">
                          <td className="px-3 py-2 text-left">{prediction.type}</td>
                          <td className="px-3 py-2 text-right">${prediction.currentValue.toLocaleString()}</td>
                          <td className={`px-3 py-2 text-right ${isPredictionUp ? "text-green-500" : "text-red-500"}`}>
                            ${prediction.predictedValue.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {prediction.actualValue !== undefined ? (
                              `$${prediction.actualValue.toLocaleString()}`
                            ) : (
                              <span className="text-white/40">Pending</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center">
                            {prediction.actualValue !== undefined ? (
                              isDirectionCorrect ? (
                                <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                              )
                            ) : (
                              <span className="text-white/40">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {prediction.accuracy !== undefined ? (
                              `${prediction.accuracy.toFixed(2)}%`
                            ) : (
                              <span className="text-white/40">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">{prediction.confidenceScore.toFixed(0)}%</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}


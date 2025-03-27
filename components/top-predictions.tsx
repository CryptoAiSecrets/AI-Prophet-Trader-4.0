"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, BarChart2, LineChart, Zap } from "lucide-react"

// Mock data for top prediction assets
const topPredictions = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 437.53,
    change: 5.15,
    prediction: {
      direction: "up",
      target: 480.0,
      confidence: 92,
      timeframe: "1 month",
    },
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 345.24,
    change: 2.39,
    prediction: {
      direction: "up",
      target: 370.0,
      confidence: 87,
      timeframe: "2 months",
    },
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.3,
    change: 2.62,
    prediction: {
      direction: "up",
      target: 200.0,
      confidence: 78,
      timeframe: "3 months",
    },
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 237.49,
    change: -1.21,
    prediction: {
      direction: "down",
      target: 210.0,
      confidence: 65,
      timeframe: "1 month",
    },
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 131.27,
    change: 2.76,
    prediction: {
      direction: "up",
      target: 145.0,
      confidence: 83,
      timeframe: "2 months",
    },
  },
]

interface TopPredictionsProps {
  setActiveTab?: (tab: string) => void
}

export function TopPredictions({ setActiveTab }: TopPredictionsProps) {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <h3 className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Top Prediction Assets
        </h3>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-black hover:from-blue-700 hover:to-blue-500 shadow-md shadow-blue-600/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("analyze")}
          >
            <BarChart2 className="h-3 w-3" />
            Analyze
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-500/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("predict")}
          >
            <LineChart className="h-3 w-3" />
            Predict
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-red-600 to-red-400 text-black hover:from-red-700 hover:to-red-500 shadow-md shadow-red-600/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("variables")}
          >
            <Zap className="h-3 w-3" />
            Variables
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {topPredictions.map((asset) => (
          <Card
            key={asset.symbol}
            className="bg-black/40 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300"
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-sm flex items-center gap-1">
                    {asset.symbol}
                    {asset.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <div className="text-xs text-white/70">{asset.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{formatCurrency(asset.price)}</div>
                  <div
                    className={`text-xs flex items-center justify-end ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {asset.change >= 0 ? <ArrowUp className="h-2 w-2 mr-1" /> : <ArrowDown className="h-2 w-2 mr-1" />}
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change}%
                  </div>
                </div>
              </div>

              <div
                className={`p-2 rounded-lg ${asset.prediction.direction === "up" ? "bg-green-500/10" : "bg-red-500/10"} border ${asset.prediction.direction === "up" ? "border-green-500/20" : "border-red-500/20"}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs font-medium">AI Prediction</div>
                  <div
                    className={`text-[10px] ${asset.prediction.direction === "up" ? "text-green-400" : "text-red-400"}`}
                  >
                    {asset.prediction.timeframe}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {asset.prediction.direction === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className="font-bold text-xs">{formatCurrency(asset.prediction.target)}</span>
                  </div>
                  <div className="text-[10px] px-1 py-0.5 rounded-full bg-white/10">
                    {asset.prediction.confidence}% confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"

// Mock data for stocks
const stocksData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 1.25, prediction: "up" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 337.18, change: 2.34, prediction: "up" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 131.86, change: -0.75, prediction: "down" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 127.74, change: 1.05, prediction: "up" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 416.1, change: 5.23, prediction: "up" },
  { symbol: "META", name: "Meta Platforms Inc.", price: 297.74, change: -1.32, prediction: "down" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 237.49, change: -3.21, prediction: "down" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 146.77, change: 0.87, prediction: "up" },
  { symbol: "V", name: "Visa Inc.", price: 235.44, change: 0.54, prediction: "up" },
]

export function StockList() {
  const [filter, setFilter] = useState("all")

  const filteredStocks = stocksData.filter((stock) => {
    if (filter === "gainers") return stock.change > 0
    if (filter === "losers") return stock.change < 0
    if (filter === "predictions") return stock.prediction === "up"
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={
            filter === "all"
              ? "bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
              : "hover:border-[#00DC82]/50 transition-colors duration-200"
          }
        >
          All
        </Button>
        <Button
          variant={filter === "gainers" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("gainers")}
          className={
            filter === "gainers"
              ? "bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
              : "hover:border-[#00DC82]/50 transition-colors duration-200"
          }
        >
          Gainers
        </Button>
        <Button
          variant={filter === "losers" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("losers")}
          className={
            filter === "losers"
              ? "bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
              : "hover:border-[#00DC82]/50 transition-colors duration-200"
          }
        >
          Losers
        </Button>
        <Button
          variant={filter === "predictions" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("predictions")}
          className={
            filter === "predictions"
              ? "bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
              : "hover:border-[#00DC82]/50 transition-colors duration-200"
          }
        >
          AI Predictions
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredStocks.map((stock) => (
          <Card
            key={stock.symbol}
            className="bg-black/40 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-3 relative">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold">{stock.symbol}</div>
                  <div className="text-sm text-white/70">{stock.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  {stock.prediction === "up" && (
                    <div className="text-green-500 bg-green-500/10 p-1 rounded-full">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  )}
                  {stock.prediction === "down" && (
                    <div className="text-red-500 bg-red-500/10 p-1 rounded-full">
                      <TrendingDown className="h-4 w-4" />
                    </div>
                  )}
                  <div className="text-right">
                    <div className="font-bold">${stock.price.toLocaleString()}</div>
                    <div
                      className={`text-sm flex items-center justify-end ${stock.change > 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {stock.change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {stock.change > 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </div>
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


"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

// Portfolio allocation data
const portfolioData = [
  { name: "Technology", value: 45, color: "#00DC82" },
  { name: "Finance", value: 20, color: "#3B82F6" },
  { name: "Healthcare", value: 15, color: "#EC4899" },
  { name: "Consumer", value: 10, color: "#EAB308" },
  { name: "Energy", value: 10, color: "#8B5CF6" },
]

const holdingsData = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 25, value: 4563.0, change: 2.3 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 15, value: 5057.7, change: 1.7 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 10, value: 1318.6, change: -0.5 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 8, value: 1021.92, change: 0.8 },
  { symbol: "NVDA", name: "NVIDIA Corp.", shares: 5, value: 2080.5, change: 3.2 },
]

interface PortfolioSummaryProps {
  detailed?: boolean
}

export function PortfolioSummary({ detailed = false }: PortfolioSummaryProps) {
  const totalValue = holdingsData.reduce((sum, item) => sum + item.value, 0)
  const dailyChange = 1.8 // Mock daily change percentage

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
            Portfolio Value
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xl">${totalValue.toLocaleString()}</span>
            <span className={`flex items-center ${dailyChange > 0 ? "text-green-500" : "text-red-500"}`}>
              {dailyChange > 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(dailyChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="h-64 relative group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00DC82]/5 to-transparent rounded-xl opacity-50"></div>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={portfolioData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {portfolioData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid #00DC82",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,220,130,0.3)",
              }}
              formatter={(value) => [`${value}%`, "Allocation"]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {detailed && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
            Holdings
          </h3>
          <div className="space-y-4">
            {holdingsData.map((holding) => (
              <Card
                key={holding.symbol}
                className="bg-black/40 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{holding.symbol}</div>
                      <div className="text-sm text-white/70">{holding.name}</div>
                      <div className="text-sm">{holding.shares} shares</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${holding.value.toLocaleString()}</div>
                      <div className={`text-sm ${holding.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {holding.change > 0 ? "+" : ""}
                        {holding.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


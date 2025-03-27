"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Clock, TrendingUp, TrendingDown } from "lucide-react"

// Mock news data
const newsItems = [
  {
    title: "NVIDIA Announces New AI Chip, Stock Surges 5%",
    source: "TechCrunch",
    time: "2 hours ago",
    url: "#",
    relatedAssets: [{ symbol: "NVDA", direction: "up" }],
    summary:
      "NVIDIA unveiled its next-generation AI chip, promising 2x performance over previous models. The announcement sent the stock up 5% in trading today.",
  },
  {
    title: "Microsoft Cloud Revenue Exceeds Expectations in Q3 Report",
    source: "Bloomberg",
    time: "5 hours ago",
    url: "#",
    relatedAssets: [
      { symbol: "MSFT", direction: "up" },
      { symbol: "AMZN", direction: "down" },
    ],
    summary:
      "Microsoft reported cloud revenue growth of 27%, beating analyst expectations of 23%. Azure continues to gain market share against AWS.",
  },
  {
    title: "Tesla Faces Production Challenges at Berlin Gigafactory",
    source: "Reuters",
    time: "1 day ago",
    url: "#",
    relatedAssets: [{ symbol: "TSLA", direction: "down" }],
    summary:
      "Tesla is experiencing production delays at its Berlin Gigafactory due to supply chain issues. The company may miss Q4 delivery targets.",
  },
  {
    title: "Apple's New AI Features Drive iPhone Upgrade Cycle",
    source: "Wall Street Journal",
    time: "3 hours ago",
    url: "#",
    relatedAssets: [{ symbol: "AAPL", direction: "up" }],
    summary:
      "Apple's latest AI features are driving stronger-than-expected iPhone upgrades, according to a survey of consumers in key markets.",
  },
]

export function NewsFeed() {
  return (
    <div className="space-y-3">
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
        Market News
      </h3>

      <div className="space-y-3">
        {newsItems.map((news, index) => (
          <Card
            key={index}
            className="bg-black/40 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-base">{news.title}</h4>
                <a
                  href={news.url}
                  className="text-white/50 hover:text-white ml-2 flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center text-xs text-white/60 mb-3">
                <span className="mr-3">{news.source}</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{news.time}</span>
              </div>

              <p className="text-sm text-white/80 mb-3">{news.summary}</p>

              <div className="flex flex-wrap gap-2">
                {news.relatedAssets.map((asset, idx) => (
                  <div
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                      asset.direction === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {asset.symbol}
                    {asset.direction === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


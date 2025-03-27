"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  Settings,
  User,
  Bell,
  Search,
  Home,
  Briefcase,
  TrendingUp,
  HelpCircle,
  LogOut,
  Grid,
  TrendingDown,
  PenToolIcon as Tool,
  Zap,
  Computer,
  Lightbulb,
  BarChart2,
} from "lucide-react"
import { NasdaqFeed } from "@/components/nasdaq-feed"
import { BitcoinFeed } from "@/components/bitcoin-feed"
import { ChatInterface } from "@/components/chat-interface"
import { HexagonBackground } from "@/components/hexagon-background"
import { PortfolioPredictions } from "@/components/portfolio-predictions"
import { PaperTrading } from "@/components/paper-trading"
import { TopPredictions } from "@/components/top-predictions"
import { NewsFeed } from "@/components/news-feed"
import { PredictionHistory } from "@/components/prediction-history"
import { AnalysisPanel } from "@/components/analysis-panel"
import { VariablesPanel } from "@/components/variables-panel"
import MobileNav from "@/app/components/mobile-nav"
import { SplashScreen } from "@/components/splash-screen"
import { InstallPrompt } from "@/components/install-prompt"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const [dataRefreshInterval, setDataRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // For animation effects
  useEffect(() => {
    setMounted(true)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    // Set up data refresh interval - refresh all live data every 60 seconds
    const refreshInterval = setInterval(() => {
      console.log("Refreshing live data...")
      // This will trigger re-fetching in components that have useEffect dependencies
      // We'll use a timestamp to force re-renders
      setDataRefreshInterval((prevInterval) => {
        if (prevInterval) clearInterval(prevInterval)
        return setInterval(() => {}, 60000)
      })
    }, 60000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(timer)
      if (dataRefreshInterval) clearInterval(dataRefreshInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  // Mock session data
  const session = { user: { name: "Demo User", email: "demo@example.com" } }

  return (
    <>
      {showSplash && <SplashScreen />}

      <div
        className={`flex h-[100dvh] bg-black text-white overflow-hidden ${
          mounted && !showSplash ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        {/* 3D Hexagon Background */}
        <div className="fixed inset-0 z-0">
          <HexagonBackground />
        </div>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex w-64 border-r border-white/10 bg-black/80 backdrop-blur-sm flex-col h-full z-10 relative">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AI Prophet
              </h1>
            </div>
          </div>

          <nav className="flex-1 overflow-auto p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Home className={`h-4 w-4 ${activeTab === "overview" ? "text-[#00DC82]" : ""}`} />
              Overview
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("portfolio")}
            >
              <Briefcase className={`h-4 w-4 ${activeTab === "portfolio" ? "text-[#00DC82]" : ""}`} />
              Portfolio
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "trading"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("trading")}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "trading" ? "text-[#00DC82]" : ""}`} />
              Paper Trading
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "market"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("market")}
            >
              <LineChart className={`h-4 w-4 ${activeTab === "market" ? "text-[#00DC82]" : ""}`} />
              Market Data
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("categories")}
            >
              <Grid className={`h-4 w-4 ${activeTab === "categories" ? "text-[#00DC82]" : ""}`} />
              Categories
            </Button>

            {/* Tools Section */}
            <div className="pt-2 pb-1">
              <Button
                variant="ghost"
                className={`w-full justify-between items-center transition-all duration-200 hover:bg-white/10 ${
                  toolsExpanded ? "bg-gradient-to-r from-[#00DC82]/10 to-transparent" : ""
                }`}
                onClick={() => setToolsExpanded(!toolsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Tool className="h-4 w-4" />
                  <span>Tools</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${toolsExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>

              {toolsExpanded && (
                <div className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "analyze"
                        ? "bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 pl-3"
                        : ""
                    }`}
                    onClick={() => setActiveTab("analyze")}
                  >
                    <BarChart3 className={`h-4 w-4 ${activeTab === "analyze" ? "text-blue-500" : ""}`} />
                    Analyze
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "predict"
                        ? "bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-500 pl-3"
                        : ""
                    }`}
                    onClick={() => setActiveTab("predict")}
                  >
                    <LineChart className={`h-4 w-4 ${activeTab === "predict" ? "text-amber-500" : ""}`} />
                    Predict
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "variables"
                        ? "bg-gradient-to-r from-red-500/20 to-transparent border-l-2 border-red-500 pl-3"
                        : ""
                    }`}
                    onClick={() => setActiveTab("variables")}
                  >
                    <Zap className={`h-4 w-4 ${activeTab === "variables" ? "text-red-500" : ""}`} />
                    Variables
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "assistant"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("assistant")}
            >
              <HelpCircle className={`h-4 w-4 ${activeTab === "assistant" ? "text-[#00DC82]" : ""}`} />
              AI Assistant
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "prediction-history"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => setActiveTab("prediction-history")}
            >
              <Lightbulb className={`h-4 w-4 ${activeTab === "prediction-history" ? "text-[#00DC82]" : ""}`} />
              ML Predictions
            </Button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:translate-x-1"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden z-10 relative w-full">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-between px-2 md:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

              {/* Logo for mobile */}
              <div className="md:hidden flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                  <TrendingUp className="h-3 w-3 text-black" />
                </div>
                <h1 className="text-base font-bold">AI Prophet</h1>
              </div>

              {/* Search - hidden on mobile */}
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-md pl-8 pr-4 py-1 focus:outline-none focus:ring-1 focus:ring-[#00DC82] w-40 md:w-64 transition-all duration-300 focus:w-48 md:focus:w-80"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
              <PredictionHistory />

              <Button variant="ghost" size="icon" className="rounded-full relative group h-8 w-8 md:h-10 md:w-10">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00DC82] rounded-full"></div>
                <Bell className="h-4 w-4 md:h-5 md:w-5 group-hover:text-[#00DC82] transition-colors duration-200" />
              </Button>
              <div className="flex items-center gap-1 md:gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10 hover:border-[#00DC82]/50 transition-colors duration-200">
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-[#00DC82]/80 to-[#36e4da]/80 flex items-center justify-center shadow-md">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-black" />
                </div>
                <span className="text-xs md:text-base hidden xs:block">
                  {session?.user?.name || session?.user?.email || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-2 md:p-6 backdrop-blur-sm">
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="bg-black/40 border border-white/10 p-1 rounded-lg backdrop-blur-sm w-full overflow-x-auto flex-nowrap whitespace-nowrap">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="market"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger
                  value="analyze"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-blue-400/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-blue-600/20 text-xs md:text-sm"
                >
                  Analyze
                </TabsTrigger>
                <TabsTrigger
                  value="predict"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/80 data-[state=active]:to-yellow-400/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20 text-xs md:text-sm"
                >
                  Predict
                </TabsTrigger>
                <TabsTrigger
                  value="variables"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/80 data-[state=active]:to-red-400/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-red-600/20 text-xs md:text-sm"
                >
                  Variables
                </TabsTrigger>
                <TabsTrigger
                  value="assistant"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Portfolio Predictions Chart */}
                  <div className="col-span-1">
                    <PortfolioPredictions />
                  </div>

                  {/* Top Prediction Assets */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <TopPredictions setActiveTab={setActiveTab} />
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-400 text-black hover:from-blue-700 hover:to-blue-500 shadow-md shadow-blue-600/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("analyze")}
                          >
                            <BarChart2 className="h-3 w-3" />
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-500/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("predict")}
                          >
                            <LineChart className="h-3 w-3" />
                            Predict
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-red-400 text-black hover:from-red-700 hover:to-red-500 shadow-md shadow-red-600/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("variables")}
                          >
                            <Zap className="h-3 w-3" />
                            Variables
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Market Data Predictions */}
                  <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">NASDAQ Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <NasdaqFeed />
                      </CardContent>
                    </Card>

                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#F7931A]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7931A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">Bitcoin Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <BitcoinFeed />
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Assistant */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300 h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          AI Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[calc(100%-60px)]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* News Feed */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <NewsFeed />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Portfolio Tab */}
              <TabsContent value="portfolio">
                <div className="grid grid-cols-1 gap-4">
                  {/* Portfolio Predictions Chart */}
                  <div className="col-span-1">
                    <PortfolioPredictions />
                  </div>

                  {/* Top Prediction Assets */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <TopPredictions setActiveTab={setActiveTab} />
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-400 text-black hover:from-blue-700 hover:to-blue-500 shadow-md shadow-blue-600/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("analyze")}
                          >
                            <BarChart2 className="h-3 w-3" />
                            Analyze
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-500/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("predict")}
                          >
                            <LineChart className="h-3 w-3" />
                            Predict
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-red-600 to-red-400 text-black hover:from-red-700 hover:to-red-500 shadow-md shadow-red-600/20 flex items-center gap-1 h-8 text-xs px-2"
                            onClick={() => setActiveTab("variables")}
                          >
                            <Zap className="h-3 w-3" />
                            Variables
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* AI Assistant */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300 h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          AI Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[calc(100%-60px)]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* News Feed */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <NewsFeed />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Paper Trading Tab */}
              <TabsContent value="trading">
                <div className="space-y-4">
                  <PaperTrading />

                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          Market Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-3 md:p-4">
                        <NasdaqFeed />
                      </CardContent>
                    </Card>

                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          Trading Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[300px] md:h-[400px]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Market Data Tab */}
              <TabsContent value="market">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="relative p-3 md:p-4">
                      <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                        NASDAQ Live Feed
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative p-3 md:p-4">
                      <NasdaqFeed detailed={false} />
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 gap-4">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#F7931A]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7931A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          Bitcoin Live Feed
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-3 md:p-4">
                        <BitcoinFeed />
                      </CardContent>
                    </Card>

                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="relative p-3 md:p-4">
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                          Market Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[300px] md:h-[500px]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Categories Tab (Replaced Crypto) */}
              <TabsContent value="categories">
                <div className="space-y-4">
                  <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="relative p-3 md:p-4">
                      <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                        Asset Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative p-3 md:p-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {[
                          { name: "Technology", count: 124, growth: 12.5, color: "from-blue-500 to-blue-600" },
                          { name: "Finance", count: 87, growth: 3.2, color: "from-green-500 to-green-600" },
                          { name: "Healthcare", count: 65, growth: 5.7, color: "from-purple-500 to-purple-600" },
                          { name: "Energy", count: 42, growth: -2.3, color: "from-amber-500 to-amber-600" },
                          { name: "Consumer", count: 78, growth: 1.8, color: "from-red-500 to-red-600" },
                          { name: "Industrial", count: 53, growth: 0.5, color: "from-gray-500 to-gray-600" },
                          { name: "Materials", count: 31, growth: -1.2, color: "from-teal-500 to-teal-600" },
                          { name: "Utilities", count: 22, growth: 2.1, color: "from-indigo-500 to-indigo-600" },
                          { name: "Real Estate", count: 36, growth: -0.8, color: "from-pink-500 to-pink-600" },
                          { name: "Communication", count: 45, growth: 4.3, color: "from-orange-500 to-orange-600" },
                          { name: "Crypto", count: 58, growth: 15.7, color: "from-yellow-500 to-yellow-600" },
                          { name: "ETFs", count: 112, growth: 2.9, color: "from-cyan-500 to-cyan-600" },
                        ].map((category, index) => (
                          <div
                            key={index}
                            className="bg-black/40 border border-white/10 rounded-lg p-3 hover:border-[#00DC82]/30 transition-all duration-300 group/card"
                          >
                            <div
                              className={`h-10 w-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-2`}
                            >
                              <Grid className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="font-bold text-base mb-1">{category.name}</h3>
                            <div className="text-xs text-white/70 mb-1">{category.count} assets</div>
                            <div
                              className={`text-xs flex items-center ${category.growth >= 0 ? "text-green-500" : "text-red-500"}`}
                            >
                              {category.growth >= 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              {category.growth >= 0 ? "+" : ""}
                              {category.growth}% this month
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Analyze Tab */}
              <TabsContent value="analyze">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-4">
                    <AnalysisPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Predict Tab */}
              <TabsContent value="predict">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-300">
                      Prediction Engine
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="bg-black/40 border-white/10">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">NASDAQ Prediction</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <NasdaqFeed />
                        </CardContent>
                      </Card>

                      <Card className="bg-black/40 border-white/10">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Bitcoin Prediction</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <BitcoinFeed />
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-4">
                      <Card className="bg-black/40 border-white/10">
                        <CardHeader className="p-3">
                          <CardTitle className="text-sm">Portfolio Prediction</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                          <PortfolioPredictions />
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Variables Tab */}
              <TabsContent value="variables">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-red-500/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardContent className="p-4">
                    <VariablesPanel />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Assistant Tab */}
              <TabsContent value="assistant">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative p-3 md:p-4">
                    <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
                      AI Financial Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative p-0 h-[calc(100vh-200px)]">
                    <ChatInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ML Predictions History Tab */}
              <TabsContent value="prediction-history">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
                        Machine Learning Prediction System
                      </CardTitle>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
                      >
                        <Computer className="h-4 w-4 mr-2" />
                        ML System Health
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-black/40 border-white/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">NASDAQ Predictions</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex justify-between">
                              <div>
                                <div className="text-2xl font-bold">89.7%</div>
                                <div className="text-xs text-white/60">Average accuracy</div>
                              </div>
                              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#00DC82]/10 to-transparent">
                                <Lightbulb className="h-6 w-6 text-[#00DC82]" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-white/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Bitcoin Predictions</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex justify-between">
                              <div>
                                <div className="text-2xl font-bold">78.3%</div>
                                <div className="text-xs text-white/60">Average accuracy</div>
                              </div>
                              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-[#F7931A]/10 to-transparent">
                                <Lightbulb className="h-6 w-6 text-[#F7931A]" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-white/10">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">Portfolio Predictions</CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="flex justify-between">
                              <div>
                                <div className="text-2xl font-bold">92.5%</div>
                                <div className="text-xs text-white/60">Average accuracy</div>
                              </div>
                              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/10 to-transparent">
                                <Lightbulb className="h-6 w-6 text-blue-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Tabs defaultValue="NASDAQ" className="mt-4">
                        <TabsList className="bg-black/40 border border-white/10">
                          <TabsTrigger
                            value="NASDAQ"
                            className="data-[state=active]:bg-[#00DC82] data-[state=active]:text-black"
                          >
                            NASDAQ
                          </TabsTrigger>
                          <TabsTrigger
                            value="Bitcoin"
                            className="data-[state=active]:bg-[#F7931A] data-[state=active]:text-black"
                          >
                            Bitcoin
                          </TabsTrigger>
                          <TabsTrigger
                            value="Portfolio"
                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-black"
                          >
                            Portfolio
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="NASDAQ" className="mt-4">
                          <div className="space-y-4">
                            <Card className="bg-black/40 border-white/10">
                              <CardHeader className="p-3">
                                <CardTitle className="text-sm">NASDAQ Prediction History</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-white/5">
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-right">Current</th>
                                        <th className="px-3 py-2 text-right">Predicted</th>
                                        <th className="px-3 py-2 text-right">Actual</th>
                                        <th className="px-3 py-2 text-center">Direction</th>
                                        <th className="px-3 py-2 text-right">Accuracy</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.from({ length: 10 }).map((_, i) => {
                                        const date = new Date()
                                        date.setDate(date.getDate() - i)
                                        const isCorrect = Math.random() > 0.2
                                        const current = 15900 + Math.random() * 1000
                                        const percent = (Math.random() * 2 - 0.5) / 100
                                        const predicted = current * (1 + percent)
                                        const actual = predicted * (1 + (Math.random() * 0.02 - 0.01))
                                        const accuracy = 100 - Math.abs(((actual - predicted) / predicted) * 100)

                                        return (
                                          <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                                            <td className="px-3 py-2 text-left">{date.toLocaleDateString()}</td>
                                            <td className="px-3 py-2 text-right">${current.toFixed(2)}</td>
                                            <td
                                              className={`px-3 py-2 text-right ${percent > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                              ${predicted.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-right">${actual.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-center">
                                              {isCorrect ? (
                                                <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                                              ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                                              )}
                                            </td>
                                            <td className="px-3 py-2 text-right">{accuracy.toFixed(2)}%</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="Bitcoin" className="mt-4">
                          <div className="space-y-4">
                            <Card className="bg-black/40 border-white/10">
                              <CardHeader className="p-3">
                                <CardTitle className="text-sm">Bitcoin Prediction History</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-white/5">
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-right">Current</th>
                                        <th className="px-3 py-2 text-right">Predicted</th>
                                        <th className="px-3 py-2 text-right">Actual</th>
                                        <th className="px-3 py-2 text-center">Direction</th>
                                        <th className="px-3 py-2 text-right">Accuracy</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.from({ length: 10 }).map((_, i) => {
                                        const date = new Date()
                                        date.setDate(date.getDate() - i)
                                        const isCorrect = Math.random() > 0.25
                                        const current = 60000 + Math.random() * 5000
                                        const percent = (Math.random() * 4 - 1.5) / 100
                                        const predicted = current * (1 + percent)
                                        const actual = predicted * (1 + (Math.random() * 0.04 - 0.02))
                                        const accuracy = 100 - Math.abs(((actual - predicted) / predicted) * 100)

                                        return (
                                          <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                                            <td className="px-3 py-2 text-left">{date.toLocaleDateString()}</td>
                                            <td className="px-3 py-2 text-right">${current.toFixed(2)}</td>
                                            <td
                                              className={`px-3 py-2 text-right ${percent > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                              ${predicted.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-right">${actual.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-center">
                                              {isCorrect ? (
                                                <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                                              ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                                              )}
                                            </td>
                                            <td className="px-3 py-2 text-right">{accuracy.toFixed(2)}%</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>

                        <TabsContent value="Portfolio" className="mt-4">
                          <div className="space-y-4">
                            <Card className="bg-black/40 border-white/10">
                              <CardHeader className="p-3">
                                <CardTitle className="text-sm">Portfolio Prediction History</CardTitle>
                              </CardHeader>
                              <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-white/5">
                                        <th className="px-3 py-2 text-left">Date</th>
                                        <th className="px-3 py-2 text-right">Current</th>
                                        <th className="px-3 py-2 text-right">Predicted</th>
                                        <th className="px-3 py-2 text-right">Actual</th>
                                        <th className="px-3 py-2 text-center">Direction</th>
                                        <th className="px-3 py-2 text-right">Accuracy</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Array.from({ length: 10 }).map((_, i) => {
                                        const date = new Date()
                                        date.setDate(date.getDate() - i)
                                        const isCorrect = Math.random() > 0.1
                                        const current = 10000 + Math.random() * 2000
                                        const percent = (Math.random() * 3 - 0.8) / 100
                                        const predicted = current * (1 + percent)
                                        const actual = predicted * (1 + (Math.random() * 0.015 - 0.005))
                                        const accuracy = 100 - Math.abs(((actual - predicted) / predicted) * 100)

                                        return (
                                          <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                                            <td className="px-3 py-2 text-left">{date.toLocaleDateString()}</td>
                                            <td className="px-3 py-2 text-right">${current.toFixed(2)}</td>
                                            <td
                                              className={`px-3 py-2 text-right ${percent > 0 ? "text-green-500" : "text-red-500"}`}
                                            >
                                              ${predicted.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-right">${actual.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-center">
                                              {isCorrect ? (
                                                <TrendingUp className="h-4 w-4 text-green-500 mx-auto" />
                                              ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500 mx-auto" />
                                              )}
                                            </td>
                                            <td className="px-3 py-2 text-right">{accuracy.toFixed(2)}%</td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <InstallPrompt />
    </>
  )
}


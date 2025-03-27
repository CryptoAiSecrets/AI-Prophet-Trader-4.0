"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Home,
  Briefcase,
  BarChart3,
  LineChart,
  HelpCircle,
  Settings,
  LogOut,
  Grid,
  PenToolIcon as Tool,
  Zap,
} from "lucide-react"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 flex items-center justify-center">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0 bg-black/90 border-r border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#00DC82] flex items-center justify-center">
                <LineChart className="h-3 w-3 text-black" />
              </div>
              <h1 className="text-base font-bold">AI Prophet</h1>
            </div>
          </div>

          <nav className="flex-1 overflow-auto p-3 space-y-1">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("overview")}
            >
              <Home className={`h-4 w-4 ${activeTab === "overview" ? "text-[#00DC82]" : ""}`} />
              Overview
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("portfolio")}
            >
              <Briefcase className={`h-4 w-4 ${activeTab === "portfolio" ? "text-[#00DC82]" : ""}`} />
              Portfolio
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "trading"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("trading")}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "trading" ? "text-[#00DC82]" : ""}`} />
              Paper Trading
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "market"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("market")}
            >
              <LineChart className={`h-4 w-4 ${activeTab === "market" ? "text-[#00DC82]" : ""}`} />
              Market Data
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("categories")}
            >
              <Grid className={`h-4 w-4 ${activeTab === "categories" ? "text-[#00DC82]" : ""}`} />
              Categories
            </Button>

            {/* Tools Section */}
            <div className="pt-1 pb-1">
              <Button
                variant="ghost"
                className={`w-full justify-between items-center text-sm h-10 ${
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
                    className={`w-full justify-start gap-2 text-xs h-8 ${
                      activeTab === "analyze"
                        ? "bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("analyze")}
                  >
                    <BarChart3 className={`h-3 w-3 ${activeTab === "analyze" ? "text-blue-500" : ""}`} />
                    Analyze
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 text-xs h-8 ${
                      activeTab === "predict"
                        ? "bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("predict")}
                  >
                    <LineChart className={`h-3 w-3 ${activeTab === "predict" ? "text-amber-500" : ""}`} />
                    Predict
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 text-xs h-8 ${
                      activeTab === "variables"
                        ? "bg-gradient-to-r from-red-500/20 to-transparent border-l-2 border-red-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("variables")}
                  >
                    <Zap className={`h-3 w-3 ${activeTab === "variables" ? "text-red-500" : ""}`} />
                    Variables
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 text-sm h-10 ${
                activeTab === "assistant"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("assistant")}
            >
              <HelpCircle className={`h-4 w-4 ${activeTab === "assistant" ? "text-[#00DC82]" : ""}`} />
              AI Assistant
            </Button>
          </nav>

          <div className="p-3 border-t border-white/10">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 text-sm h-10">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


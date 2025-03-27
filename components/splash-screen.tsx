"use client"

import { useEffect, useState } from "react"
import { LineChart } from "lucide-react"

export function SplashScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide splash screen after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-[#00DC82]/20 rounded-full animate-ping"></div>
        <div className="absolute inset-2 bg-[#00DC82]/40 rounded-full animate-pulse"></div>
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20 relative z-10">
          <LineChart className="h-12 w-12 text-black" />
        </div>
      </div>
      <h1 className="mt-8 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
        AI Prophet
      </h1>
      <p className="mt-2 text-white/60">Financial Prediction System</p>
    </div>
  )
}


"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, User, Bot, Loader2, Paperclip } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  compact?: boolean
}

export function ChatInterface({ compact = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (!compact) {
      inputRef.current?.focus()
    }
  }, [compact])

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return

    // Add user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        timestamp: new Date(),
      },
    ])
    setIsLoading(true)

    // Clear input
    setInput("")

    try {
      // In a real app, this would call an API endpoint that connects to OpenAI, Anthropic, etc.
      // For now, we'll simulate an AI response based on keywords

      const userMessage = input.toLowerCase()
      let response = ""

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (userMessage.includes("stock") || userMessage.includes("invest")) {
        response =
          "Based on current market trends and our AI analysis, technology and renewable energy sectors show strong growth potential. Companies with solid fundamentals in AI, cloud computing, and sustainable energy are particularly promising. Would you like specific stock recommendations?"
      } else if (userMessage.includes("market") || userMessage.includes("trend")) {
        response =
          "The market is showing mixed signals today. NASDAQ is up 0.8%, while the S&P 500 is down 0.2%. The volatility index (VIX) is relatively stable at 15.3, indicating moderate market uncertainty. Tech stocks are outperforming other sectors, particularly semiconductor and AI-related companies."
      } else if (userMessage.includes("predict") || userMessage.includes("forecast")) {
        response =
          "Our AI models predict moderate growth in the next quarter, with potential volatility due to upcoming economic reports and Fed decisions. The tech sector is expected to outperform the broader market, with a projected 5-7% growth compared to 2-3% for the S&P 500. However, be aware that inflation concerns could impact these projections."
      } else if (userMessage.includes("portfolio") || userMessage.includes("my holdings")) {
        response =
          "Your portfolio is currently weighted 45% in technology, 20% in finance, 15% in healthcare, and 20% in consumer and energy sectors. Based on our analysis, this allocation is well-positioned for current market conditions, though you might consider increasing exposure to renewable energy and AI-focused companies for long-term growth."
      } else if (userMessage.includes("risk") || userMessage.includes("volatility")) {
        response =
          "Current market volatility is moderate with a VIX of 15.3. Your portfolio has a beta of 1.2, indicating slightly higher volatility than the overall market. To reduce risk, consider adding more defensive stocks or increasing your allocation to dividend-paying companies with stable cash flows."
      } else if (userMessage.includes("bitcoin") || userMessage.includes("crypto")) {
        response =
          "Bitcoin is currently showing strong momentum with increased institutional adoption. Our analysis indicates a potential upside of 15-20% in the next quarter, though with significant volatility. The broader crypto market tends to follow Bitcoin's movements, but with even higher volatility."
      } else {
        response =
          "I can provide financial insights, market analysis, and investment recommendations based on real-time data and AI predictions. I can help with portfolio analysis, risk assessment, market trends, and specific stock information. What specific financial information are you looking for today?"
      }

      // Add AI response
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full bg-black/30 rounded-lg overflow-hidden border border-white/10 max-w-full">
      {/* Chat header */}
      <div className="p-2 border-b border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-md shadow-[#00DC82]/20">
            <Bot className="h-3 w-3 text-black" />
          </div>
          <div>
            <div className="font-medium text-xs">AI Prophet Assistant</div>
            <div className="text-[10px] text-white/60">Online</div>
          </div>
        </div>
      </div>

      {/* Messages container - styled like a phone messaging app */}
      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto p-2 space-y-3 ${compact ? "max-h-[300px] sm:max-h-[500px]" : "min-h-[200px] sm:min-h-[600px]"}`}
        style={{
          backgroundImage: "url('/grid.svg')",
          backgroundSize: "100px 100px",
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className={`flex flex-col max-w-[95%] ${message.role === "user" ? "ml-auto" : "mr-auto"}`}>
            <div className={`flex items-end gap-1 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00DC82]/20">
                  <Bot className="h-3 w-3 text-black" />
                </div>
              )}

              <div
                className={`rounded-2xl px-3 py-1.5 text-xs ${
                  message.role === "user"
                    ? "bg-[#00DC82] text-black rounded-br-none"
                    : "bg-white/10 backdrop-blur-sm rounded-bl-none"
                }`}
              >
                {message.content}
              </div>

              {message.role === "user" && (
                <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className={`text-[10px] text-white/50 mt-0.5 ${message.role === "user" ? "text-right mr-8" : "ml-8"}`}>
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-end gap-1">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#00DC82]/20">
              <Bot className="h-3 w-3 text-black" />
            </div>
            <div className="rounded-2xl rounded-bl-none px-3 py-2 bg-white/10 backdrop-blur-sm">
              <div className="flex space-x-1">
                <div
                  className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - styled like a phone messaging app */}
      <div className="p-2 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-1 items-end">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 p-0 bg-white/5 hover:bg-white/10 flex-shrink-0"
          >
            <Paperclip className="h-3 w-3" />
          </Button>

          <div className="relative flex-1">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message AI Prophet..."
              className="w-full bg-white/5 border border-white/10 rounded-full px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-[#00DC82] resize-none transition-all duration-200 focus:border-[#00DC82]/50 min-h-[32px] max-h-[80px] text-xs"
              rows={1}
              disabled={isLoading}
              style={{ overflow: "hidden", height: "auto" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement
                target.style.height = "auto"
                target.style.height = `${Math.min(target.scrollHeight, 80)}px`
              }}
            />
          </div>

          <Button
            onClick={handleSend}
            className="rounded-full h-8 w-8 p-0 bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20 transition-all duration-200 flex items-center justify-center flex-shrink-0"
            disabled={input.trim() === "" || isLoading}
          >
            {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
          </Button>
        </div>
      </div>
    </div>
  )
}


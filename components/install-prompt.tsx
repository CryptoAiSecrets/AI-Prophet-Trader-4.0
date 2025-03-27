"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia("(display-mode: standalone)").matches
    if (isInstalled) return

    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed) return

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      // Show our custom install prompt
      setTimeout(() => {
        setShowPrompt(true)
      }, 5000)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    // We've used the prompt, and can't use it again, discard it
    setDeferredPrompt(null)
    setShowPrompt(false)

    // Log the outcome
    console.log(`User ${outcome} the A2HS prompt`)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Remember that the user dismissed the prompt
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-lg shadow-[#00DC82]/10">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-lg">Install AI Prophet</h3>
          <p className="text-sm text-white/70 mt-1">
            Install this app on your device for quick access and offline functionality.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDismiss} className="mt-1">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleInstall}
          className="flex-1 bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
        >
          <Download className="h-4 w-4 mr-2" />
          Install App
        </Button>
        <Button variant="outline" onClick={handleDismiss} className="flex-1">
          Not Now
        </Button>
      </div>
    </div>
  )
}


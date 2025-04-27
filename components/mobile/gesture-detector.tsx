"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSwipe } from "@/hooks/use-swipe"
import { cn } from "@/lib/utils"
import { useUIContext } from "@/context/ui-context"
import { AnimatePresence, motion } from "framer-motion"

interface GestureDetectorProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  disableHorizontal?: boolean
  disableVertical?: boolean
  threshold?: number
  className?: string
}

export function GestureDetector({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disableHorizontal = false,
  disableVertical = false,
  threshold = 50,
  className,
}: GestureDetectorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { handleSwipe, swipeState } = useSwipe({
    threshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    disableHorizontal,
    disableVertical,
  })
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useUIContext()
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()

  // Visual feedback for gestures
  useEffect(() => {
    if (swipeState.direction) {
      setFeedback(swipeState.direction)
      const timer = setTimeout(() => setFeedback(null), 500)
      return () => clearTimeout(timer)
    }
  }, [swipeState.direction])

  // Add haptic feedback if available
  useEffect(() => {
    if (swipeState.direction && "navigator" in window && "vibrate" in navigator) {
      navigator.vibrate(10) // Subtle vibration
    }
  }, [swipeState.direction])

  return (
    <div
      ref={containerRef}
      className={cn("relative touch-manipulation", className)}
      onTouchStart={(e) => handleSwipe.onTouchStart(e)}
      onTouchMove={(e) => handleSwipe.onTouchMove(e)}
      onTouchEnd={(e) => handleSwipe.onTouchEnd(e)}
    >
      {children}

      {/* Visual feedback indicator */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className={cn(
              "fixed inset-0 z-50 pointer-events-none flex items-center justify-center",
              feedback === "left" && "bg-gradient-to-r from-primary/20 to-transparent",
              feedback === "right" && "bg-gradient-to-l from-primary/20 to-transparent",
              feedback === "up" && "bg-gradient-to-b from-primary/20 to-transparent",
              feedback === "down" && "bg-gradient-to-t from-primary/20 to-transparent",
            )}
          >
            <div className="text-4xl text-primary/50">
              {feedback === "left" && "←"}
              {feedback === "right" && "→"}
              {feedback === "up" && "↑"}
              {feedback === "down" && "↓"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

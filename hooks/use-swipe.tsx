"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface SwipeOptions {
  threshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  disableHorizontal?: boolean
  disableVertical?: boolean
}

interface SwipeState {
  touchStartX: number
  touchStartY: number
  touchEndX: number
  touchEndY: number
  swiping: boolean
  direction: "left" | "right" | "up" | "down" | null
}

export function useSwipe({
  threshold = 50,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disableHorizontal = false,
  disableVertical = false,
}: SwipeOptions = {}) {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    touchStartX: 0,
    touchStartY: 0,
    touchEndX: 0,
    touchEndY: 0,
    swiping: false,
    direction: null,
  })

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setSwipeState((prev) => ({
      ...prev,
      touchStartX: e.targetTouches[0].clientX,
      touchStartY: e.targetTouches[0].clientY,
      touchEndX: e.targetTouches[0].clientX,
      touchEndY: e.targetTouches[0].clientY,
      swiping: true,
      direction: null,
    }))
  }, [])

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeState.swiping) return

      setSwipeState((prev) => ({
        ...prev,
        touchEndX: e.targetTouches[0].clientX,
        touchEndY: e.targetTouches[0].clientY,
      }))

      // Prevent default to avoid scrolling while swiping
      const deltaX = Math.abs(swipeState.touchEndX - swipeState.touchStartX)
      const deltaY = Math.abs(swipeState.touchEndY - swipeState.touchStartY)

      if ((deltaX > 10 && !disableHorizontal) || (deltaY > 10 && !disableVertical)) {
        e.preventDefault()
      }
    },
    [swipeState, disableHorizontal, disableVertical],
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeState.swiping) return

      const deltaX = swipeState.touchEndX - swipeState.touchStartX
      const deltaY = swipeState.touchEndY - swipeState.touchStartY

      let direction: "left" | "right" | "up" | "down" | null = null

      // Determine if the swipe was horizontal or vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (!disableHorizontal && Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            direction = "right"
            onSwipeRight?.()
          } else {
            direction = "left"
            onSwipeLeft?.()
          }
        }
      } else {
        // Vertical swipe
        if (!disableVertical && Math.abs(deltaY) > threshold) {
          if (deltaY > 0) {
            direction = "down"
            onSwipeDown?.()
          } else {
            direction = "up"
            onSwipeUp?.()
          }
        }
      }

      setSwipeState((prev) => ({
        ...prev,
        swiping: false,
        direction,
      }))
    },
    [swipeState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, disableHorizontal, disableVertical],
  )

  return {
    swipeState,
    handleSwipe: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  }
}

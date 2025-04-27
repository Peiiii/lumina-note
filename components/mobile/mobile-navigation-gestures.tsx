"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { GestureDetector } from "./gesture-detector"
import { useUIContext } from "@/context/ui-context"
import { useNotesContext } from "@/context/notes-context"
import { trackEvent } from "@/lib/utils/performance-monitor"

export function MobileNavigationGestures({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isMobileMenuOpen, setIsMobileMenuOpen, isAIPanelOpen, setIsAIPanelOpen, currentView, setCurrentView } =
    useUIContext()
  const { notes, currentNoteId, setCurrentNoteId } = useNotesContext()

  // Handle swipe gestures based on current view
  const handleSwipeLeft = () => {
    trackEvent("mobile_gesture", "swipe_left")

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
      return
    }

    // If we're in the notes list view, navigate to the editor
    if (currentView === "notesList" && currentNoteId) {
      setCurrentView("noteEditor")
      return
    }

    // If we're in the editor view, open the AI panel
    if (currentView === "noteEditor" && !isAIPanelOpen) {
      setIsAIPanelOpen(true)
      return
    }
  }

  const handleSwipeRight = () => {
    trackEvent("mobile_gesture", "swipe_right")

    // If AI panel is open, close it first
    if (isAIPanelOpen) {
      setIsAIPanelOpen(false)
      return
    }

    // If we're in the editor view, go back to notes list
    if (currentView === "noteEditor") {
      setCurrentView("notesList")
      return
    }

    // If we're in the notes list view, open the menu
    if (currentView === "notesList" && !isMobileMenuOpen) {
      setIsMobileMenuOpen(true)
      return
    }
  }

  // Navigate to next/previous note with swipe up/down in editor view
  const handleSwipeUp = () => {
    if (currentView !== "noteEditor" || !currentNoteId) return

    const currentIndex = notes.findIndex((note) => note.id === currentNoteId)
    if (currentIndex > 0) {
      const prevNote = notes[currentIndex - 1]
      setCurrentNoteId(prevNote.id)
      trackEvent("mobile_gesture", "swipe_up_next_note")
    }
  }

  const handleSwipeDown = () => {
    if (currentView !== "noteEditor" || !currentNoteId) return

    const currentIndex = notes.findIndex((note) => note.id === currentNoteId)
    if (currentIndex < notes.length - 1) {
      const nextNote = notes[currentIndex + 1]
      setCurrentNoteId(nextNote.id)
      trackEvent("mobile_gesture", "swipe_down_prev_note")
    }
  }

  return (
    <GestureDetector
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
      onSwipeDown={handleSwipeDown}
      threshold={70} // Slightly higher threshold to avoid accidental triggers
      className="h-full w-full"
    >
      {children}
    </GestureDetector>
  )
}

"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface UIContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  activeNote: string | null
  setActiveNote: (noteId: string | null) => void
  showAIPanel: boolean
  setShowAIPanel: (show: boolean) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("notes")
  const [activeNote, setActiveNote] = useState<string | null>(null)
  const [showAIPanel, setShowAIPanel] = useState(false)

  return (
    <UIContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        activeTab,
        setActiveTab,
        activeNote,
        setActiveNote,
        showAIPanel,
        setShowAIPanel,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}

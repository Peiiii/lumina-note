"use client"

import type React from "react"

import { Home, Book, Search, Settings, Plus } from "lucide-react"
import { useStore } from "@/lib/store/store"
import { useState } from "react"
import { SemanticSearch } from "@/components/search/semantic-search"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { DataManagement } from "@/components/settings/data-management"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export function MobileNav() {
  const { setActiveNote, setSidebarOpen, setActiveTab, createNote, activeNoteId } = useStore()
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleHomeClick = () => {
    setActiveNote(null)
    setSidebarOpen(true)
    setActiveTab("notes")
  }

  const handleNotesClick = () => {
    setSidebarOpen(true)
    setActiveTab("notes")
  }

  const handleNewNote = () => {
    const noteId = createNote()
    setActiveNote(noteId)
    setSidebarOpen(false)
  }

  return (
    <>
      <div className="h-16 border-t border-gray-800 grid grid-cols-5 bg-gray-950 safe-bottom">
        <NavButton
          icon={<Home className="h-5 w-5" />}
          label="首页"
          onClick={handleHomeClick}
          isActive={!activeNoteId}
        />
        <NavButton icon={<Book className="h-5 w-5" />} label="笔记" onClick={handleNotesClick} isActive={false} />
        <NavButton
          icon={
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center"
            >
              <Plus className="h-6 w-6" />
            </motion.div>
          }
          label=""
          onClick={handleNewNote}
          isActive={false}
          className="-mt-5"
        />
        <NavButton
          icon={<Search className="h-5 w-5" />}
          label="搜索"
          onClick={() => setShowSearch(true)}
          isActive={false}
        />
        <NavButton
          icon={<Settings className="h-5 w-5" />}
          label="设置"
          onClick={() => setShowSettings(true)}
          isActive={false}
        />
      </div>

      {/* 移动端搜索对话框 */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white p-0 max-w-full h-[90vh] sm:max-w-lg">
          <div className="p-4">
            <SemanticSearch />
          </div>
        </DialogContent>
      </Dialog>

      {/* 移动端设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white p-6 max-w-full h-[90vh] sm:max-w-lg">
          <h2 className="text-xl font-medium mb-6">设置</h2>
          <DataManagement />
        </DialogContent>
      </Dialog>
    </>
  )
}

interface NavButtonProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  isActive: boolean
  className?: string
}

function NavButton({ icon, label, onClick, isActive, className }: NavButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col items-center justify-center gap-1 relative",
        isActive && "text-purple-400",
        className,
      )}
      onClick={onClick}
    >
      {icon}
      {label && <span className="text-xs">{label}</span>}
      {isActive && (
        <motion.span
          layoutId="activeIndicator"
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

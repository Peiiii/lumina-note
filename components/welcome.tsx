"use client"

import { Sparkles, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/context/notes-context"
import { useUI } from "@/context/ui-context"
import { useState } from "react"
import { CreateNoteDialog } from "./notes/create-note-dialog"

interface WelcomeProps {
  onComplete?: () => void
}

export function Welcome({ onComplete }: WelcomeProps) {
  const { spaces } = useNotes()
  const { setActiveNote } = useUI()
  const [showCreateNote, setShowCreateNote] = useState(false)

  const handleCreateNote = () => {
    setShowCreateNote(true)
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-md p-6">
        <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center mx-auto mb-6">
          <Sparkles className="h-8 w-8 text-purple-400" />
        </div>
        <h2 className="text-2xl font-light mb-4">欢迎使用 Lumina</h2>
        <p className="text-gray-400 mb-6">这是一个AI增强的笔记应用概念演示。选择左侧的笔记或创建新笔记开始体验。</p>
        <Button className="mx-auto" onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          创建新笔记
        </Button>
      </div>

      <CreateNoteDialog open={showCreateNote} onOpenChange={setShowCreateNote} spaces={spaces} />
    </div>
  )
}

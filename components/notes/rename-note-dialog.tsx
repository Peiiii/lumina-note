"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store/store"
import { useToast } from "@/hooks/use-toast"

interface RenameNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  noteId: string
  currentTitle: string
}

export function RenameNoteDialog({ open, onOpenChange, noteId, currentTitle }: RenameNoteDialogProps) {
  const [title, setTitle] = useState(currentTitle)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { updateNote } = useStore()
  const { toast } = useToast()

  const handleRename = async () => {
    if (!title.trim() || title === currentTitle) {
      onOpenChange(false)
      return
    }

    setIsSubmitting(true)
    try {
      updateNote(noteId, { title })
      toast({
        title: "笔记已重命名",
        description: "笔记标题已成功更新",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "重命名失败",
        description: "无法重命名笔记，请稍后再试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>重命名笔记</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入新的笔记标题"
            className="bg-gray-800 border-gray-700"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename()
              }
            }}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={handleRename} disabled={isSubmitting || !title.trim() || title === currentTitle}>
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

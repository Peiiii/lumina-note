"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotes, type Space } from "@/context/notes-context"
import { useUI } from "@/context/ui-context"

interface CreateNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spaces: Space[]
}

export function CreateNoteDialog({ open, onOpenChange, spaces }: CreateNoteDialogProps) {
  const [title, setTitle] = useState("新笔记")
  const [selectedSpace, setSelectedSpace] = useState<string | undefined>(undefined)
  const { createNote } = useNotes()
  const { setActiveNote } = useUI()

  const handleCreate = () => {
    const noteId = createNote(selectedSpace)
    setActiveNote(noteId)
    onOpenChange(false)
    setTitle("新笔记")
    setSelectedSpace(undefined)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>创建新笔记</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="space">选择空间</Label>
            <Select value={selectedSpace} onValueChange={setSelectedSpace}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="选择空间" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {spaces.map((space) => (
                  <SelectItem key={space.id} value={space.id}>
                    {space.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

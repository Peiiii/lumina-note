"use client"

import { cn } from "@/lib/utils"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useNotes } from "@/context/notes-context"
import { Lightbulb, Clipboard, Book, Briefcase, Code, Coffee, Heart, Music, Star } from "lucide-react"

interface CreateSpaceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSpaceDialog({ open, onOpenChange }: CreateSpaceDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("purple")
  const [icon, setIcon] = useState("lightbulb")
  const { createSpace } = useNotes()

  const colors = [
    { value: "purple", label: "紫色", class: "bg-purple-500" },
    { value: "blue", label: "蓝色", class: "bg-blue-500" },
    { value: "green", label: "绿色", class: "bg-green-500" },
    { value: "yellow", label: "黄色", class: "bg-yellow-500" },
    { value: "red", label: "红色", class: "bg-red-500" },
  ]

  const icons = [
    { value: "lightbulb", label: "灯泡", icon: <Lightbulb className="h-4 w-4" /> },
    { value: "clipboard", label: "剪贴板", icon: <Clipboard className="h-4 w-4" /> },
    { value: "book", label: "书籍", icon: <Book className="h-4 w-4" /> },
    { value: "briefcase", label: "公文包", icon: <Briefcase className="h-4 w-4" /> },
    { value: "code", label: "代码", icon: <Code className="h-4 w-4" /> },
    { value: "coffee", label: "咖啡", icon: <Coffee className="h-4 w-4" /> },
    { value: "heart", label: "心形", icon: <Heart className="h-4 w-4" /> },
    { value: "music", label: "音乐", icon: <Music className="h-4 w-4" /> },
    { value: "star", label: "星星", icon: <Star className="h-4 w-4" /> },
  ]

  const handleCreate = () => {
    if (name.trim()) {
      createSpace(name, color, icon)
      onOpenChange(false)
      setName("")
      setColor("purple")
      setIcon("lightbulb")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>创建新空间</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">空间名称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="输入空间名称"
            />
          </div>

          <div className="space-y-2">
            <Label>选择颜色</Label>
            <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <div key={c.value} className="flex items-center">
                  <RadioGroupItem value={c.value} id={`color-${c.value}`} className="sr-only" />
                  <Label
                    htmlFor={`color-${c.value}`}
                    className={cn(
                      "w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2 border-transparent",
                      color === c.value && "border-white",
                    )}
                  >
                    <div className={cn("w-6 h-6 rounded-full", c.class)} />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>选择图标</Label>
            <RadioGroup value={icon} onValueChange={setIcon} className="flex flex-wrap gap-2">
              {icons.map((i) => (
                <div key={i.value} className="flex items-center">
                  <RadioGroupItem value={i.value} id={`icon-${i.value}`} className="sr-only" />
                  <Label
                    htmlFor={`icon-${i.value}`}
                    className={cn(
                      "w-8 h-8 rounded-md cursor-pointer flex items-center justify-center bg-gray-800",
                      icon === i.value && "bg-gray-700 ring-2 ring-purple-500",
                    )}
                  >
                    {i.icon}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

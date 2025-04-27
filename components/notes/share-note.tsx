"use client"

import { Share2, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/context/notes-context"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ShareNoteProps {
  noteId: string
}

export function ShareNote({ noteId }: ShareNoteProps) {
  const { getNote } = useNotes()
  const note = getNote(noteId)
  const isMobile = useMobile()
  const { toast } = useToast()

  if (!note) return null

  const handleShare = async () => {
    // 检查是否支持原生分享API
    if (navigator.share && isMobile) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
          // 在实际应用中，这里可以是一个指向笔记的URL
          url: window.location.href,
        })
      } catch (error) {
        console.error("分享失败:", error)
      }
    } else {
      // 回退到复制到剪贴板
      handleCopy()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content)
    toast({
      title: "已复制到剪贴板",
      description: "笔记内容已成功复制",
      duration: 2000,
    })
  }

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([note.content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${note.title}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        {isMobile && navigator.share && (
          <DropdownMenuItem className="text-white hover:bg-gray-700" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            分享笔记
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="text-white hover:bg-gray-700" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          复制内容
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-700" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          下载笔记
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

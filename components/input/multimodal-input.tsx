"use client"

import type React from "react"

import { useState } from "react"
import { Mic, ImageIcon, Paperclip, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function MultimodalInput() {
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [attachments, setAttachments] = useState<string[]>([])

  const handleSend = () => {
    if (inputValue.trim() || attachments.length > 0) {
      console.log("Sending:", { text: inputValue, attachments })
      setInputValue("")
      setAttachments([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Here you would implement actual voice recording logic
  }

  const handleImageUpload = () => {
    // Simulate file upload
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In a real app, you would upload the file to a server
        // and get back a URL. Here we're just creating a placeholder.
        const imageUrl = URL.createObjectURL(file)
        setAttachments([...attachments, imageUrl])
      }
    }
    fileInput.click()
  }

  const handleFileUpload = () => {
    // Simulate file upload
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // In a real app, you would upload the file to a server
        // Here we're just adding the filename
        setAttachments([...attachments, `File: ${file.name}`])
      }
    }
    fileInput.click()
  }

  return (
    <div className="border-t p-4">
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative rounded bg-muted p-2 text-xs">
              {attachment.startsWith("File:") ? attachment : "Image"}
              <button
                className="ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入内容或使用语音、图像..."
          className="min-h-[60px] flex-1 resize-none"
          rows={1}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={isRecording ? "bg-red-100 text-red-500" : ""}
                onClick={toggleRecording}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>语音输入</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleImageUpload}>
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>上传图片</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={handleFileUpload}>
                <Paperclip className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>附加文件</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSend}>
                <Send className="mr-2 h-4 w-4" />
                发送
              </Button>
            </TooltipTrigger>
            <TooltipContent>发送</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

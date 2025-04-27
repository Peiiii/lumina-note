"use client"

import { useState } from "react"
import { MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AIChatProps {
  noteId?: string
}

export function AIChat({ noteId }: AIChatProps) {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "我可以帮助你分析笔记内容或回答问题。有什么我可以帮你的吗？" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSendMessage = async () => {
    if (message.trim() && !isProcessing) {
      const userMessage = message
      setMessage("")
      setIsProcessing(true)

      // Add user message to chat
      setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])

      // Simulate AI response
      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { role: "assistant", content: "这是一个演示回复。在实际应用中，这里会调用AI服务来生成回复。" },
        ])
        setIsProcessing(false)
      }, 1000)
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, i) => (
          <div key={i} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className={msg.role === "assistant" ? "bg-purple-900 text-purple-300" : "bg-gray-700"}>
                {msg.role === "assistant" ? "AI" : "你"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`rounded-lg p-3 text-sm max-w-[80%] ${
                msg.role === "assistant" ? "bg-gray-800" : "bg-gray-700"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-800">
        <div className="relative">
          <Input
            placeholder={isProcessing ? "AI正在思考..." : "询问AI助手..."}
            className="pr-10 bg-gray-900 border-gray-700"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isProcessing}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleSendMessage}
            disabled={isProcessing || !message.trim()}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}

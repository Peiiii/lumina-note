"use client"

import { useState, useEffect } from "react"
import { Lightbulb, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUI } from "@/context/ui-context"
import { useNotes } from "@/context/notes-context"

export function AIEditorAssistant() {
  const { activeNote } = useUI()
  const { getNote } = useNotes()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(true)

  // 模拟AI根据当前笔记内容生成建议
  useEffect(() => {
    if (activeNote) {
      const note = getNote(activeNote)
      if (!note) return

      // 在实际应用中，这里会调用AI服务来分析笔记内容并生成建议
      const demoSuggestions = [
        "添加更多关于这个主题的细节",
        "考虑链接到相关的笔记",
        "添加一些关键词标签以便更好地组织",
        "这个段落可以用更简洁的语言表达",
      ]

      // 模拟API调用延迟
      const timer = setTimeout(() => {
        setSuggestions(demoSuggestions)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [activeNote, getNote])

  if (!isVisible || suggestions.length === 0 || !activeNote) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="absolute bottom-4 right-4 opacity-70 hover:opacity-100"
        onClick={() => setIsVisible(true)}
      >
        <Lightbulb className="h-4 w-4 mr-2" />
        AI建议
      </Button>
    )
  }

  return (
    <Card className="absolute bottom-20 right-4 w-80 shadow-lg bg-gray-900 border-gray-800">
      <CardHeader className="py-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">AI写作建议</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="py-2">
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="text-sm">
              <Button variant="ghost" size="sm" className="h-auto justify-start p-2 text-left w-full hover:bg-gray-800">
                {suggestion}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

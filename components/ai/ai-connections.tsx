"use client"

import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAI } from "@/context/ai-context"
import { useUI } from "@/context/ui-context"
import { useNotes } from "@/context/notes-context"

interface AIConnectionsProps {
  noteId: string
}

export function AIConnections({ noteId }: AIConnectionsProps) {
  const { getAIConnections } = useAI()
  const { setActiveNote } = useUI()
  const { notes } = useNotes()
  const connections = getAIConnections(noteId)

  // 查找与连接名称匹配的笔记
  const findNoteByTitle = (title: string) => {
    return notes.find((note) => note.title.includes(title))
  }

  // 处理点击连接
  const handleConnectionClick = (connection: string) => {
    const note = findNoteByTitle(connection)
    if (note) {
      setActiveNote(note.id)
    }
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">知识连接</h4>
      <div className="relative p-4 bg-gray-900 rounded-lg min-h-[300px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-purple-900/30 flex items-center justify-center">
            <div className="h-8 w-8 text-purple-400 font-bold text-xl">
              {notes.find((note) => note.id === noteId)?.title.charAt(0) || "A"}
            </div>
          </div>
          <div className="absolute">
            {connections.map((connection, i) => (
              <div
                key={i}
                className="absolute flex items-center"
                style={{
                  transform: `rotate(${i * 120}deg) translateX(100px)`,
                  transformOrigin: "center",
                }}
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <div className="w-16 h-0.5 bg-purple-400/50"></div>
                <div
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer"
                  onClick={() => handleConnectionClick(connection)}
                >
                  <div className="h-4 w-4 text-gray-400 font-bold">{connection.charAt(0)}</div>
                </div>
                <div
                  className="absolute whitespace-nowrap text-xs bg-gray-800 px-2 py-1 rounded cursor-pointer"
                  style={{
                    transform: `rotate(${-i * 120}deg) translateX(30px)`,
                    transformOrigin: "left center",
                  }}
                  onClick={() => handleConnectionClick(connection)}
                >
                  {connection}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-3 bg-gray-800/50 rounded-lg">
        <h4 className="text-sm font-medium mb-2">相关笔记</h4>
        <ul className="space-y-2 text-sm">
          {connections.map((connection, i) => (
            <li key={i} className="flex items-center justify-between">
              <span>{connection}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => handleConnectionClick(connection)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

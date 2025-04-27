"use client"

import type React from "react"

import { useState } from "react"
import { ChevronRight, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Space } from "@/context/notes-context"
import { useNotes } from "@/context/notes-context"
import { useUI } from "@/context/ui-context"

interface SpacesListProps {
  spaces: Space[]
  iconMap: Record<string, React.ReactNode>
}

export function SpacesList({ spaces, iconMap }: SpacesListProps) {
  const { getNotesBySpace } = useNotes()
  const { setActiveNote } = useUI()
  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>({})

  const toggleExpand = (spaceId: string) => {
    setExpandedSpaces((prev) => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }))
  }

  const getSpaceColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      purple: "bg-purple-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
    }
    return colorMap[color] || "bg-gray-500"
  }

  return (
    <div className="space-y-1">
      {spaces.map((space) => {
        const notes = getNotesBySpace(space.id)
        const isExpanded = expandedSpaces[space.id]

        return (
          <div key={space.id} className="space-y-1">
            <div
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
              onClick={() => toggleExpand(space.id)}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn("w-5 h-5 rounded-md flex items-center justify-center", getSpaceColorClass(space.color))}
                >
                  {iconMap[space.icon] || <FolderOpen className="h-3 w-3 text-white" />}
                </div>
                <span>{space.name}</span>
                <span className="text-xs text-gray-500">({notes.length})</span>
              </div>
              <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "transform rotate-90")} />
            </div>

            {isExpanded && notes.length > 0 && (
              <div className="ml-7 border-l border-gray-800 pl-2 space-y-1">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2 text-sm hover:bg-gray-800 rounded-md cursor-pointer"
                    onClick={() => setActiveNote(note.id)}
                  >
                    {note.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

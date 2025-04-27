"use client"

import { useState } from "react"
import { ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotes } from "@/context/notes-context"

export function AdvancedKnowledgeGraph() {
  const { notes } = useNotes()
  const [zoom, setZoom] = useState(1)

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium">知识图谱</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(zoom + 0.1, 2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <p className="mb-2">知识图谱功能即将推出</p>
          <p className="text-sm">将可视化您的笔记之间的关联</p>
        </div>
      </div>
    </div>
  )
}

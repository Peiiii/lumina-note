"use client"

import React from "react"

import { useEffect, useRef } from "react"
import { useUI } from "@/context/ui-context"
import type { Note, Space } from "@/context/notes-context"
import ForceGraph2D from "react-force-graph-2d"

interface KnowledgeGraphProps {
  notes: Note[]
  spaces: Space[]
}

interface GraphNode {
  id: string
  name: string
  type: "note" | "space" | "tag"
  val: number
  color: string
}

interface GraphLink {
  source: string
  target: string
  value: number
}

export function KnowledgeGraph({ notes, spaces }: KnowledgeGraphProps) {
  const { setActiveNote } = useUI()
  const graphRef = useRef<any>(null)

  // 构建图谱数据
  const graphData = React.useMemo(() => {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []
    const tags = new Set<string>()

    // 添加空间节点
    spaces.forEach((space) => {
      nodes.push({
        id: space.id,
        name: space.name,
        type: "space",
        val: 10,
        color: getSpaceColor(space.color),
      })
    })

    // 添加笔记节点和链接
    notes.forEach((note) => {
      nodes.push({
        id: note.id,
        name: note.title,
        type: "note",
        val: 5,
        color: note.starred ? "#FFD700" : "#6366f1",
      })

      // 笔记与空间的链接
      if (note.spaceId) {
        links.push({
          source: note.id,
          target: note.spaceId,
          value: 1,
        })
      }

      // 收集所有标签
      note.tags.forEach((tag) => {
        tags.add(tag)
      })
    })

    // 添加标签节点
    Array.from(tags).forEach((tag) => {
      const tagId = `tag-${tag}`
      nodes.push({
        id: tagId,
        name: tag,
        type: "tag",
        val: 3,
        color: "#10B981",
      })

      // 将标签与笔记连接
      notes.forEach((note) => {
        if (note.tags.includes(tag)) {
          links.push({
            source: note.id,
            target: tagId,
            value: 1,
          })
        }
      })
    })

    // 添加笔记之间的关联（基于内容相似性的模拟）
    for (let i = 0; i < notes.length; i++) {
      for (let j = i + 1; j < notes.length; j++) {
        // 简单模拟：如果两个笔记有相同的标签，则建立连接
        const commonTags = notes[i].tags.filter((tag) => notes[j].tags.includes(tag))
        if (commonTags.length > 0) {
          links.push({
            source: notes[i].id,
            target: notes[j].id,
            value: commonTags.length,
          })
        }
      }
    }

    return { nodes, links }
  }, [notes, spaces])

  // 获取空间颜色
  function getSpaceColor(color: string): string {
    const colorMap: Record<string, string> = {
      purple: "#8B5CF6",
      blue: "#3B82F6",
      green: "#10B981",
      yellow: "#F59E0B",
      red: "#EF4444",
    }
    return colorMap[color] || "#6B7280"
  }

  // 调整图谱大小
  useEffect(() => {
    const handleResize = () => {
      if (graphRef.current) {
        graphRef.current.zoomToFit(400)
      }
    }

    window.addEventListener("resize", handleResize)
    // 初始化时调整一次
    setTimeout(handleResize, 300)

    return () => window.removeEventListener("resize", handleResize)
  }, [graphData])

  return (
    <div className="h-full w-full bg-gray-900 rounded-lg overflow-hidden">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="name"
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => node.val}
        linkWidth={(link: any) => link.value * 0.5}
        linkColor={() => "#ffffff30"}
        onNodeClick={(node: any) => {
          if (node.type === "note") {
            setActiveNote(node.id)
          }
        }}
        cooldownTicks={100}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400)
          }
        }}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const label = node.name
          const fontSize = 12 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`
          const textWidth = ctx.measureText(label).width
          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.8)

          ctx.fillStyle = node.color
          ctx.beginPath()
          ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI)
          ctx.fill()

          ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y + node.val + 2, bckgDimensions[0], bckgDimensions[1])

          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillStyle = "#fff"
          ctx.fillText(label, node.x, node.y + node.val + 2 + bckgDimensions[1] / 2)
        }}
      />
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { useUI } from "@/context/ui-context"
import type { Note, Space } from "@/context/notes-context"
import ForceGraph3D from "react-force-graph-3d"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, RotateCcw, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import SpriteText from "three-spritetext"

interface EnhancedKnowledgeGraphProps {
  notes: Note[]
  spaces: Space[]
}

interface GraphNode {
  id: string
  name: string
  type: "note" | "space" | "tag" | "topic"
  val: number
  color: string
  group?: string
}

interface GraphLink {
  source: string
  target: string
  value: number
  type?: string
}

export function EnhancedKnowledgeGraph({ notes, spaces }: EnhancedKnowledgeGraphProps) {
  const { setActiveNote } = useUI()
  const graphRef = useRef<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [linkStrength, setLinkStrength] = useState([0.7])
  const [nodeSize, setNodeSize] = useState([1])
  const [show3D, setShow3D] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [highlightNodes, setHighlightNodes] = useState(new Set())
  const [highlightLinks, setHighlightLinks] = useState(new Set())
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null)

  // 构建图谱数据
  const graphData = useMemo(() => {
    const nodes: GraphNode[] = []
    const links: GraphLink[] = []
    const tags = new Set<string>()
    const topics = new Set<string>()

    // 添加空间节点
    spaces.forEach((space) => {
      nodes.push({
        id: space.id,
        name: space.name,
        type: "space",
        val: 15,
        color: getSpaceColor(space.color),
        group: "spaces",
      })
    })

    // 添加笔记节点和链接
    notes.forEach((note) => {
      nodes.push({
        id: note.id,
        name: note.title,
        type: "note",
        val: note.starred ? 10 : 7,
        color: note.starred ? "#FFD700" : "#6366f1",
        group: "notes",
      })

      // 笔记与空间的链接
      if (note.spaceId) {
        links.push({
          source: note.id,
          target: note.spaceId,
          value: 2,
          type: "note-space",
        })
      }

      // 收集所有标签
      note.tags.forEach((tag) => {
        tags.add(tag)
      })

      // 从内容中提取主题（模拟）
      const extractedTopics = extractTopicsFromContent(note.content)
      extractedTopics.forEach((topic) => topics.add(topic))
    })

    // 添加标签节点
    Array.from(tags).forEach((tag) => {
      const tagId = `tag-${tag}`
      nodes.push({
        id: tagId,
        name: tag,
        type: "tag",
        val: 5,
        color: "#10B981",
        group: "tags",
      })

      // 将标签与笔记连接
      notes.forEach((note) => {
        if (note.tags.includes(tag)) {
          links.push({
            source: note.id,
            target: tagId,
            value: 1,
            type: "note-tag",
          })
        }
      })
    })

    // 添加主题节点
    Array.from(topics).forEach((topic) => {
      const topicId = `topic-${topic}`
      nodes.push({
        id: topicId,
        name: topic,
        type: "topic",
        val: 6,
        color: "#F472B6",
        group: "topics",
      })

      // 将主题与笔记连接
      notes.forEach((note) => {
        if (note.content.toLowerCase().includes(topic.toLowerCase())) {
          links.push({
            source: note.id,
            target: topicId,
            value: 1,
            type: "note-topic",
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
            type: "note-note",
          })
        }
      }
    }

    // 应用搜索过滤
    if (searchTerm) {
      const filteredNodeIds = new Set(
        nodes.filter((node) => node.name.toLowerCase().includes(searchTerm.toLowerCase())).map((node) => node.id),
      )

      // 添加与过滤节点相连的节点
      links.forEach((link) => {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source
        const targetId = typeof link.target === "object" ? link.target.id : link.target

        if (filteredNodeIds.has(sourceId)) filteredNodeIds.add(targetId)
        if (filteredNodeIds.has(targetId)) filteredNodeIds.add(sourceId)
      })

      return {
        nodes: nodes.filter((node) => filteredNodeIds.has(node.id)),
        links: links.filter((link) => {
          const sourceId = typeof link.source === "object" ? link.source.id : link.source
          const targetId = typeof link.target === "object" ? link.target.id : link.target
          return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId)
        }),
      }
    }

    // 应用类型过滤
    if (filterType) {
      const filteredNodes = nodes.filter((node) => filterType === "all" || node.group === filterType)

      const filteredNodeIds = new Set(filteredNodes.map((node) => node.id))

      return {
        nodes: filteredNodes,
        links: links.filter((link) => {
          const sourceId = typeof link.source === "object" ? link.source.id : link.source
          const targetId = typeof link.target === "object" ? link.target.id : link.target
          return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId)
        }),
      }
    }

    return { nodes, links }
  }, [notes, spaces, searchTerm, filterType])

  // 模拟从内容中提取主题
  function extractTopicsFromContent(content: string): string[] {
    const topics = []
    if (content.toLowerCase().includes("用户")) topics.push("用户体验")
    if (content.toLowerCase().includes("设计")) topics.push("设计思维")
    if (content.toLowerCase().includes("ai") || content.toLowerCase().includes("人工智能")) topics.push("人工智能")
    if (content.toLowerCase().includes("创新")) topics.push("创新")
    if (content.toLowerCase().includes("项目")) topics.push("项目管理")
    if (content.toLowerCase().includes("团队")) topics.push("团队协作")
    return topics
  }

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

  // 处理节点点击
  const handleNodeClick = (node: GraphNode) => {
    if (node.type === "note") {
      setActiveNote(node.id)
    }
  }

  // 处理节点悬停
  const handleNodeHover = (node: GraphNode | null) => {
    setHoverNode(node)

    // 清除之前的高亮
    setHighlightNodes(new Set())
    setHighlightLinks(new Set())

    if (node) {
      setHighlightNodes(new Set([node.id]))

      // 高亮与该节点相连的链接和节点
      graphData.links.forEach((link: any) => {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source
        const targetId = typeof link.target === "object" ? link.target.id : link.target

        if (sourceId === node.id || targetId === node.id) {
          setHighlightLinks((prev) => new Set([...prev, link]))
          setHighlightNodes((prev) => new Set([...prev, sourceId, targetId]))
        }
      })
    }
  }

  // 重置视图
  const resetView = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400)
    }
  }

  // 放大
  const zoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.2)
    }
  }

  // 缩小
  const zoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.2)
    }
  }

  // 自定义节点渲染
  const nodeThreeObject = (node: GraphNode) => {
    if (!showLabels) return null

    const sprite = new SpriteText(node.name)
    sprite.color = node.color
    sprite.textHeight = 3
    sprite.backgroundColor = "rgba(0,0,0,0.7)"
    sprite.padding = 2
    sprite.borderRadius = 3
    return sprite
  }

  // 自定义节点材质
  const nodeThreeObjectExtend = true

  // 自定义节点渲染
  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name
    const fontSize = 12 / globalScale
    ctx.font = `${fontSize}px Sans-Serif`

    // 绘制节点
    ctx.beginPath()
    ctx.arc(node.x, node.y, node.val * nodeSize[0], 0, 2 * Math.PI)
    ctx.fillStyle = node.color
    ctx.fill()

    // 如果节点被高亮，绘制边框
    if (highlightNodes.has(node.id)) {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2 / globalScale
      ctx.stroke()
    }

    // 如果启用标签，绘制标签
    if (showLabels) {
      const textWidth = ctx.measureText(label).width
      const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.8)

      ctx.fillStyle = "rgba(0, 0, 0, 0.6)"
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y + node.val * nodeSize[0] + 2,
        bckgDimensions[0],
        bckgDimensions[1],
      )

      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillStyle = "#fff"
      ctx.fillText(label, node.x, node.y + node.val * nodeSize[0] + 2 + bckgDimensions[1] / 2)
    }
  }

  // 自定义链接渲染
  const linkCanvasObject = (link: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // 获取源节点和目标节点
    const sourcePos = link.source
    const targetPos = link.target

    // 如果链接被高亮，使用不同的样式
    if (highlightLinks.has(link)) {
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2 / globalScale
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 1 / globalScale
    }

    // 绘制链接
    ctx.beginPath()
    ctx.moveTo(sourcePos.x, sourcePos.y)
    ctx.lineTo(targetPos.x, targetPos.y)
    ctx.stroke()
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="p-2 border-b border-gray-800 flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={resetView} className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            placeholder="搜索节点..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 w-40 bg-gray-800 border-gray-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterType || "all"} onValueChange={setFilterType}>
            <SelectTrigger className="h-8 w-32 bg-gray-800 border-gray-700">
              <SelectValue placeholder="筛选类型" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="notes">笔记</SelectItem>
              <SelectItem value="spaces">空间</SelectItem>
              <SelectItem value="tags">标签</SelectItem>
              <SelectItem value="topics">主题</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-2">
            <Label htmlFor="show-labels" className="text-xs">
              显示标签
            </Label>
            <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="show-3d" className="text-xs">
              3D 视图
            </Label>
            <Switch id="show-3d" checked={show3D} onCheckedChange={setShow3D} />
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {show3D ? (
          <ForceGraph3D
            ref={graphRef}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={(node: any) => node.color}
            nodeVal={(node: any) => node.val * nodeSize[0]}
            linkWidth={(link: any) => link.value * 0.5}
            linkColor={() => "rgba(255, 255, 255, 0.2)"}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            nodeThreeObject={nodeThreeObject}
            nodeThreeObjectExtend={nodeThreeObjectExtend}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.005}
            cooldownTicks={100}
            onEngineStop={() => {
              graphRef.current?.zoomToFit(400)
            }}
            backgroundColor="#111111"
          />
        ) : (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeCanvasObject={nodeCanvasObject}
            linkCanvasObject={linkCanvasObject}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            cooldownTicks={100}
            onEngineStop={() => {
              graphRef.current?.zoomToFit(400)
            }}
            linkDirectionalParticles={2}
            linkDirectionalParticleWidth={2}
            linkDirectionalParticleSpeed={0.005}
            d3AlphaDecay={0.02}
            d3VelocityDecay={0.3}
            backgroundColor="#111111"
          />
        )}

        {hoverNode && (
          <div className="absolute bottom-4 left-4 bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hoverNode.color }}></div>
              <span className="font-medium">{hoverNode.name}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              类型:{" "}
              {hoverNode.type === "note"
                ? "笔记"
                : hoverNode.type === "space"
                  ? "空间"
                  : hoverNode.type === "tag"
                    ? "标签"
                    : "主题"}
            </div>
            <div className="text-xs text-gray-400">连接: {Array.from(highlightLinks).length}</div>
          </div>
        )}
      </div>

      <div className="p-2 border-t border-gray-800 flex items-center gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <Label>链接强度</Label>
            <span className="text-gray-400">{Math.round(linkStrength[0] * 100)}%</span>
          </div>
          <Slider
            value={linkStrength}
            onValueChange={(value) => {
              setLinkStrength(value)
              if (graphRef.current) {
                graphRef.current.d3Force("link").strength(value[0] * 0.1)
              }
            }}
            min={0.1}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs">
            <Label>节点大小</Label>
            <span className="text-gray-400">{Math.round(nodeSize[0] * 100)}%</span>
          </div>
          <Slider value={nodeSize} onValueChange={setNodeSize} min={0.5} max={2} step={0.1} className="w-full" />
        </div>
      </div>

      <div className="p-2 border-t border-gray-800 flex flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-xs text-gray-400">笔记</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-400">空间</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-400">标签</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span className="text-xs text-gray-400">主题</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-400">星标</span>
        </div>
      </div>
    </div>
  )
}

function ForceGraph2D(props: any) {
  // 这是一个占位符组件，实际应用中需要导入 react-force-graph-2d
  return (
    <div className="w-full h-full flex items-center justify-center">
      <p className="text-gray-400">2D 图谱视图</p>
    </div>
  )
}

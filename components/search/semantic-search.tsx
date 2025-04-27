"use client"

import { useState, useEffect } from "react"
import { Search, Filter, X, Tag, Star, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useNotes } from "@/context/notes-context"
import { useUI } from "@/context/ui-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SearchResult {
  id: string
  title: string
  content: string
  preview: string
  date: string
  tags: string[]
  starred: boolean
  relevance: number
  matchType: "semantic" | "keyword" | "tag"
  matchContext?: string
}

export function SemanticSearch() {
  const { notes } = useNotes()
  const { setActiveNote } = useUI()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    onlyStarred: false,
    tags: [] as string[],
    timeRange: "all" as "all" | "today" | "week" | "month",
  })

  // 收集所有可用的标签
  const allTags = Array.from(new Set(notes.flatMap((note) => note.tags)))

  // 处理搜索
  const handleSearch = () => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)

    // 模拟搜索延迟
    setTimeout(() => {
      // 简单的关键词匹配
      const keywordResults = notes
        .filter((note) => {
          // 应用过滤器
          if (filters.onlyStarred && !note.starred) return false
          if (filters.tags.length > 0 && !filters.tags.some((tag) => note.tags.includes(tag))) return false

          // 时间范围过滤
          if (filters.timeRange !== "all") {
            const noteDate = new Date() // 模拟日期，实际应从note.date解析
            const now = new Date()

            if (filters.timeRange === "today") {
              if (noteDate.getDate() !== now.getDate()) return false
            } else if (filters.timeRange === "week") {
              const weekAgo = new Date()
              weekAgo.setDate(now.getDate() - 7)
              if (noteDate < weekAgo) return false
            } else if (filters.timeRange === "month") {
              const monthAgo = new Date()
              monthAgo.setMonth(now.getMonth() - 1)
              if (noteDate < monthAgo) return false
            }
          }

          return (
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase()) ||
            note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
          )
        })
        .map((note) => {
          // 确定匹配类型和上下文
          let matchType: "semantic" | "keyword" | "tag" = "keyword"
          let matchContext = ""
          let relevance = 0

          if (note.title.toLowerCase().includes(query.toLowerCase())) {
            matchType = "keyword"
            relevance = 0.9
            matchContext = highlightMatch(note.title, query)
          } else if (note.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))) {
            matchType = "tag"
            relevance = 0.8
            matchContext = note.tags.filter((tag) => tag.toLowerCase().includes(query.toLowerCase())).join(", ")
          } else {
            matchType = "keyword"
            relevance = 0.7

            // 查找匹配上下文
            const lowerContent = note.content.toLowerCase()
            const queryIndex = lowerContent.indexOf(query.toLowerCase())
            if (queryIndex >= 0) {
              const start = Math.max(0, queryIndex - 40)
              const end = Math.min(note.content.length, queryIndex + query.length + 40)
              matchContext = "..." + highlightMatch(note.content.substring(start, end), query) + "..."
            } else {
              matchContext = note.preview
            }
          }

          return {
            ...note,
            relevance,
            matchType,
            matchContext,
          }
        })

      // 模拟语义搜索结果
      const semanticResults: SearchResult[] = []
      if (query.toLowerCase().includes("设计") || query.toLowerCase().includes("用户")) {
        const designNotes = notes.filter(
          (note) => note.content.toLowerCase().includes("设计") || note.content.toLowerCase().includes("用户"),
        )

        designNotes.forEach((note) => {
          if (!keywordResults.some((r) => r.id === note.id)) {
            semanticResults.push({
              ...note,
              relevance: 0.6,
              matchType: "semantic",
              matchContext: "基于语义相关性匹配",
            })
          }
        })
      }

      // 合并结果并按相关性排序
      const combinedResults = [...keywordResults, ...semanticResults].sort((a, b) => b.relevance - a.relevance)

      setResults(combinedResults)
      setIsSearching(false)
    }, 500)
  }

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string): string => {
    const regex = new RegExp(`(${query})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-500/30 text-white">$1</mark>')
  }

  // 处理标签过滤器变化
  const handleTagFilterChange = (tag: string) => {
    setFilters((prev) => {
      const newTags = prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag]
      return { ...prev, tags: newTags }
    })
  }

  // 重置过滤器
  const resetFilters = () => {
    setFilters({
      onlyStarred: false,
      tags: [],
      timeRange: "all",
    })
  }

  // 当查询变化时，执行搜索
  useEffect(() => {
    if (isOpen && query.trim()) {
      handleSearch()
    }
  }, [filters, isOpen])

  // 处理结果点击
  const handleResultClick = (noteId: string) => {
    setActiveNote(noteId)
    setIsOpen(false)
  }

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="搜索笔记..."
          className="pl-9 bg-gray-900 border-gray-700"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsOpen(true)
              handleSearch()
            }
          }}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-gray-800">
            <DialogTitle className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="搜索笔记..."
                  className="pl-9 pr-24 bg-gray-800 border-gray-700"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                />
                <div className="absolute right-2 top-1.5 flex items-center gap-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-gray-800 border-gray-700 p-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">筛选条件</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="starred"
                                checked={filters.onlyStarred}
                                onCheckedChange={(checked) =>
                                  setFilters((prev) => ({ ...prev, onlyStarred: checked === true }))
                                }
                              />
                              <Label htmlFor="starred" className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400" /> 仅显示星标笔记
                              </Label>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        <div>
                          <h4 className="font-medium mb-2">时间范围</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="time-all"
                                checked={filters.timeRange === "all"}
                                onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "all" }))}
                              />
                              <Label htmlFor="time-all">所有时间</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="time-today"
                                checked={filters.timeRange === "today"}
                                onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "today" }))}
                              />
                              <Label htmlFor="time-today">今天</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="time-week"
                                checked={filters.timeRange === "week"}
                                onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "week" }))}
                              />
                              <Label htmlFor="time-week">本周</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="time-month"
                                checked={filters.timeRange === "month"}
                                onCheckedChange={() => setFilters((prev) => ({ ...prev, timeRange: "month" }))}
                              />
                              <Label htmlFor="time-month">本月</Label>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-gray-700" />

                        <div>
                          <h4 className="font-medium mb-2">标签</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                            {allTags.map((tag) => (
                              <div key={tag} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`tag-${tag}`}
                                  checked={filters.tags.includes(tag)}
                                  onCheckedChange={() => handleTagFilterChange(tag)}
                                />
                                <Label htmlFor={`tag-${tag}`} className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" /> {tag}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between pt-2">
                          <Button variant="outline" size="sm" onClick={resetFilters}>
                            重置
                          </Button>
                          <Button size="sm" onClick={handleSearch}>
                            应用筛选
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Button variant="default" size="sm" className="h-7" onClick={handleSearch}>
                    搜索
                  </Button>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-8 h-8 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-400">正在搜索...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>找到 {results.length} 个结果</span>
                  <div className="flex gap-2">
                    {filters.onlyStarred && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> 星标
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => setFilters((prev) => ({ ...prev, onlyStarred: false }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {filters.timeRange !== "all" && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {filters.timeRange === "today" ? "今天" : filters.timeRange === "week" ? "本周" : "本月"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => setFilters((prev) => ({ ...prev, timeRange: "all" }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    )}

                    {filters.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" /> {tag}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => handleTagFilterChange(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg border border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{result.title}</h3>
                      <div className="flex items-center gap-2">
                        {result.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                        <Badge
                          variant={result.matchType === "semantic" ? "outline" : "default"}
                          className={
                            result.matchType === "semantic"
                              ? "bg-purple-900/30 text-purple-300 border-purple-800"
                              : result.matchType === "tag"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-blue-900/30 text-blue-300"
                          }
                        >
                          {result.matchType === "semantic"
                            ? "语义匹配"
                            : result.matchType === "tag"
                              ? "标签匹配"
                              : "关键词匹配"}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {result.tags.map((tag) => (
                        <span key={tag} className="mr-2">
                          #{tag}
                        </span>
                      ))}
                      <span className="ml-2">{result.date}</span>
                    </div>
                    <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: result.matchContext }} />
                  </div>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-400">未找到匹配结果</p>
                <p className="text-sm text-gray-500 mt-2">尝试使用不同的关键词或清除筛选条件</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-400">输入关键词开始搜索</p>
                <p className="text-sm text-gray-500 mt-2">支持标题、内容和标签搜索</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

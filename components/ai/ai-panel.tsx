"use client"

import { useState, useEffect } from "react"
import { Brain, Zap, FileText, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AIService } from "@/lib/services/ai-service"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store/store"

interface AIPanelProps {
  noteId?: string
  isOpen?: boolean
}

export function AIPanel({ noteId, isOpen = false }: AIPanelProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [topics, setTopics] = useState<{ name: string; percentage: number; color: string }[]>([])
  const [resources, setResources] = useState<{ title: string; url: string; relevance: number }[]>([])
  const [loading, setLoading] = useState(true)
  const { getNote } = useStore()
  const note = noteId ? getNote(noteId) : null

  // 加载 AI 数据
  useEffect(() => {
    if (!noteId || !note) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      setLoading(true)
      try {
        // 并行请求数据
        const [suggestionsData, topicsData, resourcesData] = await Promise.all([
          AIService.getSuggestions(noteId, note.content),
          AIService.getTopics(noteId, note.content),
          AIService.getResources(noteId, note.content),
        ])

        setSuggestions(suggestionsData)
        setTopics(topicsData)
        setResources(resourcesData)
      } catch (error) {
        console.error("Error fetching AI data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [noteId, note])

  // If no noteId is provided, show a placeholder
  if (!noteId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>选择笔记以获取AI洞见</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h3 className="font-medium flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-400" />
          AI 助手
        </h3>
      </div>

      <Tabs defaultValue="insights" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 bg-gray-900">
          <TabsTrigger value="insights" className="flex-1">
            洞见
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex-1">
            关联
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">
            对话
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-2" />
              <p className="text-sm text-gray-400">分析笔记内容中...</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.1 }} className="w-full">
              <motion.div
                className="p-3 bg-purple-900/20 rounded-lg w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="text-sm font-medium mb-2 text-purple-300">建议改进</h4>
                <ul className="space-y-2">
                  {suggestions.map((suggestion, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start gap-2 text-sm break-words"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Zap className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                      <span className="min-w-0">{suggestion}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="p-3 bg-gray-800/50 rounded-lg mt-3 w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h4 className="text-sm font-medium mb-2">主题分析</h4>
                <div className="space-y-2">
                  {topics.map((topic, i) => (
                    <motion.div
                      key={i}
                      className="flex justify-between items-center text-sm w-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    >
                      <span className="truncate mr-2">{topic.name}</span>
                      <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden shrink-0">
                        <motion.div
                          className="h-full"
                          style={{
                            backgroundColor: `var(--${topic.color}-500, #6366f1)`,
                          }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${topic.percentage}%` }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.7 }}
                        ></motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="p-3 bg-gray-800/50 rounded-lg mt-3 w-full"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h4 className="text-sm font-medium mb-2">相关资源</h4>
                <ul className="space-y-2 text-sm">
                  {resources.map((resource, i) => (
                    <motion.li
                      key={i}
                      className="flex items-center gap-2 break-words"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <FileText className="h-4 w-4 text-blue-400 shrink-0" />
                      <span className="text-blue-400 underline truncate">{resource.title}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>知识关联功能即将推出</p>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>AI对话功能即将推出</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

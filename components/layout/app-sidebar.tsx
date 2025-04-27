"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, Calendar, Tag, Settings, Lightbulb, Clipboard, Book, PlusCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store/store"
import { NotesList } from "@/components/notes/notes-list"
import { SpacesList } from "@/components/spaces/spaces-list"
import { KnowledgeGraph } from "@/components/knowledge/knowledge-graph"
import { CreateNoteDialog } from "@/components/notes/create-note-dialog"
import { CreateSpaceDialog } from "@/components/spaces/create-space-dialog"
import { useDeviceDetect } from "@/lib/utils/mobile-utils"

export function AppSidebar() {
  const { sidebarOpen, setSidebarOpen, notes, spaces, activeTab, setActiveTab } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateNote, setShowCreateNote] = useState(false)
  const [showCreateSpace, setShowCreateSpace] = useState(false)
  const { isMobile } = useDeviceDetect()

  // 防止滚动穿透
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobile, sidebarOpen])

  // 图标映射
  const iconMap: Record<string, React.ReactNode> = {
    lightbulb: <Lightbulb className="h-4 w-4" />,
    clipboard: <Clipboard className="h-4 w-4" />,
    book: <Book className="h-4 w-4" />,
  }

  if (!sidebarOpen) return null

  return (
    <>
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <>
            {/* 移动端背景遮罩 */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-20"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <motion.div
              initial={{ x: isMobile ? "-100%" : 0, opacity: isMobile ? 1 : 0, width: isMobile ? "85%" : 0 }}
              animate={{ x: 0, opacity: 1, width: isMobile ? "85%" : 280 }}
              exit={{ x: isMobile ? "-100%" : 0, opacity: isMobile ? 1 : 0, width: isMobile ? "85%" : 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`${isMobile ? "fixed inset-y-0 left-0 z-30 bg-gray-950" : "border-r border-gray-800"} flex flex-col`}
            >
              <div className="p-4 flex items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="搜索笔记..."
                    className="pl-9 bg-gray-900 border-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {isMobile && (
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="ml-2">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="px-2">
                <Button
                  className="w-full justify-start gap-2 mb-2"
                  variant="default"
                  onClick={() => setShowCreateNote(true)}
                >
                  <Plus className="h-4 w-4" />
                  新建笔记
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="mx-2 bg-gray-900">
                  <TabsTrigger value="notes" className="flex-1">
                    笔记
                  </TabsTrigger>
                  <TabsTrigger value="spaces" className="flex-1">
                    空间
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="flex-1">
                    知识图谱
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="flex-1 overflow-y-auto p-2 space-y-2">
                  <NotesList
                    notes={notes.filter((note) =>
                      searchQuery
                        ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase())
                        : true,
                    )}
                  />
                </TabsContent>

                <TabsContent value="spaces" className="flex-1 overflow-y-auto p-2 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium text-gray-400">我的空间</h3>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setShowCreateSpace(true)}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <SpacesList spaces={spaces} iconMap={iconMap} />
                </TabsContent>

                <TabsContent value="graph" className="flex-1 p-2">
                  <KnowledgeGraph notes={notes} spaces={spaces} />
                </TabsContent>
              </Tabs>

              {!isMobile && (
                <div className="p-2 border-t border-gray-800">
                  <div className="flex justify-between">
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      日历
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Tag className="h-4 w-4 mr-2" />
                      标签
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <Settings className="h-4 w-4 mr-2" />
                      设置
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateNoteDialog open={showCreateNote} onOpenChange={setShowCreateNote} spaces={spaces} />

      <CreateSpaceDialog open={showCreateSpace} onOpenChange={setShowCreateSpace} />
    </>
  )
}

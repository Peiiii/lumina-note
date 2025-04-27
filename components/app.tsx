"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "./layout/app-header"
import { AppSidebar } from "./layout/app-sidebar"
import { NoteEditor } from "./notes/note-editor"
import { Welcome } from "./welcome"
import { AIPanel } from "./ai/ai-panel"
import { GlobalAIDialog } from "./ai/global-ai-dialog"
import { AdvancedKnowledgeGraph } from "./knowledge/advanced-knowledge-graph"
import { CollaborationPanel } from "./collaboration/collaboration-panel"
import { MobileNav } from "./layout/mobile-nav"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Brain, Network, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store/store"
import { useDeviceDetect, useSwipeGesture } from "@/lib/utils/mobile-utils"
import { KeyboardShortcuts } from "./shortcuts/keyboard-shortcuts"
import { OfflineSupport } from "./sync/offline-support"
import { ErrorBoundary } from "./error-boundary"
import { Toaster } from "./ui/toaster"
import type { RightPanelType } from "@/types"

export function App() {
  const { activeNoteId, sidebarOpen, showAIPanel, setShowAIPanel, setSidebarOpen, setActiveNote } = useStore()

  const [showGlobalAI, setShowGlobalAI] = useState(false)
  const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>("ai")
  const [showRightPanel, setShowRightPanel] = useState(false)
  const [rightPanelWidth, setRightPanelWidth] = useState(320) // 默认宽度
  const { isMobile } = useDeviceDetect()

  // 在移动设备上，如果侧边栏打开，则隐藏右侧面板
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      setShowRightPanel(false)
    }
  }, [isMobile, sidebarOpen])

  // 在移动设备上，当选择笔记时自动关闭侧边栏
  useEffect(() => {
    if (isMobile && activeNoteId) {
      setSidebarOpen(false)
    }
  }, [activeNoteId, isMobile, setSidebarOpen])

  // 添加滑动手势支持
  useSwipeGesture({
    onSwipeRight: () => {
      if (isMobile && !sidebarOpen && !showRightPanel) {
        setSidebarOpen(true)
      }
    },
    onSwipeLeft: () => {
      if (isMobile && !showRightPanel && activeNoteId) {
        setShowRightPanel(true)
        setActiveRightPanel("ai")
      }
    },
  })

  const handleShowGlobalAI = () => {
    setShowGlobalAI(true)
  }

  const handleToggleAIPanel = () => {
    if (isMobile) {
      setShowRightPanel(!showRightPanel)
      setActiveRightPanel("ai")
    } else {
      setShowAIPanel(!showAIPanel)
    }
  }

  // 渲染右侧面板
  const renderRightPanel = () => {
    switch (activeRightPanel) {
      case "ai":
        return activeNoteId ? <AIPanel noteId={activeNoteId} isOpen={true} /> : null
      case "graph":
        return <AdvancedKnowledgeGraph />
      case "collab":
        return activeNoteId ? <CollaborationPanel noteId={activeNoteId} /> : null
      default:
        return null
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen w-full overflow-hidden bg-gray-950 text-white">
        <AppSidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <AppHeader onShowGlobalAI={handleShowGlobalAI} />

          <div className="flex-1 flex overflow-hidden relative">
            {/* 主内容区域 */}
            <AnimatePresence initial={false} mode="wait">
              {(!isMobile || !showRightPanel) && (
                <motion.div
                  key="main-content"
                  initial={{ opacity: isMobile ? 0 : 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 flex flex-col h-full overflow-hidden"
                >
                  {activeNoteId ? (
                    <NoteEditor noteId={activeNoteId} showAIPanel={showAIPanel} onToggleAIPanel={handleToggleAIPanel} />
                  ) : (
                    <Welcome />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 右侧面板 */}
            <AnimatePresence initial={false}>
              {(!isMobile || showRightPanel) && (
                <motion.div
                  key="right-panel"
                  initial={{
                    x: isMobile ? "100%" : 0,
                    width: isMobile ? "100%" : rightPanelWidth,
                  }}
                  animate={{
                    x: 0,
                    width: isMobile ? "100%" : rightPanelWidth,
                  }}
                  exit={{
                    x: isMobile ? "100%" : 0,
                    width: isMobile ? "100%" : rightPanelWidth,
                  }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`${isMobile ? "absolute inset-0 z-10 bg-gray-950" : ""} border-l border-gray-800 flex flex-col h-full overflow-hidden relative`}
                  style={{ width: isMobile ? "100%" : `${rightPanelWidth}px` }}
                >
                  {isMobile && (
                    <div className="p-2 border-b border-gray-800">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRightPanel(false)}
                        className="touch-feedback"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        返回笔记
                      </Button>
                    </div>
                  )}

                  <div className="border-b border-gray-800 p-2">
                    <div className="flex">
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium flex flex-col items-center gap-1 touch-feedback ${
                          activeRightPanel === "ai" ? "bg-gray-800 rounded-md" : ""
                        }`}
                        onClick={() => setActiveRightPanel("ai")}
                      >
                        <Brain className="h-4 w-4" />
                        <span>AI助手</span>
                      </button>
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium flex flex-col items-center gap-1 touch-feedback ${
                          activeRightPanel === "graph" ? "bg-gray-800 rounded-md" : ""
                        }`}
                        onClick={() => setActiveRightPanel("graph")}
                      >
                        <Network className="h-4 w-4" />
                        <span>知识图谱</span>
                      </button>
                      <button
                        className={`flex-1 py-2 px-4 text-sm font-medium flex flex-col items-center gap-1 touch-feedback ${
                          activeRightPanel === "collab" ? "bg-gray-800 rounded-md" : ""
                        }`}
                        onClick={() => setActiveRightPanel("collab")}
                      >
                        <Users className="h-4 w-4" />
                        <span>协作</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto">{renderRightPanel()}</div>
                  
                  {/* 宽度调整手柄 */}
                  {!isMobile && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-purple-500/50 transition-colors"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const startX = e.clientX;
                        const startWidth = rightPanelWidth;
                        
                        const handleMouseMove = (moveEvent: MouseEvent) => {
                          const deltaX = startX - moveEvent.clientX;
                          const newWidth = Math.max(280, Math.min(600, startWidth + deltaX));
                          setRightPanelWidth(newWidth);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 移动端右侧面板切换按钮 */}
            {isMobile && activeNoteId && !showRightPanel && (
              <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-lg bg-gray-800 border-gray-700 touch-feedback"
                  onClick={() => {
                    setShowRightPanel(true)
                    setActiveRightPanel("ai")
                  }}
                >
                  <Brain className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-lg bg-gray-800 border-gray-700 touch-feedback"
                  onClick={() => {
                    setShowRightPanel(true)
                    setActiveRightPanel("graph")
                  }}
                >
                  <Network className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full shadow-lg bg-gray-800 border-gray-700 touch-feedback"
                  onClick={() => {
                    setShowRightPanel(true)
                    setActiveRightPanel("collab")
                  }}
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* 移动端底部导航 */}
          {isMobile && <MobileNav />}
        </div>

        <GlobalAIDialog open={showGlobalAI} onOpenChange={setShowGlobalAI} />
        <KeyboardShortcuts />
        <OfflineSupport />
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}

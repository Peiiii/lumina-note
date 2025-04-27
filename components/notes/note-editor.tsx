"use client"

import { useState, useRef, useEffect } from "react"
import { Brain, MoreHorizontal, Clock, Star, Check, Eye, Edit, Tag, Mic, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store/store"
import { useDeviceDetect, useKeyboardVisibility } from "@/lib/utils/mobile-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShareNote } from "./share-note"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { MarkdownPreview } from "../markdown/markdown-preview"
import { TagManager } from "../tags/tag-manager"
import { RenameNoteDialog } from "./rename-note-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MarkdownToolbar } from "../markdown/markdown-toolbar"
import type { InputMode, SaveStatus } from "@/types"

interface NoteEditorProps {
  noteId: string
  showAIPanel: boolean
  onToggleAIPanel: () => void
}

export function NoteEditor({ noteId, showAIPanel, onToggleAIPanel }: NoteEditorProps) {
  const { getNote, toggleStar, updateNote, deleteNote } = useStore()
  const note = getNote(noteId)
  const [inputMode, setInputMode] = useState<InputMode>("text")
  const [isListening, setIsListening] = useState(false)
  const [transcription, setTranscription] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [content, setContent] = useState(note?.content || "")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
  const { isMobile } = useDeviceDetect()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isKeyboardVisible = useKeyboardVisibility()
  const { toast } = useToast()
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // 更新笔记内容
  useEffect(() => {
    if (note) {
      setContent(note.content)
    }
  }, [note])

  // 保存笔记内容
  useEffect(() => {
    if (!note || content === note.content) return

    setSaveStatus("unsaved")
    const timer = setTimeout(() => {
      setSaveStatus("saving")

      // 模拟保存延迟
      setTimeout(() => {
        try {
          updateNote(noteId, {
            content,
            preview: content.substring(0, 100) + "...",
          })
          setSaveStatus("saved")

          // 显示保存指示器2秒后隐藏
          setTimeout(() => {
            if (setSaveStatus) setSaveStatus("saved")
          }, 2000)
        } catch (error) {
          setSaveStatus("error")
          toast({
            title: "保存失败",
            description: "无法保存笔记，请稍后再试",
            variant: "destructive",
          })
        }
      }, 500)
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, noteId, note, updateNote, toast])

  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current && !previewMode) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [content, previewMode])

  // 模拟语音识别
  useEffect(() => {
    if (isListening) {
      const timer = setTimeout(() => {
        setTranscription("这是一个AI笔记的演示，通过语音输入可以快速记录想法。系统会自动理解内容并整理成结构化笔记。")
        setIsListening(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isListening])

  // 绘图功能
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置画布大小
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // 设置绘图样式
    ctx.lineWidth = 3
    ctx.lineCap = "round"
    ctx.strokeStyle = "#6366f1"

    const handleStart = (x: number, y: number) => {
      setIsDrawing(true)
      setLastPosition({ x, y })
    }

    const handleMove = (x: number, y: number) => {
      if (!isDrawing) return

      ctx.beginPath()
      ctx.moveTo(lastPosition.x, lastPosition.y)
      ctx.lineTo(x, y)
      ctx.stroke()

      setLastPosition({ x, y })
    }

    const handleEnd = () => {
      setIsDrawing(false)
    }

    // 鼠标事件
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      handleStart(e.clientX - rect.left, e.clientY - rect.top)
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing) return
      const rect = canvas.getBoundingClientRect()
      handleMove(e.clientX - rect.left, e.clientY - rect.top)
    }

    // 触摸事件
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        handleStart(touch.clientX - rect.left, touch.clientY - rect.top)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0 && isDrawing) {
        const rect = canvas.getBoundingClientRect()
        const touch = e.touches[0]
        handleMove(touch.clientX - rect.left, touch.clientY - rect.top)
      }
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleEnd)
    canvas.addEventListener("mouseleave", handleEnd)

    // 添加触摸事件支持
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleEnd)

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleEnd)
      canvas.removeEventListener("mouseleave", handleEnd)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleEnd)
    }
  }, [isDrawing, lastPosition])

  // 处理窗口大小调整
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 绘图模式时锁定滚动
  useEffect(() => {
    if (inputMode === "draw") {
      document.body.classList.add("drawing-mode")
    } else {
      document.body.classList.remove("drawing-mode")
    }
    return () => {
      document.body.classList.remove("drawing-mode")
    }
  }, [inputMode])

  // 处理AI助手显示
  useEffect(() => {
    // 当用户停止输入一段时间后显示AI助手
    if (content && content !== note?.content) {
      const timer = setTimeout(() => {
        setShowAIAssistant(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [content, note?.content])

  if (!note) return null

  // 渲染保存状态指示器
  const renderSaveStatus = () => {
    switch (saveStatus) {
      case "saving":
        return "保存中..."
      case "saved":
        return (
          <>
            <Check className="h-3 w-3 text-green-500" />
            已保存
          </>
        )
      case "unsaved":
        return "未保存"
      case "error":
        return <span className="text-red-500">保存失败</span>
    }
  }

  // 切换预览模式
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode)
  }

  // 处理标签更新
  const handleTagsUpdate = (tags: string[]) => {
    updateNote(noteId, { tags })
  }

  // 处理删除笔记
  const handleDeleteNote = () => {
    deleteNote(noteId)
    toast({
      title: "笔记已删除",
      description: "笔记已成功删除",
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-medium truncate">{note.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {note.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">{renderSaveStatus()}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTagManager(true)}
            className="relative"
            aria-label="管理标签"
          >
            <Tag className="h-5 w-5" />
            {note.tags.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-purple-600 rounded-full text-[10px] flex items-center justify-center">
                {note.tags.length}
              </span>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePreviewMode}
            className={cn(previewMode && "text-blue-400")}
            aria-label={previewMode ? "切换到编辑模式" : "切换到预览模式"}
          >
            {previewMode ? <Edit className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleStar(noteId)}
            className={cn(note.starred && "text-yellow-400")}
          >
            <Star className={cn("h-5 w-5", note.starred && "fill-yellow-400")} />
          </Button>
          <ShareNote noteId={noteId} />
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleAIPanel}
            className={cn(showAIPanel && "text-purple-400")}
          >
            <Brain className="h-5 w-5" />
          </Button>
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700" onClick={() => setShowRenameDialog(true)}>
                  重命名笔记
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">移动到空间</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">导出笔记</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-700 hover:text-red-400"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  删除笔记
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700" onClick={() => setShowRenameDialog(true)}>
                  重命名笔记
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">移动到空间</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">导出笔记</DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 hover:bg-gray-700 hover:text-red-400"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  删除笔记
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 标签显示区域 */}
      {note.tags.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-800 flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border-gray-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div
        className={cn(
          "flex-1 overflow-y-auto p-4 sm:p-6 relative",
          isKeyboardVisible && isMobile && "pb-20", // 键盘可见时增加底部间距
        )}
      >
        <div className="max-w-3xl mx-auto h-full">
          {!previewMode && (
            <>
              {/* 输入模式选择器 */}
              <div className="mb-4 flex flex-wrap gap-2">
                <Button
                  variant={inputMode === "text" ? "default" : "outline"}
                  onClick={() => setInputMode("text")}
                  size="sm"
                >
                  文本
                </Button>
                <Button
                  variant={inputMode === "voice" ? "default" : "outline"}
                  onClick={() => setInputMode("voice")}
                  size="sm"
                >
                  语音
                </Button>
                <Button
                  variant={inputMode === "draw" ? "default" : "outline"}
                  onClick={() => setInputMode("draw")}
                  size="sm"
                >
                  手写
                </Button>
                <Button
                  variant={inputMode === "image" ? "default" : "outline"}
                  onClick={() => setInputMode("image")}
                  size="sm"
                >
                  图像
                </Button>
              </div>

              {/* Markdown 工具栏 */}
              {inputMode === "text" && (
                <div className="mb-4">
                  <MarkdownToolbar
                    onFormatText={(before, after) => {
                      if (!textareaRef.current) return

                      const start = textareaRef.current.selectionStart
                      const end = textareaRef.current.selectionEnd
                      const selectedText = content.substring(start, end)
                      const newContent =
                        content.substring(0, start) + before + selectedText + after + content.substring(end)

                      setContent(newContent)

                      // 重新设置光标位置
                      setTimeout(() => {
                        if (!textareaRef.current) return
                        textareaRef.current.focus()
                        textareaRef.current.setSelectionRange(
                          start + before.length,
                          start + before.length + selectedText.length,
                        )
                      }, 0)
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* 内容区域 */}
          {previewMode ? (
            <MarkdownPreview
              markdown={content}
              editorComponent={
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始输入..."
                  className="w-full bg-transparent border-none outline-none focus-visible:ring-0 resize-none overflow-hidden"
                />
              }
            />
          ) : (
            <>
              {inputMode === "text" && (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="开始输入..."
                  className="w-full bg-transparent border-none outline-none focus-visible:ring-0 resize-none overflow-hidden min-h-[calc(100vh-300px)]"
                />
              )}

              {inputMode === "voice" && (
                <div className="flex flex-col items-center justify-center h-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(isListening && "text-purple-400")}
                    onClick={() => setIsListening(!isListening)}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                  <p className="text-sm text-gray-400 mt-2">{isListening ? "正在聆听..." : "点击开始语音输入"}</p>
                  {transcription && <div className="mt-4 text-center">{transcription}</div>}
                </div>
              )}

              {inputMode === "draw" && (
                <div className="relative w-full h-full min-h-[calc(100vh-300px)]">
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full bg-white rounded-md shadow-md"
                  ></canvas>
                </div>
              )}

              {inputMode === "image" && (
                <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-300px)]">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="text-sm text-gray-400 mt-2">图像输入功能敬请期待...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 标签管理对话框 */}
      <TagManager
        open={showTagManager}
        onOpenChange={setShowTagManager}
        selectedTags={note.tags}
        onTagsChange={handleTagsUpdate}
        noteId={noteId}
      />

      {/* 重命名笔记对话框 */}
      <RenameNoteDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        noteId={noteId}
        currentTitle={note.title}
      />

      {/* 删除确认对话框 */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p>确定要删除笔记 "{note.title}" 吗？此操作无法撤销。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteNote}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

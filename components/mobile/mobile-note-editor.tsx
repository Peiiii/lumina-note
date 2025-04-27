"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
  Link,
  Heading,
  Code,
  Undo,
  Redo,
  Mic,
  Paperclip,
  Send,
  X,
  ChevronDown,
} from "lucide-react"
import { GestureDetector } from "./gesture-detector"
import { a11y } from "@/lib/utils/a11y-utils"

interface MobileNoteEditorProps {
  initialContent?: string
  onSave: (content: string) => void
  onClose?: () => void
  autoFocus?: boolean
}

export function MobileNoteEditor({ initialContent = "", onSave, onClose, autoFocus = false }: MobileNoteEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([initialContent])
  const [redoStack, setRedoStack] = useState<string[]>([])
  const [currentStackIndex, setCurrentStackIndex] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastSavedRef = useRef(initialContent)
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自动保存
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== lastSavedRef.current) {
        onSave(content)
        lastSavedRef.current = content
        a11y.announce("笔记已自动保存", "polite")
      }
    }, 3000)

    return () => clearInterval(autoSaveInterval)
  }, [content, onSave])

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [autoFocus])

  // 处理历史记录
  const recordHistory = (newContent: string) => {
    if (newContent === undoStack[currentStackIndex]) return

    const newUndoStack = [...undoStack.slice(0, currentStackIndex + 1), newContent]
    setUndoStack(newUndoStack)
    setRedoStack([])
    setCurrentStackIndex(newUndoStack.length - 1)
  }

  // 防抖记录历史
  useEffect(() => {
    const timer = setTimeout(() => {
      recordHistory(content)
    }, 500)

    return () => clearTimeout(timer)
  }, [content])

  // 处理撤销
  const handleUndo = () => {
    if (currentStackIndex > 0) {
      const newIndex = currentStackIndex - 1
      setCurrentStackIndex(newIndex)
      setContent(undoStack[newIndex])
      a11y.announce("已撤销", "polite")
    }
  }

  // 处理重做
  const handleRedo = () => {
    if (currentStackIndex < undoStack.length - 1) {
      const newIndex = currentStackIndex + 1
      setCurrentStackIndex(newIndex)
      setContent(undoStack[newIndex])
      a11y.announce("已重做", "polite")
    }
  }

  // 插入文本到光标位置
  const insertTextAtCursor = (textBefore: string, textAfter = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = textarea.value.substring(start, end)
    const newText =
      textarea.value.substring(0, start) + textBefore + selectedText + textAfter + textarea.value.substring(end)

    setContent(newText)

    // 重新设置光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + textBefore.length, start + textBefore.length + selectedText.length)
    }, 0)
  }

  // 工具栏按钮
  const toolbarButtons = [
    { icon: <Bold size={18} />, action: () => insertTextAtCursor("**", "**"), label: "粗体" },
    { icon: <Italic size={18} />, action: () => insertTextAtCursor("*", "*"), label: "斜体" },
    { icon: <Heading size={18} />, action: () => insertTextAtCursor("## "), label: "标题" },
    { icon: <List size={18} />, action: () => insertTextAtCursor("- "), label: "无序列表" },
    { icon: <ListOrdered size={18} />, action: () => insertTextAtCursor("1. "), label: "有序列表" },
    { icon: <Code size={18} />, action: () => insertTextAtCursor("`", "`"), label: "代码" },
    { icon: <Link size={18} />, action: () => insertTextAtCursor("[", "](url)"), label: "链接" },
    { icon: <ImageIcon size={18} />, action: () => insertTextAtCursor("![alt](", ")"), label: "图片" },
  ]

  // 模拟语音输入
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current)
      }
      setIsRecording(false)
      setContent((prev) => prev + " [语音输入结束]")
      a11y.announce("语音输入已结束", "polite")
    } else {
      setIsRecording(true)
      setContent((prev) => prev + " [正在进行语音输入...]")
      a11y.announce("语音输入已开始", "assertive")

      // 模拟3秒后收到语音输入结果
      recordingTimeoutRef.current = setTimeout(() => {
        setContent((prev) => prev.replace("[正在进行语音输入...]", "这是通过语音输入的文本。"))
        setIsRecording(false)
      }, 3000)
    }
  }

  // 保存并关闭
  const handleSave = () => {
    onSave(content)
    lastSavedRef.current = content
    if (onClose) onClose()
    a11y.announce("笔记已保存", "polite")
  }

  return (
    <GestureDetector
      onSwipeDown={() => {
        if (isFullscreen) setIsFullscreen(false)
      }}
    >
      <div className={`mobile-note-editor ${isFullscreen ? "fixed inset-0 z-50 bg-background" : "relative"}`}>
        {/* 编辑器头部 */}
        <div className="flex items-center justify-between p-2 border-b">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="关闭编辑器">
              <X size={20} />
            </Button>
          )}
          <div className="flex-1 text-center font-medium truncate">{isFullscreen ? "全屏编辑" : "编辑笔记"}</div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              aria-label={isFullscreen ? "退出全屏" : "全屏编辑"}
            >
              {isFullscreen ? <ChevronDown size={20} /> : <ChevronDown size={20} className="rotate-180" />}
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} className="px-3">
              保存
            </Button>
          </div>
        </div>

        {/* 编辑区域 */}
        <div className={`relative ${isFullscreen ? "h-[calc(100vh-120px)]" : "h-[300px]"}`}>
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="h-full resize-none p-3 focus:ring-0 border-0 rounded-none"
            placeholder="开始输入笔记内容..."
            aria-label="笔记内容"
          />

          {/* 撤销/重做按钮 */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-70">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUndo}
              disabled={currentStackIndex === 0}
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              aria-label="撤销"
            >
              <Undo size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRedo}
              disabled={currentStackIndex === undoStack.length - 1}
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              aria-label="重做"
            >
              <Redo size={16} />
            </Button>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="border-t">
          <div className="flex items-center justify-between p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsToolbarExpanded(!isToolbarExpanded)}
              className="text-xs flex items-center gap-1"
              aria-expanded={isToolbarExpanded}
              aria-controls="formatting-toolbar"
            >
              {isToolbarExpanded ? "收起格式" : "格式工具"}
              <ChevronDown size={14} className={isToolbarExpanded ? "rotate-180" : ""} />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="icon"
                onClick={toggleVoiceRecording}
                className="h-8 w-8"
                aria-label={isRecording ? "停止语音输入" : "开始语音输入"}
                aria-pressed={isRecording}
              >
                <Mic size={18} className={isRecording ? "animate-pulse" : ""} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="添加附件">
                <Paperclip size={18} />
              </Button>
              <Button variant="primary" size="icon" onClick={handleSave} className="h-8 w-8" aria-label="保存笔记">
                <Send size={18} />
              </Button>
            </div>
          </div>

          {/* 展开的格式工具栏 */}
          {isToolbarExpanded && (
            <div id="formatting-toolbar" className="grid grid-cols-4 gap-1 p-2 border-t bg-muted/30">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="h-8 flex flex-col items-center justify-center gap-1 text-xs"
                  aria-label={button.label}
                >
                  {button.icon}
                  <span className="text-[10px]">{button.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </GestureDetector>
  )
}

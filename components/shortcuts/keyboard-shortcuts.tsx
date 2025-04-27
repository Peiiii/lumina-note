"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useUI } from "@/context/ui-context"
import { useNotes } from "@/context/notes-context"
import { useMobile } from "@/hooks/use-mobile"

export function KeyboardShortcuts() {
  const { toast } = useToast()
  const { activeTab, setActiveTab, activeNote, setActiveNote } = useUI()
  const { createNote, notes, toggleStar } = useNotes()
  const isMobile = useMobile()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否在输入框中
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement) {
        return
      }

      // Cmd/Ctrl + / 显示快捷键帮助
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toast({
          title: "键盘快捷键",
          description: (
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Cmd/Ctrl + N</div>
              <div>新建笔记</div>
              <div>Cmd/Ctrl + 1</div>
              <div>笔记视图</div>
              <div>Cmd/Ctrl + 2</div>
              <div>空间视图</div>
              <div>Cmd/Ctrl + 3</div>
              <div>知识图谱视图</div>
              <div>Cmd/Ctrl + /</div>
              <div>显示此帮助</div>
              {isMobile && (
                <>
                  <div>双击</div>
                  <div>编辑笔记</div>
                  <div>左滑</div>
                  <div>显示操作</div>
                </>
              )}
            </div>
          ),
          duration: 5000,
        })
      }

      // Cmd/Ctrl + N 新建笔记
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        createNote()
      }

      // Cmd/Ctrl + 1/2/3 切换视图
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setActiveTab("notes")
            break
          case "2":
            e.preventDefault()
            setActiveTab("spaces")
            break
          case "3":
            e.preventDefault()
            setActiveTab("graph")
            break
        }
      }

      // 移动端特定快捷键
      if (isMobile) {
        // 上下箭头导航笔记列表
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault()

          if (notes.length === 0) return

          const currentIndex = activeNote ? notes.findIndex((note) => note.id === activeNote) : -1
          let newIndex = 0

          if (e.key === "ArrowUp") {
            newIndex = currentIndex <= 0 ? notes.length - 1 : currentIndex - 1
          } else {
            newIndex = currentIndex >= notes.length - 1 ? 0 : currentIndex + 1
          }

          setActiveNote(notes[newIndex].id)
        }

        // 空格键切换星标
        if (e.key === " " && activeNote) {
          e.preventDefault()
          toggleStar(activeNote)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toast, setActiveTab, createNote, isMobile, activeNote, notes, setActiveNote, toggleStar])

  // 这个组件不渲染任何UI，只是添加键盘快捷键功能
  return null
}

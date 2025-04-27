"use client"

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"

export interface Note {
  id: string
  title: string
  content: string
  preview: string
  date: string
  tags: string[]
  starred: boolean
  spaceId?: string
}

export interface Space {
  id: string
  name: string
  color: string
  icon: string
}

interface NotesContextType {
  notes: Note[]
  spaces: Space[]
  createNote: (spaceId?: string) => string
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
  getNote: (id: string) => Note | undefined
  toggleStar: (id: string) => void
  createSpace: (name: string, color: string, icon: string) => string
  updateSpace: (id: string, data: Partial<Space>) => void
  deleteSpace: (id: string) => void
  getNotesBySpace: (spaceId: string) => Note[]
  exportData: () => string
  importData: (jsonData: string) => boolean
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

// Sample initial data
const initialNotes: Note[] = [
  {
    id: "note1",
    title: "AI产品设计原则",
    content:
      "# AI产品设计原则\n\n## 以用户为中心\n- 理解用户真实需求，而非假设\n- 减少认知负担，创造直觉式体验\n- 提供适度的控制权和透明度\n\n## 渐进增强\n- 基础功能应在无AI情况下可用\n- AI应增强而非替代核心体验\n- 允许用户选择参与程度\n\n## 持续学习\n- 从用户交互中学习和适应\n- 提供个性化体验而非通用解决方案\n- 建立反馈循环以改进AI模型",
    preview: "以用户为中心的AI产品设计需要考虑以下几个关键原则...",
    date: "今天 14:30",
    tags: ["产品设计", "AI", "UX"],
    starred: true,
    spaceId: "space1",
  },
  {
    id: "note2",
    title: "项目启动会议记录",
    content:
      "# 项目启动会议记录\n\n## 参会人员\n- 产品经理：李明\n- 设计师：王芳\n- 开发负责人：张伟\n- 市场代表：刘洋\n\n## 讨论要点\n1. 产品目标与愿景\n2. 核心功能与优先级\n3. 技术选型与架构\n4. 时间线与里程碑\n\n## 决定事项\n- MVP版本将在6周内完成\n- 采用React Native开发移动应用\n- 下周五前完成设计稿\n- 两周后进行第一次内部测试",
    preview: "与团队讨论了新产品的目标、时间线和关键功能...",
    date: "昨天 10:15",
    tags: ["会议", "项目管理"],
    starred: false,
    spaceId: "space2",
  },
  {
    id: "note3",
    title: "创新思维框架",
    content:
      "# 创新思维框架\n\n## 第一性原理思维\n- 回归基本事实和基础科学\n- 从根本上重新思考问题\n- 避免类比推理的局限性\n\n## 横向思维\n- 打破常规思维模式\n- 寻找非显而易见的联系\n- 鼓励创造性解决方案\n\n## 设计思维\n- 以人为本的问题解决方法\n- 强调同理心和用户需求\n- 快速原型和迭代测试",
    preview: "结合第一性原理和类比思维可以产生突破性创新...",
    date: "2天前",
    tags: ["创新", "思维方法"],
    starred: true,
    spaceId: "space1",
  },
]

const initialSpaces: Space[] = [
  {
    id: "space1",
    name: "产品设计",
    color: "purple",
    icon: "lightbulb",
  },
  {
    id: "space2",
    name: "项目管理",
    color: "blue",
    icon: "clipboard",
  },
  {
    id: "space3",
    name: "个人笔记",
    color: "green",
    icon: "book",
  },
]

// 本地存储键
const STORAGE_KEYS = {
  NOTES: "lumina_notes",
  SPACES: "lumina_spaces",
}

export function NotesProvider({ children }: { children: ReactNode }) {
  // 尝试从本地存储加载数据，如果没有则使用初始数据
  const loadInitialData = () => {
    if (typeof window === "undefined") return { notes: initialNotes, spaces: initialSpaces }

    try {
      const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES)
      const savedSpaces = localStorage.getItem(STORAGE_KEYS.SPACES)

      return {
        notes: savedNotes ? JSON.parse(savedNotes) : initialNotes,
        spaces: savedSpaces ? JSON.parse(savedSpaces) : initialSpaces,
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      return { notes: initialNotes, spaces: initialSpaces }
    }
  }

  const [notes, setNotes] = useState<Note[]>(() => loadInitialData().notes)
  const [spaces, setSpaces] = useState<Space[]>(() => loadInitialData().spaces)

  // 数据变化时保存到本地存储
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes))
    } catch (error) {
      console.error("Error saving notes to localStorage:", error)
    }
  }, [notes])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(spaces))
    } catch (error) {
      console.error("Error saving spaces to localStorage:", error)
    }
  }, [spaces])

  const createNote = useCallback((spaceId?: string) => {
    const now = new Date()
    const formattedDate = "刚刚"

    const newNote: Note = {
      id: uuidv4(),
      title: "新笔记",
      content: "",
      preview: "新建笔记...",
      date: formattedDate,
      tags: [],
      starred: false,
      spaceId,
    }
    setNotes((prev) => [newNote, ...prev])
    return newNote.id
  }, [])

  const updateNote = useCallback((id: string, data: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...data } : note)))
  }, [])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
  }, [])

  const getNote = useCallback(
    (id: string) => {
      return notes.find((note) => note.id === id)
    },
    [notes],
  )

  const toggleStar = useCallback((id: string) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, starred: !note.starred } : note)))
  }, [])

  const createSpace = useCallback((name: string, color: string, icon: string) => {
    const newSpace: Space = {
      id: uuidv4(),
      name,
      color,
      icon,
    }
    setSpaces((prev) => [...prev, newSpace])
    return newSpace.id
  }, [])

  const updateSpace = useCallback((id: string, data: Partial<Space>) => {
    setSpaces((prev) => prev.map((space) => (space.id === id ? { ...space, ...data } : space)))
  }, [])

  const deleteSpace = useCallback((id: string) => {
    setSpaces((prev) => prev.filter((space) => space.id !== id))
    // Remove space from notes or set to default
    setNotes((prev) => prev.map((note) => (note.spaceId === id ? { ...note, spaceId: undefined } : note)))
  }, [])

  const getNotesBySpace = useCallback(
    (spaceId: string) => {
      return notes.filter((note) => note.spaceId === spaceId)
    },
    [notes],
  )

  // 导出数据功能
  const exportData = useCallback(() => {
    const data = {
      notes,
      spaces,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }
    return JSON.stringify(data)
  }, [notes, spaces])

  // 导入数据功能
  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData)
      if (data.notes && Array.isArray(data.notes) && data.spaces && Array.isArray(data.spaces)) {
        setNotes(data.notes)
        setSpaces(data.spaces)
        return true
      }
      return false
    } catch (error) {
      console.error("Error importing data:", error)
      return false
    }
  }, [])

  return (
    <NotesContext.Provider
      value={{
        notes,
        spaces,
        createNote,
        updateNote,
        deleteNote,
        getNote,
        toggleStar,
        createSpace,
        updateSpace,
        deleteSpace,
        getNotesBySpace,
        exportData,
        importData,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider")
  }
  return context
}

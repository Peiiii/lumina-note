import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { Note, Space } from "@/types"
import { initialNotes, initialSpaces } from "./initial-data"
interface NoteState {
  notes: Note[]
  spaces: Space[]
  activeNoteId: string | null
  activeTab: "notes" | "spaces" | "graph"
  sidebarOpen: boolean
  showAIPanel: boolean
  // 笔记操作
  createNote: (spaceId?: string) => string
  updateNote: (id: string, data: Partial<Note>) => void
  deleteNote: (id: string) => void
  getNote: (id: string) => Note | undefined
  toggleStar: (id: string) => void
  getNotesBySpace: (spaceId: string) => Note[]
  updateNoteTags: (noteId: string, tags: string[]) => void
  // 标签操作
  getAllTags: () => string[]
  addTag: (tag: string) => void
  removeTag: (tag: string) => void
  // 空间操作
  createSpace: (name: string, color: string, icon: string) => string
  updateSpace: (id: string, data: Partial<Space>) => void
  deleteSpace: (id: string) => void
  // UI 操作
  setActiveNote: (id: string | null) => void
  setActiveTab: (tab: "notes" | "spaces" | "graph") => void
  setSidebarOpen: (open: boolean) => void
  setShowAIPanel: (show: boolean) => void
  // 数据操作
  exportData: () => string
  importData: (jsonData: string) => boolean
}
export const useStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      spaces: initialSpaces,
      activeNoteId: null,
      activeTab: "notes",
      sidebarOpen: true,
      showAIPanel: false,
      // 笔记操作
      createNote: (spaceId) => {
        const id = uuidv4()
        const now = new Date()
        const formattedDate = "刚刚"
        const newNote: Note = {
          id,
          title: "新笔记",
          content: "",
          preview: "新建笔记...",
          date: formattedDate,
          tags: [],
          starred: false,
          spaceId,
          lastModified: now.toISOString(),
        }
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: id,
        }))
        return id
      },
      updateNote: (id, data) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? {
                  ...note,
                  ...data,
                  lastModified: new Date().toISOString(),
                  // 如果内容更新了，自动更新预览
                  preview: data.content ? data.content.substring(0, 100) + "..." : note.preview,
                }
              : note,
          ),
        }))
      },
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }))
      },
      getNote: (id) => {
        return get().notes.find((note) => note.id === id)
      },
      toggleStar: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, starred: !note.starred } : note
          ),
        }))
      },
      getNotesBySpace: (spaceId) => {
        return get().notes.filter((note) => note.spaceId === spaceId)
      },
      updateNoteTags: (noteId, tags) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? { ...note, tags } : note
          ),
        }))
      },
      // 标签操作
      getAllTags: () => {
        const allTags = new Set<string>()
        get().notes.forEach((note) => {
          note.tags.forEach((tag) => allTags.add(tag))
        })
        return Array.from(allTags)
      },
      addTag: (tag) => {
        const activeId = get().activeNoteId
        if (activeId) {
          const currentNote = get().getNote(activeId)
          if (currentNote && !currentNote.tags.includes(tag)) {
            get().updateNoteTags(activeId, [...currentNote.tags, tag])
          }
        }
      },
      removeTag: (tag) => {
        const activeId = get().activeNoteId
        if (activeId) {
          const currentNote = get().getNote(activeId)
          if (currentNote) {
            get().updateNoteTags(
              activeId,
              currentNote.tags.filter((t) => t !== tag)
            )
          }
        }
      },
      // 空间操作
      createSpace: (name, color, icon) => {
        const id = uuidv4()
        const newSpace: Space = {
          id,
          name,
          color,
          icon,
          sortOrder: get().spaces.length,
        }
        set((state) => ({
          spaces: [...state.spaces, newSpace],
        }))
        return id
      },
      updateSpace: (id, data) => {
        set((state) => ({
          spaces: state.spaces.map((space) =>
            space.id === id ? { ...space, ...data } : space
          ),
        }))
      },
      deleteSpace: (id) => {
        set((state) => ({
          spaces: state.spaces.filter((space) => space.id !== id),
          // 将该空间下的笔记移到默认空间
          notes: state.notes.map((note) =>
            note.spaceId === id ? { ...note, spaceId: undefined } : note
          ),
        }))
      },
      // UI 操作
      setActiveNote: (id) => {
        set({ activeNoteId: id })
      },
      setActiveTab: (tab) => {
        set({ activeTab: tab })
      },
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },
      setShowAIPanel: (show) => {
        set({ showAIPanel: show })
      },
      // 数据操作
      exportData: () => {
        const { notes, spaces } = get()
        return JSON.stringify({ notes, spaces }, null, 2)
      },
      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData)
          if (data.notes && data.spaces) {
            set({
              notes: data.notes,
              spaces: data.spaces,
              activeNoteId: null,
            })
            return true
          }
          return false
        } catch (error) {
          console.error("导入数据失败:", error)
          return false
        }
      },
    }),
    {
      name: "notes-store",
      version: 1,
    }
  )
)

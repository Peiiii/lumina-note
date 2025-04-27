"use client"

import { useStore } from "@/lib/store/store"
import { cn } from "@/lib/utils"
import { useDeviceDetect, useSwipeGesture } from "@/lib/utils/mobile-utils"
import type { Note } from "@/types"
import { motion } from "framer-motion"
import { Clock, MoreVertical, Star } from "lucide-react"
import { useRef, useState } from "react"

interface NotesListProps {
  notes: Note[]
}

export function NotesList({ notes }: NotesListProps) {
  const { activeNoteId, setActiveNote, toggleStar, deleteNote } = useStore()
  const { isMobile } = useDeviceDetect()
  const [swipedNoteId, setSwipedNoteId] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 处理笔记点击
  const handleNoteClick = (noteId: string) => {
    setActiveNote(noteId)
  }

  // 使用自定义滑动手势钩子
  useSwipeGesture({
    onSwipeLeft: () => {
      // 在移动设备上，向左滑动可以显示操作按钮
      if (isMobile && containerRef.current) {
        // 这里可以实现更复杂的逻辑，比如找到当前正在滑动的笔记
      }
    },
    onSwipeRight: () => {
      // 向右滑动可以隐藏操作按钮
      if (isMobile && swipedNoteId) {
        setSwipedNoteId(null)
      }
    },
    element: containerRef,
  })

  // 处理笔记滑动
  const handleNoteSwipe = (noteId: string) => {
    if (swipedNoteId === noteId) {
      setSwipedNoteId(null)
    } else {
      setSwipedNoteId(noteId)
    }
  }

  return (
    <div className="space-y-2" ref={containerRef}>
      {notes.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <p>没有找到笔记</p>
          <p className="text-sm mt-1">创建一个新笔记开始吧</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.05 }}>
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              isActive={activeNoteId === note.id}
              isSwiped={swipedNoteId === note.id}
              onNoteClick={handleNoteClick}
              onNoteSwipe={handleNoteSwipe}
              onToggleStar={toggleStar}
              onDeleteNote={deleteNote}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

interface NoteItemProps {
  note: Note
  isActive: boolean
  isSwiped: boolean
  onNoteClick: (id: string) => void
  onNoteSwipe: (id: string) => void
  onToggleStar: (id: string) => void
  onDeleteNote: (id: string) => void
}

function NoteItem({ note, isActive, isSwiped, onNoteClick, onNoteSwipe, onToggleStar, onDeleteNote }: NoteItemProps) {
  const { isMobile } = useDeviceDetect()

  return (
    <motion.div
      className={cn("relative overflow-hidden", isMobile && "touch-feedback")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      layout
    >
      <motion.div
        className={cn(
          "p-3 rounded-lg cursor-pointer transition-colors",
          isActive ? "bg-purple-900/30" : "hover:bg-gray-800",
        )}
        onClick={() => onNoteClick(note.id)}
        animate={{
          x: isSwiped ? -100 : 0,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        drag={isMobile ? "x" : false}
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={(e, info) => {
          if (info.offset.x < -50) {
            onNoteSwipe(note.id)
          } else {
            onNoteSwipe("")
          }
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium">{note.title}</h3>
          {note.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        </div>
        <p className="text-sm text-gray-400 line-clamp-2">{note.preview}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1">
            {note.tags.slice(0, 2).map((tag, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                {tag}
              </span>
            ))}
            {note.tags.length > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                +{note.tags.length - 2}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {note.date}
          </span>
        </div>
      </motion.div>

      {/* 滑动操作按钮 */}
      {isMobile && (
        <div className="absolute top-0 right-0 h-full flex">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="h-full px-4 bg-yellow-500 flex items-center justify-center"
            onClick={() => onToggleStar(note.id)}
          >
            <Star className="h-5 w-5 text-white" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="h-full px-4 bg-red-500 flex items-center justify-center"
            onClick={() => {
              onDeleteNote(note.id)
              onNoteSwipe("")
            }}
          >
            <MoreVertical className="h-5 w-5 text-white" />
          </motion.button>
        </div>
      )}
    </motion.div>
  )
}

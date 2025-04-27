"use client"

import { useState, useEffect } from "react"
import { Tag, Plus, X, Check, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useStore } from "@/lib/store/store"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

interface TagManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedTags?: string[]
  onTagsChange?: (tags: string[]) => void
  noteId?: string
}

export function TagManager({ open, onOpenChange, selectedTags = [], onTagsChange, noteId }: TagManagerProps) {
  const { getAllTags, addTag, removeTag, updateNoteTags } = useStore()
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [editingTag, setEditingTag] = useState<{ original: string; edited: string } | null>(null)
  const [selectedTagsState, setSelectedTagsState] = useState<string[]>(selectedTags)
  const [searchQuery, setSearchQuery] = useState("")

  // 加载所有可用标签
  useEffect(() => {
    setAvailableTags(getAllTags())
  }, [getAllTags])

  // 当选中的标签变化时更新状态
  useEffect(() => {
    setSelectedTagsState(selectedTags)
  }, [selectedTags])

  // 过滤标签
  const filteredTags = availableTags.filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

  // 添加新标签
  const handleAddTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      const trimmedTag = newTag.trim()
      addTag(trimmedTag)
      setAvailableTags((prev) => [...prev, trimmedTag])
      setNewTag("")
    }
  }

  // 删除标签
  const handleRemoveTag = (tag: string) => {
    removeTag(tag)
    setAvailableTags((prev) => prev.filter((t) => t !== tag))
    setSelectedTagsState((prev) => prev.filter((t) => t !== tag))
    if (onTagsChange) {
      onTagsChange(selectedTagsState.filter((t) => t !== tag))
    }
  }

  // 开始编辑标签
  const startEditTag = (tag: string) => {
    setEditingTag({ original: tag, edited: tag })
  }

  // 保存编辑的标签
  const saveEditedTag = () => {
    if (editingTag && editingTag.edited.trim() && editingTag.original !== editingTag.edited) {
      // 更新可用标签列表
      setAvailableTags((prev) => prev.map((tag) => (tag === editingTag.original ? editingTag.edited : tag)))

      // 更新选中的标签
      setSelectedTagsState((prev) => prev.map((tag) => (tag === editingTag.original ? editingTag.edited : tag)))

      // 通知父组件
      if (onTagsChange) {
        onTagsChange(selectedTagsState.map((tag) => (tag === editingTag.original ? editingTag.edited : tag)))
      }
    }
    setEditingTag(null)
  }

  // 切换标签选择状态
  const toggleTagSelection = (tag: string) => {
    const newSelectedTags = selectedTagsState.includes(tag)
      ? selectedTagsState.filter((t) => t !== tag)
      : [...selectedTagsState, tag]

    setSelectedTagsState(newSelectedTags)

    if (onTagsChange) {
      onTagsChange(newSelectedTags)
    }
  }

  // 保存标签更改
  const handleSave = () => {
    if (noteId) {
      updateNoteTags(noteId, selectedTagsState)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            标签管理
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Input
              placeholder="搜索标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          {/* 添加新标签 */}
          <div className="flex gap-2">
            <Input
              placeholder="新标签名称..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              className="bg-gray-800 border-gray-700"
            />
            <Button onClick={handleAddTag} disabled={!newTag.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              添加
            </Button>
          </div>

          {/* 已选标签 */}
          {selectedTagsState.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">已选标签</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTagsState.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 bg-purple-900/30 text-purple-300 border-purple-800"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTagSelection(tag)}
                      className="ml-1 text-purple-300 hover:text-purple-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 可用标签列表 */}
          <div>
            <h4 className="text-sm font-medium mb-2">可用标签</h4>
            <div className="max-h-60 overflow-y-auto pr-2">
              <AnimatePresence>
                {filteredTags.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredTags.map((tag) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                      >
                        {editingTag && editingTag.original === tag ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editingTag.edited}
                              onChange={(e) => setEditingTag({ ...editingTag, edited: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && saveEditedTag()}
                              className="bg-gray-800 border-gray-700 py-1 h-8 text-sm"
                              autoFocus
                            />
                            <Button size="icon" variant="ghost" onClick={saveEditedTag} className="h-8 w-8">
                              <Check className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-2 rounded-md bg-gray-800 hover:bg-gray-700">
                            <button
                              className={`flex-1 text-left ${selectedTagsState.includes(tag) ? "text-purple-300" : "text-gray-300"}`}
                              onClick={() => toggleTagSelection(tag)}
                            >
                              {tag}
                            </button>
                            <div className="flex items-center">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEditTag(tag)}
                                className="h-6 w-6 text-gray-400 hover:text-white"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleRemoveTag(tag)}
                                className="h-6 w-6 text-gray-400 hover:text-red-400"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {searchQuery ? "没有找到匹配的标签" : "没有可用标签"}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"

interface GlobalAIDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GlobalAIDialog({ open, onOpenChange }: GlobalAIDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md h-[500px] flex flex-col p-0">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-medium">Lumina AI 助手</h2>
          <p className="text-sm text-gray-400">我可以帮助你管理笔记、回答问题或提供建议</p>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden p-4">
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>AI助手功能即将推出</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"
import { Users, MessageSquare } from "lucide-react"

interface User {
  id: string
  name: string
  avatar?: string
  online: boolean
  color: string
}

interface Comment {
  id: string
  userId: string
  content: string
  timestamp: string
  resolved: boolean
}

interface CollaborationPanelProps {
  noteId?: string
}

export function CollaborationPanel({ noteId }: CollaborationPanelProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-medium flex items-center gap-2">
          <Users className="h-4 w-4 text-blue-400" />
          协作
        </h3>
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>协作功能即将推出</p>
          <p className="text-sm mt-2">敬请期待</p>
        </div>
      </div>
    </div>
  )
}

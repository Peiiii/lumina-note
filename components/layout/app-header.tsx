"use client"

import { Sparkles, Settings, Menu, X, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUI } from "@/context/ui-context"
import { useMobile } from "@/hooks/use-mobile"

interface AppHeaderProps {
  onShowGlobalAI: () => void
}

export function AppHeader({ onShowGlobalAI }: AppHeaderProps) {
  const { sidebarOpen, setSidebarOpen, activeNote } = useUI()
  const isMobile = useMobile()

  return (
    <header className="h-14 border-b border-gray-800 flex items-center px-4 justify-between">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-2">
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-400" />
          <h1 className="text-xl font-light">Lumina</h1>
          {isMobile && activeNote && <span className="text-xs text-gray-400 ml-2">笔记</span>}
        </div>
      </div>

      {!isMobile && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onShowGlobalAI} className="relative">
            <Brain className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/abstract-headscape.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      )}
    </header>
  )
}

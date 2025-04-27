"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)

  // 防止水合错误
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isMobile ? "center" : "end"} className="bg-gray-800 border-gray-700">
        <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer" onClick={() => setTheme("light")}>
          <Sun className="h-4 w-4 mr-2" />
          浅色
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer" onClick={() => setTheme("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          深色
        </DropdownMenuItem>
        <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer" onClick={() => setTheme("system")}>
          <Monitor className="h-4 w-4 mr-2" />
          系统
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

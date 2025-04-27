"use client"

import { useEffect, useState } from "react"
import { WifiOff, Wifi } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import { motion, AnimatePresence } from "framer-motion"

export function OfflineSupport() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)
  const { toast } = useToast()
  const isMobile = useMobile()

  useEffect(() => {
    // 检查初始在线状态
    setIsOnline(navigator.onLine)

    // 添加事件监听器
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      setTimeout(() => setShowIndicator(false), 3000)

      toast({
        title: "已恢复连接",
        description: "您的更改将自动同步到云端",
        duration: 3000,
      })
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)

      toast({
        title: "已切换到离线模式",
        description: "您可以继续工作，我们会在恢复连接后自动同步",
        duration: 5000,
      })
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // 清理事件监听器
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [toast])

  return (
    <AnimatePresence>
      {(showIndicator || !isOnline) && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={`fixed ${isMobile ? "bottom-20" : "bottom-4"} left-4 z-50 flex items-center gap-2 rounded-full px-3 py-1 text-sm ${
            isOnline ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          } shadow-lg safe-bottom`}
        >
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4" />
              <span>已连接</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" />
              <span>离线模式</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

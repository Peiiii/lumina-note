"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorRecoveryProps {
  error: Error
  reset: () => void
  componentName?: string
}

export function ErrorRecovery({ error, reset, componentName = "组件" }: ErrorRecoveryProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isAutoRetrying, setIsAutoRetrying] = useState(false)

  useEffect(() => {
    // 如果是网络错误，尝试自动重试
    if (error.message.includes("network") || error.message.includes("fetch")) {
      setIsAutoRetrying(true)
      setCountdown(5)
    }
  }, [error])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      reset()
      setIsAutoRetrying(false)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown, reset])

  const handleManualRetry = () => {
    setIsAutoRetrying(false)
    setCountdown(null)
    reset()
  }

  const handleCancelAutoRetry = () => {
    setIsAutoRetrying(false)
    setCountdown(null)
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{componentName}加载失败</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-2">{error.message}</p>

        {isAutoRetrying ? (
          <div className="flex items-center gap-2">
            <p>将在 {countdown} 秒后自动重试...</p>
            <Button variant="outline" size="sm" onClick={handleCancelAutoRetry}>
              取消
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={handleManualRetry} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

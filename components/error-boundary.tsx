"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Caught in error boundary:", error)
      setHasError(true)
      setError(error.error)
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-100">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="mb-2 text-xl font-semibold">出现了一些问题</h2>
        <p className="mb-6 text-gray-600">应用程序遇到了一个错误。我们已记录此问题并将尽快修复。</p>
        <div className="space-y-2">
          <Button onClick={() => window.location.reload()} className="w-full sm:w-auto">
            刷新页面
          </Button>
          <div className="mt-4 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-32 text-sm">
            <code className="text-red-600">{error?.toString() || "未知错误"}</code>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

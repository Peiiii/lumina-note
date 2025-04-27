"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // 记录错误到日志服务
    console.error("Global application error:", error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <CardTitle>应用程序错误</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">抱歉，应用程序遇到了意外错误。</p>
              <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-auto max-h-[200px]">
                {error.message}
                {error.digest && <p className="mt-2 text-xs text-muted-foreground">错误 ID: {error.digest}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Button>
              <Button onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                重试
              </Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}

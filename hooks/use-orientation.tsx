"use client"

import { useState, useEffect } from "react"

type Orientation = "portrait" | "landscape"

export function useOrientation() {
  const [orientation, setOrientation] = useState<Orientation>("portrait")

  useEffect(() => {
    // 初始检查
    const checkOrientation = () => {
      const isPortrait = window.matchMedia("(orientation: portrait)").matches
      setOrientation(isPortrait ? "portrait" : "landscape")
    }

    // 首次运行
    checkOrientation()

    // 监听方向变化
    const mediaQuery = window.matchMedia("(orientation: portrait)")
    const handleOrientationChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "portrait" : "landscape")
    }

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleOrientationChange)
    } else {
      // 旧版浏览器兼容
      mediaQuery.addListener(handleOrientationChange)
    }

    // 清理监听器
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleOrientationChange)
      } else {
        // 旧版浏览器兼容
        mediaQuery.removeListener(handleOrientationChange)
      }
    }
  }, [])

  return orientation
}

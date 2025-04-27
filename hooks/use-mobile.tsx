"use client"

import { useState, useEffect } from "react"

export function useMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 初始检查
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // 首次运行
    checkIfMobile()

    // 监听窗口大小变化
    window.addEventListener("resize", checkIfMobile)

    // 清理监听器
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [breakpoint])

  return isMobile
}

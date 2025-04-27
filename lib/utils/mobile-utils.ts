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

// 简单的移动设备检测函数
export function isMobile() {
  if (typeof window === "undefined") return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 检测屏幕方向
export function useOrientation() {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")

  useEffect(() => {
    const checkOrientation = () => {
      setOrientation(window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape")
    }

    checkOrientation()

    const mediaQuery = window.matchMedia("(orientation: portrait)")
    const handleChange = (e: MediaQueryListEvent) => {
      setOrientation(e.matches ? "portrait" : "landscape")
    }

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange)
    } else {
      // 旧版浏览器兼容
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange)
      } else {
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return orientation
}

// 检测键盘可见性
export function useKeyboardVisibility() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !isMobile()) return

    const handleResize = () => {
      // 在移动设备上，当键盘弹出时，视口高度会减小
      const isKeyboard = window.innerHeight < window.outerHeight * 0.75
      setIsKeyboardVisible(isKeyboard)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isKeyboardVisible
}

// 设备检测 Hook
export function useDeviceDetect() {
  const isMobileView = useMobile()
  const isMobileDevice = isMobile()
  
  return {
    isMobile: isMobileView || isMobileDevice,
    isMobileView,
    isMobileDevice,
    isDesktop: !isMobileView && !isMobileDevice
  }
}

// 滑动手势 Hook
export function useSwipeGesture({ 
  onSwipeLeft, 
  onSwipeRight,
  element
}: { 
  onSwipeLeft?: () => void, 
  onSwipeRight?: () => void,
  element?: React.RefObject<Element> | null
}) {
  useEffect(() => {
    if (typeof window === "undefined") return
    
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent
      touchStartX = touchEvent.touches[0].clientX
    }
    
    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent
      touchEndX = touchEvent.changedTouches[0].clientX
      const swipeDistance = touchEndX - touchStartX
      
      if (Math.abs(swipeDistance) > 50) { // 最小滑动距离
        if (swipeDistance > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (swipeDistance < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      }
    }
    
    const targetElement = element?.current || document
    
    targetElement.addEventListener('touchstart', handleTouchStart)
    targetElement.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      targetElement.removeEventListener('touchstart', handleTouchStart)
      targetElement.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipeLeft, onSwipeRight, element])
}

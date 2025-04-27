"use client"

import { useEffect, useState } from "react"

// 预定义的动画曲线
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => --t * t * t + 1,
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - --t * t * t * t,
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
}

// 动画帧请求工具
export const animate = (
  callback: (progress: number) => void,
  duration = 300,
  easing: (t: number) => number = easings.easeOutQuad,
  onComplete?: () => void,
) => {
  const startTime = performance.now()
  let animationFrameId: number

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = easing(progress)

    callback(easedProgress)

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step)
    } else if (onComplete) {
      onComplete()
    }
  }

  animationFrameId = requestAnimationFrame(step)

  return () => cancelAnimationFrame(animationFrameId)
}

// 值动画 Hook
export const useValueAnimation = (
  initialValue: number,
  duration = 300,
  easing: (t: number) => number = easings.easeOutQuad,
) => {
  const [value, setValue] = useState(initialValue)
  const [targetValue, setTargetValue] = useState(initialValue)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (targetValue === value) return

    setIsAnimating(true)
    const startValue = value
    const valueRange = targetValue - startValue

    const cleanup = animate(
      (progress) => {
        setValue(startValue + valueRange * progress)
      },
      duration,
      easing,
      () => setIsAnimating(false),
    )

    return cleanup
  }, [targetValue, value, duration, easing])

  return { value, setTargetValue, isAnimating }
}

// 元素进入/离开动画
export const useElementAnimation = (
  initialVisible = false,
  duration = 300,
  easing: (t: number) => number = easings.easeOutQuad,
) => {
  const [visible, setVisible] = useState(initialVisible)
  const [shouldRender, setShouldRender] = useState(initialVisible)
  const [progress, setProgress] = useState(initialVisible ? 1 : 0)

  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      let cleanup: (() => void) | undefined

      // 使用 requestAnimationFrame 确保 DOM 已更新
      const frameId = requestAnimationFrame(() => {
        cleanup = animate(setProgress, duration, easing)
      })

      return () => {
        cancelAnimationFrame(frameId)
        if (cleanup) cleanup()
      }
    } else {
      const cleanup = animate(setProgress, duration, easing, () => {
        setShouldRender(false)
      })

      return cleanup
    }
  }, [visible, duration, easing])

  return { visible, setVisible, shouldRender, progress }
}

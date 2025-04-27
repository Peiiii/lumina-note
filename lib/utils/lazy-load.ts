import type React from "react"
import dynamic from "next/dynamic"

// 懒加载组件
export const lazyLoadComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  loadingComponent?: React.ReactNode,
  ssr = false,
) => {
  return dynamic(importFunc, {
    loading: () => <>{loadingComponent}</>,
    ssr,
  })
}

// 预加载组件
export const preloadComponent = <T extends React.ComponentType<any>>(importFunc: () => Promise<{ default: T }>) => {
  void importFunc()
}

// 懒加载图片
export const lazyLoadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Skeleton } from "@/components/ui/skeleton"

interface MobileOptimizedListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  getItemKey: (item: T) => string | number
  estimateSize?: number
  className?: string
}

export function MobileOptimizedList<T>({
  items,
  renderItem,
  getItemKey,
  estimateSize = 50,
  className = "",
}: MobileOptimizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 使用虚拟化列表优化渲染性能
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 5,
  })

  useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [items])

  if (isLoading) {
    return (
      <div className={`overflow-auto ${className}`}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="p-2">
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={parentRef} className={`overflow-auto ${className}`} style={{ height: "100%", width: "100%" }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index]
          return (
            <div
              key={getItemKey(item)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

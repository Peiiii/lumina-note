"use client"

import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Code,
  LinkIcon,
  ImageIcon as ImageIconLucide,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MarkdownToolbarProps {
  onFormatText: (before: string, after: string) => void
}

export function MarkdownToolbar({ onFormatText }: MarkdownToolbarProps) {
  const formatOptions = [
    {
      icon: <Bold className="h-4 w-4" />,
      label: "粗体",
      before: "**",
      after: "**",
    },
    {
      icon: <Italic className="h-4 w-4" />,
      label: "斜体",
      before: "*",
      after: "*",
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      label: "一级标题",
      before: "# ",
      after: "",
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      label: "二级标题",
      before: "## ",
      after: "",
    },
    {
      icon: <List className="h-4 w-4" />,
      label: "无序列表",
      before: "- ",
      after: "",
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      label: "有序列表",
      before: "1. ",
      after: "",
    },
    {
      icon: <Code className="h-4 w-4" />,
      label: "代码",
      before: "`",
      after: "`",
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      label: "链接",
      before: "[",
      after: "](url)",
    },
    {
      icon: <ImageIconLucide className="h-4 w-4" />,
      label: "图片",
      before: "![alt text](",
      after: ")",
    },
  ]

  return (
    <div className="flex flex-wrap gap-1 p-1 bg-gray-800/30 rounded-md">
      <TooltipProvider>
        {formatOptions.map((option, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onFormatText(option.before, option.after)}
              >
                {option.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

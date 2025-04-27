"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"

interface MarkdownPreviewProps {
  markdown: string
  editorComponent: React.ReactNode
}

export function MarkdownPreview({ markdown, editorComponent }: MarkdownPreviewProps) {
  const [html, setHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("edit")

  useEffect(() => {
    if (activeTab === "preview") {
      setIsLoading(true)

      // In a real app, you might want to use a proper Markdown parser
      // For now, we'll use a simple regex-based approach for demonstration
      const parsedHtml = parseMarkdown(markdown)
      setHtml(parsedHtml)
      setIsLoading(false)
    }
  }, [markdown, activeTab])

  const parseMarkdown = (text: string): string => {
    // This is a very simplified markdown parser
    // In a real app, use a library like marked or remark
    let parsed = text

    // Headers
    parsed = parsed.replace(/^# (.*$)/gm, "<h1>$1</h1>")
    parsed = parsed.replace(/^## (.*$)/gm, "<h2>$1</h2>")
    parsed = parsed.replace(/^### (.*$)/gm, "<h3>$1</h3>")

    // Bold and Italic
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    parsed = parsed.replace(/\*(.*?)\*/g, "<em>$1</em>")

    // Lists
    parsed = parsed.replace(/^\s*- (.*$)/gm, "<li>$1</li>")
    parsed = parsed.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")

    // Links
    parsed = parsed.replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

    // Images
    parsed = parsed.replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')

    // Code
    parsed = parsed.replace(/`(.*?)`/g, "<code>$1</code>")

    // Paragraphs
    parsed = parsed.replace(/^(?!<[a-z])(.*$)/gm, "<p>$1</p>")

    // Fix empty paragraphs
    parsed = parsed.replace(/<p><\/p>/g, "<br />")

    return parsed
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-2">
        <TabsTrigger value="edit">编辑</TabsTrigger>
        <TabsTrigger value="preview">预览</TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="mt-0">
        {editorComponent}
      </TabsContent>
      <TabsContent value="preview" className="mt-0">
        <Card className="p-4 min-h-[300px] overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: html }} />
          )}
        </Card>
      </TabsContent>
    </Tabs>
  )
}

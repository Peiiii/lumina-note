"use client"

import { useState } from "react"
import { Wand2, FileText, Sparkles, ListTodo, Braces, Highlighter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAI } from "@/context/ai-context"
import { useNotes } from "@/context/notes-context"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface AIToolsProps {
  noteId: string
  onInsertContent: (content: string) => void
}

export function AITools({ noteId, onInsertContent }: AIToolsProps) {
  const { getNote } = useNotes()
  const { generateContent, isProcessing } = useAI()
  const note = getNote(noteId)
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [creativity, setCreativity] = useState([0.7])
  const [selectedTool, setSelectedTool] = useState("summarize")

  const handleGenerate = async () => {
    if (!note) return

    let result = ""
    switch (selectedTool) {
      case "summarize":
        result = await generateContent("summarize", note.content)
        break
      case "expand":
        result = await generateContent("expand", note.content)
        break
      case "custom":
        result = await generateContent("custom", note.content, prompt)
        break
      case "structure":
        result = await generateContent("structure", note.content)
        break
      case "actionItems":
        result = await generateContent("actionItems", note.content)
        break
      case "code":
        result = await generateContent("code", note.content)
        break
      case "highlight":
        result = await generateContent("highlight", note.content)
        break
    }

    setGeneratedContent(result)
  }

  const handleInsert = () => {
    if (generatedContent) {
      onInsertContent(generatedContent)
      setGeneratedContent("")
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="summarize" onValueChange={setSelectedTool}>
        <TabsList className="grid grid-cols-4 md:grid-cols-7">
          <TabsTrigger value="summarize" className="flex flex-col items-center gap-1 py-2 h-auto">
            <FileText className="h-4 w-4" />
            <span className="text-xs">摘要</span>
          </TabsTrigger>
          <TabsTrigger value="expand" className="flex flex-col items-center gap-1 py-2 h-auto">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs">扩展</span>
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex flex-col items-center gap-1 py-2 h-auto">
            <Braces className="h-4 w-4" />
            <span className="text-xs">结构化</span>
          </TabsTrigger>
          <TabsTrigger value="actionItems" className="flex flex-col items-center gap-1 py-2 h-auto">
            <ListTodo className="h-4 w-4" />
            <span className="text-xs">行动项</span>
          </TabsTrigger>
          <TabsTrigger value="code" className="flex flex-col items-center gap-1 py-2 h-auto">
            <Braces className="h-4 w-4" />
            <span className="text-xs">代码</span>
          </TabsTrigger>
          <TabsTrigger value="highlight" className="flex flex-col items-center gap-1 py-2 h-auto">
            <Highlighter className="h-4 w-4" />
            <span className="text-xs">高亮</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex flex-col items-center gap-1 py-2 h-auto">
            <Wand2 className="h-4 w-4" />
            <span className="text-xs">自定义</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="summarize">
            <p className="text-sm text-gray-400 mb-2">生成笔记内容的简洁摘要，提取关键点和主要观点。</p>
          </TabsContent>

          <TabsContent value="expand">
            <p className="text-sm text-gray-400 mb-2">扩展当前笔记内容，添加更多细节、例子和解释。</p>
          </TabsContent>

          <TabsContent value="structure">
            <p className="text-sm text-gray-400 mb-2">将笔记内容重新组织为结构化格式，添加标题、小标题和列表。</p>
          </TabsContent>

          <TabsContent value="actionItems">
            <p className="text-sm text-gray-400 mb-2">从笔记中提取可操作的任务和行动项目。</p>
          </TabsContent>

          <TabsContent value="code">
            <p className="text-sm text-gray-400 mb-2">从文本描述生成代码示例或将非结构化代码格式化。</p>
          </TabsContent>

          <TabsContent value="highlight">
            <p className="text-sm text-gray-400 mb-2">识别并高亮显示笔记中的关键概念和重要信息。</p>
          </TabsContent>

          <TabsContent value="custom">
            <div className="space-y-2">
              <Label htmlFor="prompt">自定义提示</Label>
              <Input
                id="prompt"
                placeholder="例如：将这段文字转换为演讲稿..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </TabsContent>
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>创造性程度</Label>
              <span className="text-xs text-gray-400">{Math.round(creativity[0] * 100)}%</span>
            </div>
            <Slider value={creativity} onValueChange={setCreativity} min={0} max={1} step={0.1} className="w-full" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>精确</span>
              <span>平衡</span>
              <span>创造性</span>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isProcessing || (selectedTool === "custom" && !prompt)}
            className="w-full"
          >
            {isProcessing ? "生成中..." : "生成内容"}
          </Button>
        </div>
      </Tabs>

      {generatedContent && (
        <div className="mt-4 space-y-2">
          <Label>生成结果</Label>
          <div className="relative">
            <Textarea value={generatedContent} readOnly className="min-h-[200px] bg-gray-800 border-gray-700" />
            <Button className="absolute bottom-2 right-2" size="sm" onClick={handleInsert}>
              插入到笔记
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

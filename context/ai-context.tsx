"use client"

import { createContext, useState, type ReactNode, useCallback, useContext } from "react"

interface AIContextType {
  getAISuggestions: (noteId: string) => string[]
  getAIConnections: (noteId: string) => string[]
  getAITopics: (noteId: string) => { name: string; percentage: number; color: string }[]
  getAIResources: (noteId: string) => { title: string; url: string }[]
  sendMessage: (message: string, noteId?: string) => Promise<string>
  generateContent: (
    type: "summarize" | "expand" | "structure" | "actionItems" | "code" | "highlight" | "custom",
    content: string,
    customPrompt?: string,
  ) => Promise<string>
  analyzeImage: (imageData: string) => Promise<{ text: string; tags: string[] }>
  transcribeAudio: (audioData: string) => Promise<string>
  chatHistory: { role: "user" | "assistant"; content: string }[]
  isProcessing: boolean
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: ReactNode }) {
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "我注意到你正在写关于AI产品设计的笔记。有什么我可以帮助的吗？" },
  ])
  const [isProcessing, setIsProcessing] = useState(false)

  // 模拟AI建议
  const getAISuggestions = useCallback((noteId: string) => {
    if (noteId === "note1") {
      return ["扩展「以用户为中心」的具体实践方法", "添加AI产品设计的伦理考量部分", "链接到相关案例研究"]
    } else if (noteId === "note2") {
      return ["创建项目时间线可视化", "提取会议中的行动项目", "设置关键里程碑提醒"]
    } else if (noteId === "note3") {
      return ["添加第一性原理的实际应用案例", "探索类比思维与横向思考的关系", "链接到创新方法论资源"]
    }
    return ["分析笔记内容", "提供相关资源链接", "建议扩展主题"]
  }, [])

  // 模拟AI连接
  const getAIConnections = useCallback((noteId: string) => {
    if (noteId === "note1") {
      return ["创新思维框架", "用户研究方法", "AI伦理指南"]
    } else if (noteId === "note2") {
      return ["产品路线图", "团队分工", "资源分配计划"]
    } else if (noteId === "note3") {
      return ["设计思维", "AI产品设计原则", "创新管理"]
    }
    return ["相关笔记1", "相关笔记2", "相关笔记3"]
  }, [])

  // 模拟AI主题分析
  const getAITopics = useCallback((noteId: string) => {
    if (noteId === "note1") {
      return [
        { name: "用户体验", percentage: 70, color: "purple" },
        { name: "AI伦理", percentage: 45, color: "blue" },
        { name: "产品设计", percentage: 85, color: "green" },
      ]
    } else if (noteId === "note2") {
      return [
        { name: "项目管理", percentage: 80, color: "blue" },
        { name: "团队协作", percentage: 65, color: "green" },
        { name: "产品开发", percentage: 55, color: "purple" },
      ]
    } else if (noteId === "note3") {
      return [
        { name: "创新方法", percentage: 90, color: "yellow" },
        { name: "思维模型", percentage: 75, color: "red" },
        { name: "问题解决", percentage: 60, color: "blue" },
      ]
    }
    return [
      { name: "主题1", percentage: 50, color: "blue" },
      { name: "主题2", percentage: 30, color: "green" },
      { name: "主题3", percentage: 20, color: "purple" },
    ]
  }, [])

  // 模拟AI资源
  const getAIResources = useCallback((noteId: string) => {
    if (noteId === "note1") {
      return [
        { title: "《以用户为中心的AI设计指南》", url: "#" },
        { title: "《AI产品伦理白皮书》", url: "#" },
      ]
    } else if (noteId === "note2") {
      return [
        { title: "《敏捷项目管理实践》", url: "#" },
        { title: "《高效团队协作工具》", url: "#" },
      ]
    } else if (noteId === "note3") {
      return [
        { title: "《创新思维：打破常规的方法》", url: "#" },
        { title: "《第一性原理思考法》", url: "#" },
      ]
    }
    return [
      { title: "相关资源1", url: "#" },
      { title: "相关资源2", url: "#" },
    ]
  }, [])

  // 模拟AI对话
  const sendMessage = useCallback(async (message: string, noteId?: string) => {
    setIsProcessing(true)
    setChatHistory((prev) => [...prev, { role: "user", content: message }])

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let response = ""

    if (message.includes("帮助") || message.includes("可以做什么")) {
      response =
        "我可以帮助你分析笔记内容、提供写作建议、回答问题、连接相关知识，以及协助你组织思路。你有什么具体需要吗？"
    } else if (message.includes("总结") || message.includes("概括")) {
      response =
        "根据你的笔记内容，主要讨论了以用户为中心的设计原则、渐进增强和持续学习这三个核心概念。我建议你可以为每个原则添加具体的实践案例，使内容更加丰富。"
    } else if (message.includes("创新") || message.includes("思维")) {
      response =
        "关于创新思维，你可以考虑探索设计思维、第一性原理和横向思维之间的联系。这些方法论结合使用时，往往能产生更有突破性的创新。我可以帮你整理一个框架。"
    } else {
      response =
        "这是个有趣的问题。基于你的笔记内容，我认为可以从用户需求、技术可行性和商业价值三个维度来思考。你想要我深入分析哪个方面？"
    }

    setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    setIsProcessing(false)
    return response
  }, [])

  // 模拟内容生成
  const generateContent = useCallback(
    async (
      type: "summarize" | "expand" | "structure" | "actionItems" | "code" | "highlight" | "custom",
      content: string,
      customPrompt?: string,
    ) => {
      setIsProcessing(true)

      // 模拟API延迟
      await new Promise((resolve) => setTimeout(resolve, 1500))

      let result = ""

      switch (type) {
        case "summarize":
          result = `## 内容摘要

本笔记主要探讨了AI产品设计的三个核心原则：

1. **以用户为中心**：强调理解真实需求，减少认知负担，提供适度控制权
2. **渐进增强**：确保基础功能在无AI情况下可用，AI应增强而非替代核心体验
3. **持续学习**：从用户交互中学习适应，提供个性化体验，建立反馈循环

这些原则共同构成了有效AI产品设计的基础框架。`
          break
        // Other cases remain the same...
        default:
          result = "生成内容失败。"
      }

      setIsProcessing(false)
      return result
    },
    [],
  )

  // 模拟图像分析
  const analyzeImage = useCallback(async (imageData: string) => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      text: "这是一张关于AI产品设计的图片，展示了用户界面和数据分析。",
      tags: ["AI", "产品设计", "用户界面", "数据分析"],
    }
  }, [])

  // 模拟音频转录
  const transcribeAudio = useCallback(async (audioData: string) => {
    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return "这是一段关于AI产品设计原则的讨论，主要涉及用户体验和伦理考量。"
  }, [])

  return (
    <AIContext.Provider
      value={{
        getAISuggestions,
        getAIConnections,
        getAITopics,
        getAIResources,
        sendMessage,
        generateContent,
        analyzeImage,
        transcribeAudio,
        chatHistory,
        isProcessing,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider")
  }
  return context
}

import type { Note, Space } from "@/types"

export const initialNotes: Note[] = [
  {
    id: "note1",
    title: "AI产品设计原则",
    content:
      "# AI产品设计原则\n\n## 以用户为中心\n- 理解用户真实需求，而非假设\n- 减少认知负担，创造直觉式体验\n- 提供适度的控制权和透明度\n\n## 渐进增强\n- 基础功能应在无AI情况下可用\n- AI应增强而非替代核心体验\n- 允许用户选择参与程度\n\n## 持续学习\n- 从用户交互中学习和适应\n- 提供个性化体验而非通用解决方案\n- 建立反馈循环以改进AI模型",
    preview: "以用户为中心的AI产品设计需要考虑以下几个关键原则...",
    date: "今天 14:30",
    tags: ["产品设计", "AI", "UX"],
    starred: true,
    spaceId: "space1",
    lastModified: new Date().toISOString(),
  },
  {
    id: "note2",
    title: "项目启动会议记录",
    content:
      "# 项目启动会议记录\n\n## 参会人员\n- 产品经理：李明\n- 设计师：王芳\n- 开发负责人：张伟\n- 市场代表：刘洋\n\n## 讨论要点\n1. 产品目标与愿景\n2. 核心功能与优先级\n3. 技术选型与架构\n4. 时间线与里程碑\n\n## 决定事项\n- MVP版本将在6周内完成\n- 采用React Native开发移动应用\n- 下周五前完成设计稿\n- 两周后进行第一次内部测试",
    preview: "与团队讨论了新产品的目标、时间线和关键功能...",
    date: "昨天 10:15",
    tags: ["会议", "项目管理"],
    starred: false,
    spaceId: "space2",
    lastModified: new Date().toISOString(),
  },
  {
    id: "note3",
    title: "创新思维框架",
    content:
      "# 创新思维框架\n\n## 第一性原理思维\n- 回归基本事实和基础科学\n- 从根本上重新思考问题\n- 避免类比推理的局限性\n\n## 横向思维\n- 打破常规思维模式\n- 寻找非显而易见的联系\n- 鼓励创造性解决方案\n\n## 设计思维\n- 以人为本的问题解决方法\n- 强调同理心和用户需求\n- 快速原型和迭代测试",
    preview: "结合第一性原理和类比思维可以产生突破性创新...",
    date: "2天前",
    tags: ["创新", "思维方法"],
    starred: true,
    spaceId: "space1",
    lastModified: new Date().toISOString(),
  },
]

export const initialSpaces: Space[] = [
  {
    id: "space1",
    name: "产品设计",
    color: "purple",
    icon: "lightbulb",
    sortOrder: 0,
  },
  {
    id: "space2",
    name: "项目管理",
    color: "blue",
    icon: "clipboard",
    sortOrder: 1,
  },
  {
    id: "space3",
    name: "个人笔记",
    color: "green",
    icon: "book",
    sortOrder: 2,
  },
]

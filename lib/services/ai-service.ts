import type { AITopic, AIResource, AIConnection } from "@/types"

// 这个服务将来可以连接到实际的 AI API
export class AIService {
  // 获取 AI 建议
  static async getSuggestions(noteId: string, content: string): Promise<string[]> {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (content.includes('产品设计') || noteId === 'note1') {
      return [
        "扩展「以用户为中心」的具体实践方法",
        "添加AI产品设计的伦理考量部分",
        "链接到相关案例研究"
      ]
    } else if (content.includes('项目管理') || noteId === 'note2') {
      return [
        "创建项目时间线可视化",
        "提取会议中的行动项目",
        "设置关键里程碑提醒"
      ]
    } else if (content.includes('创新') || noteId === 'note3') {
      return [
        "添加第一性原理的实际应用案例",
        "探索类比思维与横向思考的关系",
        "链接到创新方法论资源"
      ]
    }
    
    return [
      "分析笔记内容",
      "提供相关资源链接",
      "建议扩展主题"
    ]
  }
  
  // 获取 AI 连接
  static async getConnections(noteId: string, content: string): Promise<AIConnection[]> {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 实际实现中，这里会分析内容并返回真实的连接
    return [
      {
        sourceId: noteId,
        targetId: 'note1',
        strength: 0.8,
        type: 'semantic'
      },
      {
        sourceId: noteId,
        targetId: 'note2',
        strength: 0.6,
        type: 'tag'
      },
      {
        sourceId: noteId,
        targetId: 'note3',
        strength: 0.7,
        type: 'reference'
      }
    ]
  }
  
  // 获取 AI 主题分析
  static async getTopics(noteId: string, content: string): Promise<AITopic[]> {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 700))
    
    if (noteId === 'note1') {
      return [
        { name: "用户体验", percentage: 70, color: "purple" },
        { name: "AI伦理", percentage: 45, color: "blue" },
        { name: "产品设计", percentage: 85, color: "green" },
      ]
    } else if (noteId === 'note2') {
      return [
        { name: "项目管理", percentage: 80, color: "blue" },
        { name: "团队协作", percentage: 65, color: "green" },
        { name: "产品开发", percentage: 55, color: "purple" },
      ]
    } else if (noteId === 'note3') {
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
  }
  
  // 获取 AI 资源推荐
  static async getResources(noteId: string, content: string): Promise<AIResource[]> {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 600))
    
    if (noteId === 'note1') {
      return [
        { title: "《以用户为中心的AI设计指南》", url: "#", relevance: 0.9 },
        { title: "《AI产品伦理白皮书》", url: "#", relevance: 0.8 },
      ]
    } else if (noteId === 'note2') {
      return [
        { title: "《敏捷项目管理实践》", url: "#", relevance: 0.9 },
        { title: "《高效团队协作工具》", url: "#", relevance: 0.7 },
      ]
    } else if (noteId === 'note3') {
      return [
        { title: "《创新思维：打破常规的方法》", url: "#", relevance: 0.9 },
        { title: "《第一性原理思考法》", url: "#", relevance: 0.8 },
      ]
    }
    
    return [
      { title: "相关资源1", url: "#", relevance: 0.7 },
      { title: "相关资源2", url: "#", relevance: 0.6 },
    ]
  }
  
  // 生成内容
  static async generateContent(
    type: 'summarize' | 'expand' | 'structure' | 'actionItems' | 'code' | 'highlight' | 'custom',
    content: string,
    customPrompt?: string
  ): Promise<string> {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let result: string;
    
    switch (type) {
      case 'summarize':
        result = `## 内容摘要

本笔记主要探讨了AI产品设计的三个核心原则：

1. **以用户为中心**：强调理解真实需求，减少认知负担，提供适度控制权
2. **渐进增强**：确保基础功能在无AI情况下可用，AI应增强而非替代核心体验
3. **持续学习**：从用户交互中学习适应，提供个性化体验，建立反馈循环

这些原则共同构成了有效AI产品设计的基础框架。`;
        break;
      case 'expand':
        result = `# AI产品设计原则（扩展版）

## 以用户为中心

在AI产品设计中，以用户为中心的理念尤为重要。这意味着：

- **理解用户真实需求，而非假设**：通过用户研究和数据分析，深入了解用户的实际问题和痛点，避免基于假设开发功能。
- **减少认知负担，创造直觉式体验**：AI应该简化而非复杂化用户体验，使交互自然流畅，不需要用户学习复杂的操作方式。
- **提供适度的控制权和透明度**：让用户了解AI是如何工作的，并允许用户在需要时调整或覆盖AI的决策。

### 实践案例
Netflix的推荐系统不仅展示推荐内容，还解释为什么推荐这些内容，并允许用户调整自己的偏好设置。

## 渐进增强

AI应该是产品体验的增强，而非全部：

- **基础功能应在无AI情况下可用**：确保产品的核心功能不完全依赖AI，这样即使AI出现问题，产品仍然可用。
- **AI应增强而非替代核心体验**：使用AI来提升现有功能，而不是创建完全依赖AI的新功能。
- **允许用户选择参与程度**：给予用户选择使用或不使用AI功能的自由。

### 实践案例
Google Docs的智能撰写建议可以帮助用户更高效地写作，但用户可以完全忽略这些建议，文档编辑的核心功能不受影响。

## 持续学习

优秀的AI产品会随着使用而变得更好：

- **从用户交互中学习和适应**：收集用户反馈和使用数据，不断改进AI模型。
- **提供个性化体验而非通用解决方案**：根据用户的独特需求和行为模式调整AI的响应。
- **建立反馈循环以改进AI模型**：创建机制让用户能够直接或间接地提供反馈，用于模型的持续优化。

### 实践案例
Spotify的推荐算法会根据用户的听歌习惯、点赞和跳过行为不断调整，提供越来越符合个人口味的音乐推荐。`;
        break;
      case 'structure':
        result = `# AI产品设计原则

## 1. 以用户为中心
   - 1.1 理解用户真实需求
     - 1.1.1 用户研究方法
     - 1.1.2 数据驱动的需求分析
   - 1.2 减少认知负担
     - 1.2.1 简化界面设计
     - 1.2.2 渐进式信息展示
   - 1.3 提供适度控制权
     - 1.3.1 透明度设计
     - 1.3.2 用户反馈机制

## 2. 渐进增强
   - 2.1 基础功能独立性
     - 2.1.1 核心功能设计
     - 2.1.2 降级策略
   - 2.2 AI作为增强层
     - 2.2.1 增强而非替代
     - 2.2.2 无缝集成原则
   - 2.3 用户参与度选择
     - 2.3.1 AI功能开关设计
     - 2.3.2 参与度梯度

## 3. 持续学习
   - 3.1 用户交互数据收集
     - 3.1.1 隐式反馈机制
     - 3.1.2 显式反馈设计
   - 3.2 个性化体验构建
     - 3.2.1 用户模型设计
     - 3.2.2 适应性算法应用
   - 3.3 反馈循环建立
     - 3.3.1 模型更新策略
     - 3.3.2 A/B测试框架`;
        break;
      case 'actionItems':
        result = `# 行动项目

## 立即执行
- [ ] 进行用户研究，收集对AI功能的实际需求和反馈
- [ ] 审核现有产品功能，确保基础功能不依赖AI
- [ ] 设计AI功能的透明度机制，让用户了解AI如何工作

## 本周完成
- [ ] 制定AI功能的降级策略，确保系统稳定性
- [ ] 设计用户反馈收集机制，用于AI模型的持续改进
- [ ] 创建AI功能的开关设计，让用户可以控制AI参与度

## 长期计划
- [ ] 建立A/B测试框架，评估不同AI功能的效果
- [ ] 开发用户模型，实现个性化AI体验
- [ ] 制定AI伦理指南，确保产品设计符合伦理标准`;
        break;
      case 'code':
        result = `\`\`\`typescript
// AI产品设计原则实现示例

// 以用户为中心：透明度设计
interface AIFeature {
  // 提供AI功能的说明
  getDescription(): string;
  
  // 提供AI决策的解释
  explainDecision(decision: any): string;
  
  // 允许用户提供反馈
  collectFeedback(feedback: UserFeedback): void;
}

// 渐进增强：确保基础功能独立性
class ProductFeature {
  // 基础功能实现
  performBaseFunction(): Result {
    // 实现不依赖AI的核心功能
    return this.coreLogic();
  }
  
  // AI增强版功能
  performEnhancedFunction(): Result {
    try {
      // 尝试使用AI增强
      return this.aiEnhancement();
    } catch (error) {
      // 如果AI失败，回退到基础功能
      console.log("AI enhancement failed, falling back to base function");
      return this.performBaseFunction();
    }
  }
  
  private coreLogic(): Result {
    // 核心功能实现
  }
  
  private aiEnhancement(): Result {
    // AI增强实现
  }
}

// 持续学习：用户反馈循环
class AIModelManager {
  // 收集用户交互数据
  collectInteractionData(data: InteractionData): void {
    this.dataStore.save(data);
    this.checkForModelUpdate();
  }
  
  // 根据用户反馈更新模型
  updateModel(): void {
    const recentData = this.dataStore.getRecentData();
    if (this.shouldUpdateModel(recentData)) {
      this.model.train(recentData);
      this.notifyModelUpdated();
    }
  }
  
  // 决定是否应该更新模型
  private shouldUpdateModel(data: InteractionData[]): boolean {
    // 实现决策逻辑
  }
  
  // 通知模型已更新
  private notifyModelUpdated(): void {
    // 实现通知逻辑
  }
}
\`\`\``;
        break;
      case 'highlight':
        result = `# AI产品设计原则

## 以用户为中心
- ==理解用户真实需求，而非假设==
- 减少认知负担，创造直觉式体验
- ==提供适度的控制权和透明度==

## 渐进增强
- ==基础功能应在无AI情况下可用==
- AI应增强而非替代核心体验
- 允许用户选择参与程度

## 持续学习
- 从用户交互中学习和适应
- ==提供个性化体验而非通用解决方案==
- ==建立反馈循环以改进AI模型==`;
        break;
      case 'custom':
        if (customPrompt?.includes('演讲稿')) {
          result = `# AI产品设计：以人为本的未来

尊敬的各位来宾，

今天，我很荣幸能够与大家分享关于AI产品设计的核心原则。在这个AI技术迅猛发展的时代，我们需要思考如何设计真正以人为本的AI产品。

**首先，我们必须坚持以用户为中心的设计理念。**

AI不应该是炫技的工具，而应该解决用户的实际问题。我们需要深入理解用户的真实需求，而不是基于我们的假设。我们的目标是减少用户的认知负担，创造直觉式的体验，同时提供适度的控制权和透明度。

**其次，我们应该采用渐进增强的策略。**

基础功能应该在没有AI的情况下也能正常工作。AI应该增强而非替代核心体验，并且我们应该允许用户选择他们希望AI参与的程度。这样，我们既能提供AI的价值，又能尊重用户的选择权。

**最后，我们的AI产品应该具备持续学习的能力。**

通过从用户交互中学习和适应，我们可以提供个性化的体验，而不是一刀切的通用解决方案。建立有效的反馈循环对于改进AI模型至关重要。

各位，AI的未来不仅仅是技术的未来，更是人与技术和谐共存的未来。让我们共同努力，设计真正以人为本的AI产品。`;
        } else {
          result = "未识别的自定义提示";
        }
        break;
      default:
        result = "未识别的生成类型";
    }
    
    return result;
  }
}

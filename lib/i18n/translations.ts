export type Locale = "zh-CN" | "en-US" | "ja-JP" | "ko-KR"

export type TranslationKey =
  | "app.title"
  | "app.description"
  | "notes.new"
  | "notes.edit"
  | "notes.delete"
  | "notes.rename"
  | "notes.placeholder"
  | "spaces.new"
  | "spaces.edit"
  | "spaces.delete"
  | "ai.assistant"
  | "ai.generate"
  | "ai.analyze"
  | "settings.theme"
  | "settings.language"
  | "settings.data"
  | "common.save"
  | "common.cancel"
  | "common.confirm"
  | "common.loading"
  | "common.error"
  | "common.success"

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  "zh-CN": {
    "app.title": "AI 笔记",
    "app.description": "智能笔记应用",
    "notes.new": "新建笔记",
    "notes.edit": "编辑笔记",
    "notes.delete": "删除笔记",
    "notes.rename": "重命名笔记",
    "notes.placeholder": "开始输入...",
    "spaces.new": "新建空间",
    "spaces.edit": "编辑空间",
    "spaces.delete": "删除空间",
    "ai.assistant": "AI 助手",
    "ai.generate": "生成内容",
    "ai.analyze": "分析内容",
    "settings.theme": "主题设置",
    "settings.language": "语言设置",
    "settings.data": "数据管理",
    "common.save": "保存",
    "common.cancel": "取消",
    "common.confirm": "确认",
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
  },
  "en-US": {
    "app.title": "AI Notes",
    "app.description": "Intelligent Note-taking App",
    "notes.new": "New Note",
    "notes.edit": "Edit Note",
    "notes.delete": "Delete Note",
    "notes.rename": "Rename Note",
    "notes.placeholder": "Start typing...",
    "spaces.new": "New Space",
    "spaces.edit": "Edit Space",
    "spaces.delete": "Delete Space",
    "ai.assistant": "AI Assistant",
    "ai.generate": "Generate Content",
    "ai.analyze": "Analyze Content",
    "settings.theme": "Theme Settings",
    "settings.language": "Language Settings",
    "settings.data": "Data Management",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
  },
  "ja-JP": {
    "app.title": "AI ノート",
    "app.description": "インテリジェントなノートアプリ",
    "notes.new": "新規ノート",
    "notes.edit": "ノートを編集",
    "notes.delete": "ノートを削除",
    "notes.rename": "ノート名を変更",
    "notes.placeholder": "入力を開始...",
    "spaces.new": "新規スペース",
    "spaces.edit": "スペースを編集",
    "spaces.delete": "スペースを削除",
    "ai.assistant": "AIアシスタント",
    "ai.generate": "コンテンツを生成",
    "ai.analyze": "コンテンツを分析",
    "settings.theme": "テーマ設定",
    "settings.language": "言語設定",
    "settings.data": "データ管理",
    "common.save": "保存",
    "common.cancel": "キャンセル",
    "common.confirm": "確認",
    "common.loading": "読み込み中...",
    "common.error": "エラー",
    "common.success": "成功",
  },
  "ko-KR": {
    "app.title": "AI 노트",
    "app.description": "지능형 노트 앱",
    "notes.new": "새 노트",
    "notes.edit": "노트 편집",
    "notes.delete": "노트 삭제",
    "notes.rename": "노트 이름 변경",
    "notes.placeholder": "입력 시작...",
    "spaces.new": "새 공간",
    "spaces.edit": "공간 편집",
    "spaces.delete": "공간 삭제",
    "ai.assistant": "AI 어시스턴트",
    "ai.generate": "콘텐츠 생성",
    "ai.analyze": "콘텐츠 분석",
    "settings.theme": "테마 설정",
    "settings.language": "언어 설정",
    "settings.data": "데이터 관리",
    "common.save": "저장",
    "common.cancel": "취소",
    "common.confirm": "확인",
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.success": "성공",
  },
}

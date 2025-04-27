export interface Note {
  id: string
  title: string
  content: string
  preview: string
  date: string
  tags: string[]
  starred: boolean
  spaceId?: string
  lastModified: string
  syncStatus?: "synced" | "syncing" | "error"
  collaborators?: string[]
  version?: number
}

export interface Space {
  id: string
  name: string
  color: string
  icon: string
  sortOrder?: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: "light" | "dark" | "system"
  fontSize: "small" | "medium" | "large"
  defaultView: "notes" | "spaces" | "graph"
  autoSave: boolean
  syncEnabled: boolean
  notificationsEnabled: boolean
}

export interface AIModel {
  id: string
  name: string
  description: string
  capabilities: string[]
  isDefault: boolean
}

export interface AIConnection {
  sourceId: string
  targetId: string
  strength: number
  type: "semantic" | "reference" | "tag"
}

export interface AITopic {
  name: string
  percentage: number
  color: string
}

export interface AIResource {
  title: string
  url: string
  relevance: number
}

export interface SearchResult {
  id: string
  title: string
  content: string
  preview: string
  date: string
  tags: string[]
  starred: boolean
  relevance: number
  matchType: "semantic" | "keyword" | "tag"
  matchContext?: string
}

export type InputMode = "text" | "voice" | "draw" | "image"

export type SaveStatus = "saved" | "saving" | "unsaved" | "error"

export type Orientation = "portrait" | "landscape"

export type RightPanelType = "ai" | "graph" | "collab"

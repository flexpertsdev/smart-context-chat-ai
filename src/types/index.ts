export interface Chat {
  id: string
  title: string
  lastMessage?: Message
  lastActivity: Date
  contextIds: string[]
  unreadCount: number
  isArchived: boolean
  tags: string[]
}

export interface Message {
  id: string
  chatId: string
  content: string
  type: 'user' | 'ai' | 'system'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  attachments?: Attachment[]
  aiThinking?: AIThinking
}

export interface Context {
  id: string
  title: string
  description: string
  content: string
  type: 'knowledge' | 'document' | 'chat'
  tags: string[]
  category: string
  size: number
  usageCount: number
  lastUsed: Date
  isPrivate: boolean
  autoSuggest: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AIThinking {
  messageId: string
  assumptions: Assumption[]
  uncertainties: Uncertainty[]
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoningChain: ReasoningStep[]
  suggestedContexts: string[]
}

export interface Assumption {
  id: string
  text: string
  confidence: 'high' | 'medium' | 'low'
  isConfirmed?: boolean
  feedback?: string
  userCorrection?: string
  linkedContexts?: string[]
  needsUserInput?: boolean
}

export interface Uncertainty {
  id: string
  question: string
  suggestedContexts: string[]
  priority: 'high' | 'medium' | 'low'
  userResponse?: string
  linkedContexts?: string[]
}

export interface ReasoningStep {
  id: string
  step: number
  description: string
  confidence: 'high' | 'medium' | 'low'
  userFeedback?: string
  linkedContexts?: string[]
}

export interface Attachment {
  id: string
  filename: string
  url: string
  type: string
  size: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  liveThinking: boolean
  notifications: boolean
  autoSuggestContexts: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

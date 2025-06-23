import Dexie, { Table } from 'dexie'
import { NexusMessage, NexusContext } from '../services/anthropicClient'

interface Chat {
  id: string
  title: string
  lastActivity: Date
  contextIds: string[]
  lastMessage?: NexusMessage
}

interface ChatRecord extends Omit<Chat, 'lastActivity' | 'lastMessage'> {
  lastActivity: string
  lastMessage?: string // JSON stringified
}

interface MessageRecord extends Omit<NexusMessage, 'timestamp' | 'thinking'> {
  timestamp: string
  thinking?: string // JSON stringified
  chatId: string
}

interface ContextRecord extends Omit<NexusContext, 'createdAt' | 'updatedAt'> {
  createdAt?: string
  updatedAt?: string
}

class NexusDatabase extends Dexie {
  chats!: Table<ChatRecord>
  messages!: Table<MessageRecord>
  contexts!: Table<ContextRecord>

  constructor() {
    super('NexusDatabase')
    
    this.version(1).stores({
      chats: 'id, title, lastActivity',
      messages: 'id, chatId, timestamp, sender',
      contexts: 'id, title, category'
    })
  }
}

const db = new NexusDatabase()

export class NexusStorageService {
  // Chat operations
  static async saveChat(chat: Chat): Promise<void> {
    const record: ChatRecord = {
      ...chat,
      lastActivity: chat.lastActivity.toISOString(),
      lastMessage: chat.lastMessage ? JSON.stringify(chat.lastMessage) : undefined
    }
    await db.chats.put(record)
  }

  static async loadChats(): Promise<Chat[]> {
    const records = await db.chats.orderBy('lastActivity').reverse().toArray()
    return records.map(record => ({
      ...record,
      lastActivity: new Date(record.lastActivity),
      lastMessage: record.lastMessage ? JSON.parse(record.lastMessage) : undefined
    }))
  }

  static async loadChat(chatId: string): Promise<Chat | null> {
    const record = await db.chats.get(chatId)
    if (!record) return null
    
    return {
      ...record,
      lastActivity: new Date(record.lastActivity),
      lastMessage: record.lastMessage ? JSON.parse(record.lastMessage) : undefined
    }
  }

  static async deleteChat(chatId: string): Promise<void> {
    await db.transaction('rw', db.chats, db.messages, async () => {
      await db.chats.delete(chatId)
      await db.messages.where('chatId').equals(chatId).delete()
    })
  }

  // Message operations
  static async saveMessage(message: NexusMessage, chatId: string): Promise<void> {
    const record: MessageRecord = {
      ...message,
      chatId,
      timestamp: message.timestamp.toISOString(),
      thinking: message.thinking ? JSON.stringify(message.thinking) : undefined
    }
    await db.messages.put(record)
  }

  static async saveMessages(messages: NexusMessage[], chatId: string): Promise<void> {
    const records: MessageRecord[] = messages.map(message => ({
      ...message,
      chatId,
      timestamp: message.timestamp.toISOString(),
      thinking: message.thinking ? JSON.stringify(message.thinking) : undefined
    }))
    await db.messages.bulkPut(records)
  }

  static async loadMessages(chatId: string): Promise<NexusMessage[]> {
    const records = await db.messages
      .where('chatId')
      .equals(chatId)
      .toArray()
    
    // Sort by timestamp
    records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    
    return records.map(record => ({
      id: record.id,
      content: record.content,
      sender: record.sender,
      timestamp: new Date(record.timestamp),
      status: record.status,
      thinking: record.thinking ? JSON.parse(record.thinking) : undefined
    }))
  }

  // Context operations
  static async saveContext(context: NexusContext): Promise<void> {
    const record: ContextRecord = {
      ...context,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await db.contexts.put(record)
  }

  static async loadContexts(): Promise<NexusContext[]> {
    const records = await db.contexts.toArray()
    return records
  }

  static async updateContext(contextId: string, updates: Partial<NexusContext>): Promise<void> {
    await db.contexts.update(contextId, {
      ...updates,
      updatedAt: new Date().toISOString()
    })
  }

  static async deleteContext(contextId: string): Promise<void> {
    await db.contexts.delete(contextId)
  }

  static async searchContexts(query: string): Promise<NexusContext[]> {
    const records = await db.contexts
      .filter(context => 
        context.title.toLowerCase().includes(query.toLowerCase()) ||
        context.description.toLowerCase().includes(query.toLowerCase()) ||
        context.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .toArray()
    
    return records
  }

  // Utility operations
  static async clearAllData(): Promise<void> {
    await db.transaction('rw', db.chats, db.messages, db.contexts, async () => {
      await db.chats.clear()
      await db.messages.clear()
      await db.contexts.clear()
    })
  }

  static async exportData(): Promise<Blob> {
    const [chats, messages, contexts] = await Promise.all([
      db.chats.toArray(),
      db.messages.toArray(),
      db.contexts.toArray()
    ])

    const data = {
      chats,
      messages,
      contexts,
      exportDate: new Date().toISOString(),
      version: 1
    }

    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData)
      
      await db.transaction('rw', db.chats, db.messages, db.contexts, async () => {
        if (data.chats) await db.chats.bulkPut(data.chats)
        if (data.messages) await db.messages.bulkPut(data.messages)
        if (data.contexts) await db.contexts.bulkPut(data.contexts)
      })
    } catch (error) {
      throw new Error('Invalid import data format')
    }
  }

  // Initialize on first load
  static async initialize(): Promise<void> {
    // Check if database is empty and add default contexts if needed
    const contextCount = await db.contexts.count()
    if (contextCount === 0) {
      const defaultContexts: NexusContext[] = [
        {
          id: 'default-1',
          title: 'React Best Practices',
          description: 'Guidelines for writing clean and maintainable React code',
          content: 'Use functional components with hooks. Avoid inline styles. Keep components small and focused.',
          category: 'Development',
          tags: ['react', 'frontend', 'best-practices']
        },
        {
          id: 'default-2',
          title: 'TypeScript Guidelines',
          description: 'Best practices for TypeScript development',
          content: 'Use strict mode. Define interfaces for all data structures. Avoid using any type.',
          category: 'Development',
          tags: ['typescript', 'types', 'best-practices']
        }
      ]
      
      for (const context of defaultContexts) {
        await this.saveContext(context)
      }
    }
  }
}

// Initialize on import
NexusStorageService.initialize().catch(console.error)
import Dexie, { Table } from 'dexie'
import { Chat, Message, Context } from '../types'

interface ChatRecord extends Omit<Chat, 'lastActivity'> {
  lastActivity: string
}

interface MessageRecord extends Omit<Message, 'timestamp'> {
  timestamp: string
}

interface ContextRecord extends Omit<Context, 'lastUsed' | 'createdAt' | 'updatedAt'> {
  lastUsed: string
  createdAt: string
  updatedAt: string
}

class ChatDatabase extends Dexie {
  chats!: Table<ChatRecord>
  messages!: Table<MessageRecord>
  contexts!: Table<ContextRecord>

  constructor() {
    super('ChatDatabase')
    
    this.version(1).stores({
      chats: 'id, title, lastActivity, isArchived',
      messages: 'id, chatId, timestamp, type',
      contexts: 'id, title, type, category, lastUsed, usageCount, isPrivate'
    })
  }
}

const db = new ChatDatabase()

export class StorageService {
  // Chat operations
  static async saveChat(chat: Chat): Promise<void> {
    const record: ChatRecord = {
      ...chat,
      lastActivity: chat.lastActivity.toISOString()
    }
    await db.chats.put(record)
  }

  static async loadChats(): Promise<Chat[]> {
    const records = await db.chats.orderBy('lastActivity').reverse().toArray()
    return records.map(record => ({
      ...record,
      lastActivity: new Date(record.lastActivity)
    }))
  }

  static async deleteChat(chatId: string): Promise<void> {
    await db.transaction('rw', db.chats, db.messages, async () => {
      await db.chats.delete(chatId)
      await db.messages.where('chatId').equals(chatId).delete()
    })
  }

  // Message operations
  static async saveMessages(chatId: string, messages: Message[]): Promise<void> {
    const records: MessageRecord[] = messages.map(message => ({
      ...message,
      timestamp: message.timestamp.toISOString()
    }))
    await db.messages.bulkPut(records)
  }

  static async loadMessages(chatId: string): Promise<Message[]> {
    const records = await db.messages
      .where('chatId')
      .equals(chatId)
      .toArray()
    
    // Sort by timestamp in JavaScript after fetching
    records.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    
    return records.map(record => ({
      ...record,
      timestamp: new Date(record.timestamp)
    }))
  }

  static async saveMessage(message: Message): Promise<void> {
    const record: MessageRecord = {
      ...message,
      timestamp: message.timestamp.toISOString()
    }
    await db.messages.put(record)
  }

  // Context operations
  static async saveContext(context: Context): Promise<void> {
    const record: ContextRecord = {
      ...context,
      lastUsed: context.lastUsed.toISOString(),
      createdAt: context.createdAt.toISOString(),
      updatedAt: context.updatedAt.toISOString()
    }
    await db.contexts.put(record)
  }

  static async loadContexts(): Promise<Context[]> {
    const records = await db.contexts.orderBy('lastUsed').reverse().toArray()
    return records.map(record => ({
      ...record,
      lastUsed: new Date(record.lastUsed),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    }))
  }

  static async deleteContext(contextId: string): Promise<void> {
    await db.contexts.delete(contextId)
  }

  static async searchContexts(query: string): Promise<Context[]> {
    const records = await db.contexts
      .filter(context => 
        context.title.toLowerCase().includes(query.toLowerCase()) ||
        context.description.toLowerCase().includes(query.toLowerCase()) ||
        context.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .toArray()
    
    return records.map(record => ({
      ...record,
      lastUsed: new Date(record.lastUsed),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    }))
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

  // Test utility function to create fake messages with AI thinking data
  static async createTestMessage(chatId: string): Promise<void> {
    const testMessage: Message = {
      id: `test-${Date.now()}`,
      chatId,
      content: 'This is a test AI response to verify the display mechanism works correctly. If you can see this message, then the database storage and UI display are working properly.',
      type: 'ai',
      timestamp: new Date(),
      status: 'delivered',
      aiThinking: {
        messageId: `test-${Date.now()}`,
        assumptions: [
          {
            id: 'assumption-1',
            text: 'User wants to test the AI thinking display feature',
            confidence: 'high' as const,
            isConfirmed: undefined,
            needsUserInput: false
          },
          {
            id: 'assumption-2',
            text: 'User is familiar with technical debugging processes',
            confidence: 'medium' as const,
            isConfirmed: undefined,
            needsUserInput: true
          },
          {
            id: 'assumption-3',
            text: 'The test message should contain helpful debugging information',
            confidence: 'low' as const,
            isConfirmed: undefined,
            needsUserInput: false
          }
        ],
        uncertainties: [
          {
            id: 'uncertainty-1',
            question: 'What specific aspect of the thinking display needs verification?',
            suggestedContexts: [],
            priority: 'high' as const
          },
          {
            id: 'uncertainty-2',
            question: 'Should the test include interactive feedback capabilities?',
            suggestedContexts: [],
            priority: 'medium' as const
          }
        ],
        confidenceLevel: 'medium' as const,
        reasoningChain: [
          {
            id: 'step-1',
            step: 1,
            description: 'Analyzed user request for test message functionality',
            confidence: 'high' as const
          },
          {
            id: 'step-2',
            step: 2,
            description: 'Determined need for comprehensive AI thinking data',
            confidence: 'high' as const
          },
          {
            id: 'step-3',
            step: 3,
            description: 'Generated realistic assumptions and uncertainties for testing',
            confidence: 'medium' as const
          },
          {
            id: 'step-4',
            step: 4,
            description: 'Structured response to enable full thinking workflow verification',
            confidence: 'medium' as const
          }
        ],
        suggestedContexts: []
      }
    }

    console.log('🧪 Creating test message with AI thinking data:', testMessage)
    await this.saveMessage(testMessage)
    console.log('✅ Test message with thinking data saved to database')

    // Make the function globally available for console access
    if (typeof window !== 'undefined') {
      (window as any).createTestMessage = () => this.createTestMessage(chatId)
    }
  }

  // Make StorageService globally available for testing
  static initTestUtils(): void {
    if (typeof window !== 'undefined') {
      (window as any).StorageService = StorageService
      console.log('🛠️ StorageService available globally for testing')
      console.log('💡 Use StorageService.createTestMessage(chatId) to create test messages')
    }
  }
}

export default StorageService


import { Context, Message } from '../types'
import { supabase } from '../integrations/supabase/client'

export interface ContextCreationRequest {
  selectedMessages: Message[]
  userTitle?: string
  userDescription?: string
  category?: string
}

export interface GeneratedContext {
  title: string
  description: string
  content: string
  tags: string[]
  category: string
  type: 'knowledge' | 'document' | 'chat'
}

export class ContextCreationService {
  
  async createContextFromMessages(request: ContextCreationRequest): Promise<Context> {
    console.log('🎯 Creating context from messages:', {
      messageCount: request.selectedMessages.length,
      hasUserTitle: !!request.userTitle
    })

    try {
      // Call the Supabase edge function
      const messagesForAI = request.selectedMessages.map(msg => ({
        id: msg.id,
        content: msg.content,
        type: msg.type,
        timestamp: msg.timestamp.toISOString()
      }))

      const { data, error } = await supabase.functions.invoke('generate-context', {
        body: {
          mode: 'from_messages',
          messages: messagesForAI,
          customInstruction: request.userTitle ? `Title: ${request.userTitle}` : undefined
        }
      })

      if (error) throw error

      if (data?.context) {
        console.log('✅ Generated context via AI:', data.context.title)
        return {
          id: Date.now().toString(),
          ...data.context,
          createdAt: new Date(data.context.createdAt),
          updatedAt: new Date(data.context.updatedAt),
          lastUsed: new Date(data.context.lastUsed)
        }
      } else {
        throw new Error('No context data received from AI')
      }

    } catch (error) {
      console.error('❌ Error generating context with AI:', error)
      
      // Fallback to manual context creation
      return this.createFallbackContext(
        request.selectedMessages,
        request.userTitle,
        request.userDescription,
        request.category
      )
    }
  }

  async createContextFromSuggestion(
    suggestion: string,
    customInstruction?: string
  ): Promise<Context> {
    console.log('🎯 Creating context from AI suggestion:', suggestion)

    try {
      const { data, error } = await supabase.functions.invoke('generate-context', {
        body: {
          mode: 'from_prompt',
          prompt: suggestion,
          customInstruction
        }
      })

      if (error) throw error

      if (data?.context) {
        console.log('✅ Generated context from suggestion:', data.context.title)
        return {
          id: Date.now().toString(),
          ...data.context,
          createdAt: new Date(data.context.createdAt),
          updatedAt: new Date(data.context.updatedAt),
          lastUsed: new Date(data.context.lastUsed)
        }
      } else {
        throw new Error('No context data received from AI')
      }

    } catch (error) {
      console.error('❌ Error generating context from suggestion:', error)
      
      // Fallback
      return {
        id: Date.now().toString(),
        title: suggestion,
        description: 'AI-generated context from suggestion',
        content: suggestion,
        type: 'knowledge',
        tags: ['ai-generated'],
        category: 'Knowledge',
        size: suggestion.length,
        usageCount: 0,
        lastUsed: new Date(),
        isPrivate: true,
        autoSuggest: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }
  }

  private createFallbackContext(
    messages: Message[],
    userTitle?: string,
    userDescription?: string,
    userCategory?: string
  ): Context {
    console.log('🔄 Creating fallback context')
    
    const content = messages
      .map(msg => {
        const timestamp = new Date(msg.timestamp).toLocaleTimeString()
        const role = msg.type === 'user' ? 'User' : 'AI'
        return `[${timestamp}] ${role}: ${msg.content}`
      })
      .join('\n\n')

    return {
      id: Date.now().toString(),
      title: userTitle || 'Conversation Context',
      description: userDescription || 'Context created from selected conversation messages',
      content: content,
      type: 'chat',
      tags: ['conversation', 'manual'],
      category: userCategory || 'Knowledge',
      size: content.length,
      usageCount: 0,
      lastUsed: new Date(),
      isPrivate: true,
      autoSuggest: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  async createContextFromFile(
    file: File,
    userTitle?: string,
    userDescription?: string
  ): Promise<Context> {
    console.log('📄 Creating context from file:', file.name)

    // Read file content
    const content = await this.readFileContent(file)
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-context', {
        body: {
          mode: 'from_prompt',
          prompt: `File: ${file.name}\n\nContent:\n${content}`,
          customInstruction: `Analyze this file and create a structured context. ${userTitle ? `Title should be: ${userTitle}` : ''}`
        }
      })

      if (error) throw error

      if (data?.context) {
        return {
          id: Date.now().toString(),
          title: userTitle || data.context.title,
          description: userDescription || data.context.description,
          content: data.context.content,
          type: 'document',
          tags: data.context.tags,
          category: 'document',
          size: data.context.content.length,
          usageCount: 0,
          lastUsed: new Date(),
          isPrivate: true,
          autoSuggest: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }
    } catch (error) {
      console.error('❌ Error processing file with AI:', error)
    }
    
    // Fallback
    return {
      id: Date.now().toString(),
      title: userTitle || file.name,
      description: userDescription || `Document: ${file.name}`,
      content: content,
      type: 'document',
      tags: ['document', 'upload'],
      category: 'document',
      size: content.length,
      usageCount: 0,
      lastUsed: new Date(),
      isPrivate: true,
      autoSuggest: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsText(file)
    })
  }
}

export const contextCreationService = new ContextCreationService()

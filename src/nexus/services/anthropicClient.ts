import { netlifyAnthropicService, StructuredAIResponse } from '../../services/netlifyAnthropicService'
import { Context as AppContext } from '../../types'

export interface NexusMessage {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  thinking?: NexusThinking
}

export interface NexusThinking {
  assumptions: Array<{
    text: string
    confidence: 'high' | 'medium' | 'low'
    reasoning?: string
  }>
  uncertainties: Array<{
    question: string
    priority: 'high' | 'medium' | 'low'
    suggestedContexts?: string[]
  }>
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoningSteps: string[]
  contextUsage: Array<{
    contextId: string
    contextTitle: string
    influence: 'high' | 'medium' | 'low'
    howUsed: string
  }>
  suggestedContexts: Array<{
    title: string
    description: string
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
}

export interface NexusContext {
  id: string
  title: string
  description: string
  content: string
  category: string
  tags: string[]
}

class NexusAnthropicClient {
  private isConfigured(): boolean {
    // Netlify Functions are always available
    return true
  }

  setApiKey(apiKey: string) {
    // API keys are handled by Netlify Functions on the server
    console.log('Note: API keys are managed by Netlify Functions.')
  }

  getApiKey(): string | null {
    // No API keys in browser
    return null
  }
  
  constructor() {
    // Clean up any old localStorage items
    localStorage.removeItem('nexus-api-key')
    localStorage.removeItem('nexus-use-direct-api')
  }

  private convertToAppContext(nexusContext: NexusContext): AppContext {
    return {
      id: nexusContext.id,
      title: nexusContext.title,
      description: nexusContext.description,
      content: nexusContext.content,
      category: nexusContext.category,
      tags: nexusContext.tags,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private convertToNexusThinking(aiResponse: StructuredAIResponse): NexusThinking {
    return {
      assumptions: aiResponse.thinking.assumptions,
      uncertainties: aiResponse.thinking.uncertainties,
      confidenceLevel: aiResponse.thinking.confidenceLevel,
      reasoningSteps: aiResponse.thinking.reasoningSteps,
      contextUsage: aiResponse.thinking.contextUsage,
      suggestedContexts: aiResponse.thinking.suggestedContexts
    }
  }

  async sendMessage(
    messages: NexusMessage[],
    contexts: NexusContext[] = []
  ): Promise<{ content: string; thinking: NexusThinking }> {
    // Convert Nexus messages to the format expected by netlifyAnthropicService
    const appMessages = messages.map(msg => ({
      id: msg.id,
      chatId: 'nexus-chat',
      content: msg.content,
      type: msg.sender === 'user' ? 'user' as const : 'ai' as const,
      timestamp: msg.timestamp,
      status: msg.status || 'delivered' as const
    }))

    // Convert Nexus contexts to App contexts
    const appContexts = contexts.map(ctx => this.convertToAppContext(ctx))

    try {
      // Get structured response from Netlify Functions
      const response = await netlifyAnthropicService.getStructuredResponse(appMessages, appContexts)
      
      return {
        content: response.response,
        thinking: this.convertToNexusThinking(response)
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      throw error
    }
  }

  async *streamMessage(
    messages: NexusMessage[],
    contexts: NexusContext[] = []
  ): AsyncGenerator<string, NexusThinking | undefined, unknown> {
    // Convert Nexus messages to the format expected by netlifyAnthropicService
    const appMessages = messages.map(msg => ({
      id: msg.id,
      chatId: 'nexus-chat',
      content: msg.content,
      type: msg.sender === 'user' ? 'user' as const : 'ai' as const,
      timestamp: msg.timestamp,
      status: msg.status || 'delivered' as const
    }))

    // Convert Nexus contexts to App contexts
    const appContexts = contexts.map(ctx => this.convertToAppContext(ctx))

    try {
      // Stream the response from Netlify Functions
      const stream = netlifyAnthropicService.streamChatCompletion(appMessages, appContexts)
      
      let fullContent = ''
      for await (const chunk of stream) {
        fullContent += chunk
        yield chunk
      }

      // Get the thinking data from Netlify service
      const thinkingData = netlifyAnthropicService.getLastThinkingData()
      if (thinkingData) {
        return this.convertToNexusThinking({ 
          response: fullContent, 
          thinking: thinkingData 
        })
      }
    } catch (error) {
      console.error('Failed to stream response:', error)
      throw error
    }
  }
}

export const nexusAnthropicClient = new NexusAnthropicClient()
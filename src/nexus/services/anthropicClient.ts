import { supabaseAnthropicService, StructuredAIResponse } from '../../services/supabaseAnthropicService'
import { anthropicService } from '../../services/anthropicService'
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
  private useDirectApi: boolean = false
  
  private isConfigured(): boolean {
    // If using direct API, check for API key
    if (this.useDirectApi) {
      return !!anthropicService.getApiKey()
    }
    // Supabase service is always configured
    return true
  }

  setApiKey(apiKey: string) {
    if (apiKey && apiKey.trim()) {
      // If an API key is provided, switch to direct API mode
      this.useDirectApi = true
      anthropicService.setApiKey(apiKey)
      // Store preference in localStorage
      localStorage.setItem('nexus-use-direct-api', 'true')
      localStorage.setItem('nexus-api-key', apiKey)
    } else {
      // If no API key, use Supabase
      this.useDirectApi = false
      localStorage.removeItem('nexus-use-direct-api')
      localStorage.removeItem('nexus-api-key')
    }
  }

  getApiKey(): string | null {
    // Check localStorage for saved API key
    const savedKey = localStorage.getItem('nexus-api-key')
    if (savedKey) {
      this.useDirectApi = true
      anthropicService.setApiKey(savedKey)
      return savedKey
    }
    return null
  }
  
  constructor() {
    // Initialize from localStorage
    const savedKey = localStorage.getItem('nexus-api-key')
    const useDirectApi = localStorage.getItem('nexus-use-direct-api') === 'true'
    
    if (savedKey && useDirectApi) {
      this.useDirectApi = true
      anthropicService.setApiKey(savedKey)
    }
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
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key not configured. Please set your API key in settings.')
    }

    // Convert Nexus messages to the format expected by anthropicService
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
      // Get structured response from appropriate service
      const response = this.useDirectApi 
        ? await anthropicService.getStructuredResponse(appMessages, appContexts)
        : await supabaseAnthropicService.getStructuredResponse(appMessages, appContexts)
      
      return {
        content: response.response,
        thinking: this.convertToNexusThinking(response)
      }
    } catch (error) {
      console.error('Failed to get Anthropic response:', error)
      throw error
    }
  }

  async *streamMessage(
    messages: NexusMessage[],
    contexts: NexusContext[] = []
  ): AsyncGenerator<string, NexusThinking | undefined, unknown> {
    if (!this.isConfigured()) {
      throw new Error('Anthropic API key not configured. Please set your API key in settings.')
    }

    // Convert Nexus messages to the format expected by anthropicService
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
      // Stream the response from appropriate service
      const stream = this.useDirectApi
        ? anthropicService.streamChatCompletion(appMessages, appContexts)
        : supabaseAnthropicService.streamChatCompletion(appMessages, appContexts)
      
      let fullContent = ''
      for await (const chunk of stream) {
        fullContent += chunk
        yield chunk
      }

      // Get the thinking data from appropriate service
      const thinkingData = this.useDirectApi
        ? anthropicService.getLastThinkingData()
        : supabaseAnthropicService.getLastThinkingData()
      if (thinkingData) {
        return this.convertToNexusThinking({ 
          response: fullContent, 
          thinking: thinkingData 
        })
      }
    } catch (error) {
      console.error('Failed to stream Anthropic response:', error)
      throw error
    }
  }
}

export const nexusAnthropicClient = new NexusAnthropicClient()
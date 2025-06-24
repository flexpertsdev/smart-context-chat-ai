import { supabaseAnthropicService, StructuredAIResponse } from '../../services/supabaseAnthropicService'
import { anthropicService } from '../../services/anthropicService'
import { Context as AppContext } from '../../types'
import { clearNexusApiKey } from '../utils/clearApiKey'

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
      let response: StructuredAIResponse
      
      if (this.useDirectApi) {
        try {
          response = await anthropicService.getStructuredResponse(appMessages, appContexts)
        } catch (directApiError) {
          console.error('Direct API failed, falling back to Supabase:', directApiError)
          // Store error for debugging
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('nexus-last-api-error', String(directApiError))
          }
          // Fall back to Supabase if direct API fails
          response = await supabaseAnthropicService.getStructuredResponse(appMessages, appContexts)
        }
      } else {
        response = await supabaseAnthropicService.getStructuredResponse(appMessages, appContexts)
      }
      
      return {
        content: response.response,
        thinking: this.convertToNexusThinking(response)
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      if (error instanceof Error && error.message.includes('CORS')) {
        throw new Error('Direct API access is not supported in the browser. Please remove your API key to use Supabase Edge Functions.')
      }
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
      let stream: AsyncGenerator<string, void, unknown>
      let service: typeof anthropicService | typeof supabaseAnthropicService
      
      if (this.useDirectApi) {
        try {
          stream = anthropicService.streamChatCompletion(appMessages, appContexts)
          service = anthropicService
          // Test if we can get the first chunk
          const firstChunkResult = await stream.next()
          if (firstChunkResult.done) {
            throw new Error('Stream ended unexpectedly')
          }
          // Create a new generator that yields the first chunk and then the rest
          stream = (async function* () {
            yield firstChunkResult.value
            yield* stream
          })()
        } catch (directApiError) {
          console.error('Direct API streaming failed, falling back to Supabase:', directApiError)
          // Fall back to Supabase if direct API fails
          stream = supabaseAnthropicService.streamChatCompletion(appMessages, appContexts)
          service = supabaseAnthropicService
        }
      } else {
        stream = supabaseAnthropicService.streamChatCompletion(appMessages, appContexts)
        service = supabaseAnthropicService
      }
      
      let fullContent = ''
      for await (const chunk of stream) {
        fullContent += chunk
        yield chunk
      }

      // Get the thinking data from appropriate service
      const thinkingData = service.getLastThinkingData()
      if (thinkingData) {
        return this.convertToNexusThinking({ 
          response: fullContent, 
          thinking: thinkingData 
        })
      }
    } catch (error) {
      console.error('Failed to stream response:', error)
      if (error instanceof TypeError && this.useDirectApi) {
        throw new Error('Direct API access failed. This usually means CORS is blocking browser requests. Please clear your API key in settings to use Supabase Edge Functions instead.')
      }
      throw error
    }
  }
}

export const nexusAnthropicClient = new NexusAnthropicClient()
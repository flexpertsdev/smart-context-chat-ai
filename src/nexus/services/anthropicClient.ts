import { supabaseAnthropicService, StructuredAIResponse } from '../../services/supabaseAnthropicService'
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
    // Supabase service is always configured with hardcoded credentials
    return true
  }

  setApiKey(apiKey: string) {
    // No-op for Supabase service as it uses its own authentication
    console.log('API key setting not required for Supabase service')
  }

  getApiKey(): string | null {
    // Return null as Supabase doesn't use user API keys
    return null
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
      // Get structured response from Supabase Edge Function
      const response = await supabaseAnthropicService.getStructuredResponse(appMessages, appContexts)
      
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
      // Stream the response from Supabase Edge Function
      const stream = supabaseAnthropicService.streamChatCompletion(appMessages, appContexts)
      
      let fullContent = ''
      for await (const chunk of stream) {
        fullContent += chunk
        yield chunk
      }

      // Get the thinking data that was stored by Supabase service
      const thinkingData = supabaseAnthropicService.getLastThinkingData()
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
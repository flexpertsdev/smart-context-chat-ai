
import { Context, Message } from '../types'

export interface StructuredAIResponse {
  response: string
  thinking: {
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
}

export class SupabaseAnthropicService {
  private supabaseUrl: string
  private supabaseAnonKey: string

  constructor() {
    // Updated with actual Supabase URL and anon key
    this.supabaseUrl = 'https://ajrcdmxznlhyervttmea.supabase.co'
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcmNkbXh6bmxoeWVydnR0bWVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MjE3ODIsImV4cCI6MjA2NDQ5Nzc4Mn0.JcLDDl2zd0LqEX0HJRAauwLziPgfUqsn4UVwxpnHIYk'
    
    console.log('🔧 Supabase service initialized:', {
      hasUrl: !!this.supabaseUrl,
      hasKey: !!this.supabaseAnonKey
    })
  }

  async getStructuredResponse(
    messages: Message[],
    contexts: Context[] = []
  ): Promise<StructuredAIResponse> {
    console.log('🚀 Getting structured response from Supabase Anthropic function', {
      messageCount: messages.length,
      contextCount: contexts.length
    })

    if (!this.supabaseUrl || !this.supabaseAnonKey || 
        this.supabaseUrl === 'https://your-project.supabase.co' || 
        this.supabaseAnonKey === 'your-anon-key-here') {
      throw new Error('Supabase configuration missing. Please update supabaseAnthropicService.ts with your Supabase URL and anon key')
    }

    const requestPayload = {
      messages: messages.map(msg => ({
        id: msg.id,
        chatId: msg.chatId,
        content: msg.content,
        type: msg.type,
        timestamp: msg.timestamp.toISOString(),
        status: msg.status
      })),
      contexts: contexts.map(ctx => ({
        id: ctx.id,
        title: ctx.title,
        description: ctx.description,
        content: ctx.content,
        type: ctx.type,
        tags: ctx.tags,
        category: ctx.category
      }))
    }

    console.log('📤 Sending request to Supabase function:', {
      url: `${this.supabaseUrl}/functions/v1/anthropic-chat`,
      messageCount: requestPayload.messages.length,
      contextCount: requestPayload.contexts.length
    })

    const response = await fetch(`${this.supabaseUrl}/functions/v1/anthropic-chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Supabase function error:', errorText)
      throw new Error(`Supabase function error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Supabase function response received')
    console.log('📝 Raw response data:', {
      hasResponse: 'response' in data,
      hasThinking: 'thinking' in data,
      hasError: 'error' in data,
      responseType: typeof data.response,
      responseLength: data.response?.length,
      responsePreview: data.response?.substring(0, 100),
      fullData: data
    })

    // Handle error responses from the function
    if (data.error) {
      throw new Error(data.error)
    }

    // Ensure the response has the correct structure
    const structuredResponse: StructuredAIResponse = data as StructuredAIResponse
    
    // Validate that thinking data exists and has the right structure
    if (!structuredResponse.thinking) {
      console.warn('⚠️ No thinking data in response, creating empty structure')
      structuredResponse.thinking = {
        assumptions: [],
        uncertainties: [],
        confidenceLevel: 'medium' as const,
        reasoningSteps: [],
        contextUsage: [],
        suggestedContexts: []
      }
    }

    // Ensure all arrays exist
    structuredResponse.thinking.assumptions = structuredResponse.thinking.assumptions || []
    structuredResponse.thinking.uncertainties = structuredResponse.thinking.uncertainties || []
    structuredResponse.thinking.reasoningSteps = structuredResponse.thinking.reasoningSteps || []
    structuredResponse.thinking.contextUsage = structuredResponse.thinking.contextUsage || []
    structuredResponse.thinking.suggestedContexts = structuredResponse.thinking.suggestedContexts || []

    return structuredResponse
  }

  // For compatibility with existing streaming interface, we can simulate streaming
  async *streamChatCompletion(
    messages: Message[],
    contexts: Context[] = []
  ): AsyncGenerator<string, void, unknown> {
    console.log('🌊 Starting simulated streaming from Supabase function')

    try {
      const structuredResponse = await this.getStructuredResponse(messages, contexts)
      
      // Yield the response character by character for streaming effect
      const response = structuredResponse.response
      for (let i = 0; i < response.length; i++) {
        yield response[i]
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      
      // Store the thinking data for later retrieval - Fixed: access thinking as property, not function
      if (typeof window !== 'undefined') {
        // Ensure the thinking data matches our expected structure
        const thinkingData = {
          assumptions: structuredResponse.thinking.assumptions || [],
          uncertainties: structuredResponse.thinking.uncertainties || [],
          confidenceLevel: structuredResponse.thinking.confidenceLevel || 'medium',
          reasoningSteps: structuredResponse.thinking.reasoningSteps || [],
          contextUsage: structuredResponse.thinking.contextUsage || [],
          suggestedContexts: structuredResponse.thinking.suggestedContexts || []
        };
        
        (window as any).lastThinkingData = thinkingData;
        (window as any).lastStructuredResponse = structuredResponse;
      }
      
    } catch (error) {
      console.error('❌ Error in Supabase function streaming:', error)
      throw error
    }
  }

  getLastThinkingData() {
    if (typeof window !== 'undefined') {
      return (window as any).lastThinkingData || null
    }
    return null
  }

  getLastStructuredResponse(): StructuredAIResponse | null {
    if (typeof window !== 'undefined') {
      return (window as any).lastStructuredResponse || null
    }
    return null
  }
}

export const supabaseAnthropicService = new SupabaseAnthropicService()

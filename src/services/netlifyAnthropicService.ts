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

export class NetlifyAnthropicService {
  async getStructuredResponse(
    messages: Message[],
    contexts: Context[] = []
  ): Promise<StructuredAIResponse> {
    console.log('🚀 Getting structured response from Netlify function', {
      messageCount: messages.length,
      contextCount: contexts.length
    })

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

    console.log('📤 Sending request to Netlify function')

    const response = await fetch('/.netlify/functions/anthropic-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Netlify function error:', errorText)
      throw new Error(`Netlify function error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Netlify function response received')

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
    console.log('🌊 Starting simulated streaming from Netlify function')

    try {
      const structuredResponse = await this.getStructuredResponse(messages, contexts)
      
      // Yield the response character by character for streaming effect
      const response = structuredResponse.response
      for (let i = 0; i < response.length; i++) {
        yield response[i]
        // Small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 10))
      }
      
      // Store the thinking data for later retrieval
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
      console.error('❌ Error in Netlify function streaming:', error)
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

export const netlifyAnthropicService = new NetlifyAnthropicService()
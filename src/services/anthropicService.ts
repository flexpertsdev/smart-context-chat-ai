import { Context, Message } from '../types'

export interface AnthropicMessage {
  role: 'user' | 'assistant'
  content: string
}

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

export interface AnthropicStreamResponse {
  type: 'content_block_delta' | 'content_block_start' | 'content_block_stop' | 'message_delta' | 'message_start' | 'message_stop'
  delta?: {
    text?: string
  }
  content_block?: {
    text?: string
  }
}

export class AnthropicService {
  private apiKey: string | null = null

  constructor() {
    this.apiKey = localStorage.getItem('anthropic_api_key')
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('anthropic_api_key', key)
  }

  getApiKey(): string | null {
    return this.apiKey
  }

  clearApiKey() {
    this.apiKey = null
    localStorage.removeItem('anthropic_api_key')
  }

  private buildSystemMessage(contexts: Context[]): string {
    let systemMessage = `You are Claude, a helpful AI assistant. You will provide responses in a specific structured format that includes both your main response and your thinking process.

IMPORTANT: You must ALWAYS respond with valid JSON in this exact format:
{
  "response": "Your main response to the user here",
  "thinking": {
    "assumptions": [
      {"text": "assumption you're making", "confidence": "high|medium|low", "reasoning": "why you think this"}
    ],
    "uncertainties": [
      {"question": "what you're unsure about", "priority": "high|medium|low", "suggestedContexts": ["context that would help"]}
    ],
    "confidenceLevel": "high|medium|low",
    "reasoningSteps": ["step 1 of your reasoning", "step 2", "etc"],
    "contextUsage": [
      {"contextId": "id", "contextTitle": "title", "influence": "high|medium|low", "howUsed": "how this context influenced your response"}
    ],
    "suggestedContexts": [
      {"title": "suggested context title", "description": "what it would contain", "reason": "why it would help", "priority": "high|medium|low"}
    ]
  }
}`

    if (contexts.length > 0) {
      systemMessage += '\n\nAvailable contexts to reference:\n\n'
      
      contexts.forEach((context, index) => {
        systemMessage += `Context ID: ${context.id}\n`
        systemMessage += `Title: ${context.title}\n`
        systemMessage += `Description: ${context.description}\n`
        systemMessage += `Content: ${context.content}\n\n`
      })

      systemMessage += '\nUse these contexts to inform your response and note in your thinking which ones you used and how.'
    }

    systemMessage += '\n\nBe honest about your confidence levels and uncertainties. If you\'re making assumptions, state them clearly. If additional context would help, suggest what kind of information would be useful.'

    return systemMessage
  }

  private buildMessageHistory(messages: Message[], contexts: Context[]): AnthropicMessage[] {
    console.log('🔧 Building Anthropic message history...', {
      totalMessages: messages.length,
      contextCount: contexts.length
    })

    // Filter valid messages (exclude system messages and current AI placeholder)
    const validMessages = messages.filter(msg => 
      msg.type !== 'system' && 
      msg.content && 
      msg.content.trim().length > 0 && 
      msg.status === 'delivered'
    )

    console.log('✅ Valid messages for Anthropic:', {
      validCount: validMessages.length,
      totalCount: messages.length
    })

    const anthropicMessages: AnthropicMessage[] = validMessages.map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }))

    return anthropicMessages
  }

  async getStructuredResponse(
    messages: Message[],
    contexts: Context[] = []
  ): Promise<StructuredAIResponse> {
    console.log('🚀 Getting structured response from Anthropic', {
      messageCount: messages.length,
      contextCount: contexts.length
    })

    if (!this.apiKey) {
      console.error('❌ Anthropic API key not set')
      throw new Error('Anthropic API key not set')
    }

    const anthropicMessages = this.buildMessageHistory(messages, contexts)
    const systemMessage = this.buildSystemMessage(contexts)

    const requestPayload = {
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.3,
      system: systemMessage,
      messages: anthropicMessages
    }

    console.log('📤 Sending request to Anthropic API:', {
      model: requestPayload.model,
      messageCount: requestPayload.messages.length,
      hasSystemMessage: !!requestPayload.system
    })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestPayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Anthropic API error:', errorText)
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Anthropic response received')

    // Extract the content from Anthropic's response format
    const content = data.content[0]?.text || ''
    
    try {
      // Parse the JSON response from Claude
      const structuredResponse: StructuredAIResponse = JSON.parse(content)
      console.log('✅ Successfully parsed structured response')
      return structuredResponse
    } catch (parseError) {
      console.error('❌ Failed to parse structured response:', content)
      // Fallback for non-structured responses
      return {
        response: content,
        thinking: {
          assumptions: [
            { text: "Response format not structured", confidence: 'low' as const }
          ],
          uncertainties: [],
          confidenceLevel: 'low' as const,
          reasoningSteps: [],
          contextUsage: [],
          suggestedContexts: []
        }
      }
    }
  }

  async *streamChatCompletion(
    messages: Message[],
    contexts: Context[] = []
  ): AsyncGenerator<string, void, unknown> {
    console.log('🌊 Starting Anthropic stream chat completion')

    // For now, get structured response and yield it
    // Later we can implement true streaming with structured parsing
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
      // This is a temporary solution - in production you'd want proper state management
      if (typeof window !== 'undefined') {
        (window as any).lastThinkingData = structuredResponse.thinking
      }
      
    } catch (error) {
      console.error('❌ Error in Anthropic streaming:', error)
      throw error
    }
  }

  getLastThinkingData() {
    if (typeof window !== 'undefined') {
      return (window as any).lastThinkingData || null
    }
    return null
  }
}

export const anthropicService = new AnthropicService()

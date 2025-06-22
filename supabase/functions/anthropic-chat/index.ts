import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

interface Context {
  id: string
  title: string
  description: string
  content: string
  type: 'knowledge' | 'document' | 'chat'
  tags: string[]
  category: string
}

interface Message {
  id: string
  chatId: string
  content: string
  type: 'user' | 'ai' | 'system'
  timestamp: string
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface AnthropicRequest {
  messages: Message[]
  contexts: Context[]
}

interface StructuredAIResponse {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, contexts }: AnthropicRequest = await req.json()

    // Get Anthropic API key from environment
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured')
    }

    // Build system message with contexts
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
      
      contexts.forEach((context) => {
        systemMessage += `Context ID: ${context.id}\n`
        systemMessage += `Title: ${context.title}\n`
        systemMessage += `Description: ${context.description}\n`
        systemMessage += `Content: ${context.content}\n\n`
      })

      systemMessage += '\nUse these contexts to inform your response and note in your thinking which ones you used and how.'
    }

    systemMessage += '\n\nBe honest about your confidence levels and uncertainties. If you\'re making assumptions, state them clearly. If additional context would help, suggest what kind of information would be useful.'

    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter(msg => 
        msg.type !== 'system' && 
        msg.content && 
        msg.content.trim().length > 0 && 
        msg.status === 'delivered'
      )
      .map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

    // Call Anthropic API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4000,
        temperature: 0.3,
        system: systemMessage,
        messages: anthropicMessages
      })
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      throw new Error(`Anthropic API error: ${anthropicResponse.status} - ${errorText}`)
    }

    const data = await anthropicResponse.json()
    const content = data.content[0]?.text || ''
    
    let structuredResponse: StructuredAIResponse
    
    try {
      // Parse the JSON response from Claude
      structuredResponse = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse structured response:', content)
      // Fallback for non-structured responses
      structuredResponse = {
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

    return new Response(
      JSON.stringify(structuredResponse),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in anthropic-chat function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: "I apologize, but I encountered an error processing your request. Please try again.",
        thinking: {
          assumptions: [],
          uncertainties: [],
          confidenceLevel: 'low' as const,
          reasoningSteps: [],
          contextUsage: [],
          suggestedContexts: []
        }
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

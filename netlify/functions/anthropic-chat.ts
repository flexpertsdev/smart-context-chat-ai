import { Handler } from '@netlify/functions'
import Anthropic from '@anthropic-ai/sdk'

const apiKey = process.env.ANTHROPIC_API_KEY

if (!apiKey) {
  console.error('ANTHROPIC_API_KEY environment variable is not set')
}

const anthropic = new Anthropic({
  apiKey: apiKey || 'dummy-key-for-initialization',
})

export const handler: Handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    // Check for API key before processing request
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Anthropic API key not configured',
          details: 'Please set ANTHROPIC_API_KEY environment variable in Netlify dashboard'
        }),
      }
    }

    const { messages, contexts } = JSON.parse(event.body || '{}')

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array is required' }),
      }
    }

    // Build system message with contexts
    let systemMessage = `You are a helpful AI assistant with advanced thinking capabilities.

When responding:
1. Analyze the user's request carefully
2. Consider multiple approaches before deciding on the best response
3. Be thorough but concise
4. Admit uncertainty when appropriate`

    // Add contexts to system message if provided
    if (contexts && contexts.length > 0) {
      systemMessage += '\n\nRelevant context information:\n'
      contexts.forEach((ctx: any) => {
        systemMessage += `\n### ${ctx.title}\n${ctx.content}\n`
      })
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages
      .filter((msg: any) => msg.type !== 'system')
      .map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }))

    // Create the message with thinking blocks
    const thinkingPrompt = `Before responding, think through the problem step by step in a <thinking> block.
Consider:
- What the user is asking
- What assumptions you're making
- What uncertainties exist
- How the provided contexts might help
- What additional context might be useful

Then provide your response.`

    // Add thinking prompt to the last user message
    if (anthropicMessages.length > 0 && anthropicMessages[anthropicMessages.length - 1].role === 'user') {
      anthropicMessages[anthropicMessages.length - 1].content += '\n\n' + thinkingPrompt
    }

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: anthropicMessages,
      system: systemMessage,
    })

    // Extract thinking from response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic')
    }

    // Parse thinking blocks
    const text = content.text
    const thinkingMatch = text.match(/<thinking>([\s\S]*?)<\/thinking>/i)
    const thinking = thinkingMatch ? thinkingMatch[1].trim() : ''
    const responseText = text.replace(/<thinking>[\s\S]*?<\/thinking>/i, '').trim()

    // Structure the thinking data
    const structuredThinking = parseThinking(thinking)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: responseText,
        thinking: structuredThinking,
      }),
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to get AI response',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    }
  }
}

function parseThinking(thinking: string): any {
  // Parse the thinking text into structured data
  const assumptions: any[] = []
  const uncertainties: any[] = []
  const reasoningSteps: string[] = []
  const contextUsage: any[] = []
  const suggestedContexts: any[] = []

  // Simple parsing - in production, you'd want more sophisticated parsing
  const lines = thinking.split('\n').filter(line => line.trim())
  
  let currentSection = ''
  for (const line of lines) {
    if (line.toLowerCase().includes('assumption')) {
      currentSection = 'assumptions'
    } else if (line.toLowerCase().includes('uncertain')) {
      currentSection = 'uncertainties'
    } else if (line.toLowerCase().includes('reasoning') || line.toLowerCase().includes('step')) {
      currentSection = 'reasoning'
    } else if (line.toLowerCase().includes('context')) {
      currentSection = 'context'
    } else if (currentSection && line.trim().startsWith('-')) {
      const content = line.substring(1).trim()
      switch (currentSection) {
        case 'assumptions':
          assumptions.push({
            text: content,
            confidence: 'medium',
          })
          break
        case 'uncertainties':
          uncertainties.push({
            question: content,
            priority: 'medium',
          })
          break
        case 'reasoning':
          reasoningSteps.push(content)
          break
      }
    }
  }

  // Determine overall confidence
  const confidenceLevel = uncertainties.length > 2 ? 'low' : 
                         uncertainties.length > 0 ? 'medium' : 'high'

  return {
    assumptions,
    uncertainties,
    confidenceLevel,
    reasoningSteps,
    contextUsage,
    suggestedContexts,
  }
}
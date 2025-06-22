
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Message {
  id: string
  content: string
  type: 'user' | 'ai'
  timestamp: string
}

interface GenerateContextRequest {
  mode: 'from_messages' | 'from_prompt'
  messages?: Message[]
  prompt?: string
  customInstruction?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { mode, messages, prompt, customInstruction }: GenerateContextRequest = await req.json()
    
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not configured')
    }

    let systemPrompt = ''
    let userPrompt = ''

    if (mode === 'from_messages') {
      systemPrompt = `You are an expert at creating structured knowledge contexts from conversations. Analyze the provided chat messages and create a comprehensive context entry that captures the key information, insights, and knowledge shared.

The context should be:
- Well-structured and easy to understand
- Comprehensive but concise
- Written in markdown format
- Focused on the main topics and insights
- Useful for future reference

${customInstruction ? `Additional instruction: ${customInstruction}` : ''}

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "Clear, descriptive title",
  "description": "Brief description of what this context contains",
  "content": "Main content in markdown format with proper headings, lists, and formatting",
  "category": "Choose from: Knowledge, Development, AI, Business, Science, Personal, Conversation",
  "tags": ["tag1", "tag2", "tag3"],
  "type": "chat"
}`

      const conversationText = messages?.map(msg => 
        `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`
      ).join('\n\n') || ''

      userPrompt = `Please analyze this conversation and create a context entry:\n\n${conversationText}`
    } else {
      systemPrompt = `You are an expert at creating comprehensive knowledge contexts on any topic. Based on the user's prompt, generate detailed, accurate, and well-structured content that would be valuable for learning or reference.

The context should be:
- Comprehensive and educational
- Well-organized with clear structure
- Written in markdown format
- Factually accurate
- Practical and useful

Respond with ONLY a valid JSON object in this exact format:
{
  "title": "Clear, descriptive title",
  "description": "Brief description of what this context contains",
  "content": "Main content in markdown format with proper headings, lists, and formatting",
  "category": "Choose from: Knowledge, Development, AI, Business, Science, Personal",
  "tags": ["tag1", "tag2", "tag3"],
  "type": "knowledge"
}`

      userPrompt = `Create a comprehensive context for: ${prompt}${customInstruction ? `\n\nAdditional instruction: ${customInstruction}` : ''}`
    }

    console.log('🤖 Calling Anthropic API for context generation')

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: `${systemPrompt}\n\n${userPrompt}` }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Anthropic API error:', errorText)
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.content[0].text

    console.log('✅ Received Anthropic response')

    // Parse the JSON response from Claude
    let contextData
    try {
      contextData = JSON.parse(content)
    } catch (parseError) {
      console.error('❌ Failed to parse Anthropic response as JSON:', content)
      throw new Error('Failed to parse AI response')
    }

    // Validate the response structure
    if (!contextData.title || !contextData.content) {
      throw new Error('Invalid context data structure from AI')
    }

    // Ensure required fields have defaults
    const finalContext = {
      title: contextData.title,
      description: contextData.description || 'AI-generated context',
      content: contextData.content,
      category: contextData.category || 'Knowledge',
      tags: Array.isArray(contextData.tags) ? contextData.tags : [],
      type: contextData.type || (mode === 'from_messages' ? 'chat' : 'knowledge'),
      size: new Blob([contextData.content]).size,
      usageCount: 0,
      lastUsed: new Date().toISOString(),
      isPrivate: false,
      autoSuggest: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return new Response(
      JSON.stringify({ context: finalContext }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('❌ Error in generate-context function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate context',
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

# Backend Architecture Handover Document

This document explains the backend architecture, state management, and context system of the Smart Context Chat AI application to facilitate migration from Supabase to Firebase or Appwrite.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Core Services](#core-services)
3. [State Management (Stores)](#state-management-stores)
4. [Context System](#context-system)
5. [Data Models](#data-models)
6. [Supabase-Anthropic Integration](#supabase-anthropic-integration)
7. [Migration Guide](#migration-guide)

## Architecture Overview

The application follows a layered architecture:

```
Frontend (React) 
    ↓
State Management (Zustand Stores)
    ↓
Service Layer (API Abstractions)
    ↓
Backend Services (Supabase Edge Functions)
    ↓
External APIs (Anthropic Claude)
```

### Key Design Principles
- **Service Abstraction**: All backend calls go through service classes
- **Local-First**: IndexedDB for offline support and performance
- **State Synchronization**: Zustand stores sync with local storage
- **Error Resilience**: Fallbacks for all external service calls

## Core Services

### 1. StorageService (`src/services/storageService.ts`)

**Purpose**: Local data persistence using IndexedDB via Dexie.js

**Key Features**:
- Stores chats, messages, and contexts locally
- Full CRUD operations for all entities
- Search functionality with text matching
- Import/export capabilities for data portability
- Transaction support for data integrity

**Database Schema**:
```typescript
{
  chats: 'id, name, archived, createdAt, updatedAt',
  messages: 'id, chatId, role, content, thinking, status, createdAt',
  contexts: 'id, title, category, tags, createdAt, updatedAt'
}
```

**Migration Note**: This service is backend-agnostic and will work unchanged with Firebase/Appwrite.

### 2. SupabaseAnthropicService (`src/services/supabaseAnthropicService.ts`)

**Purpose**: Proxies AI requests through Supabase Edge Functions for security

**Key Methods**:
```typescript
sendMessage(messages, contexts) → Promise<AIResponse>
```

**Request Flow**:
1. Formats messages and contexts
2. Sends to Supabase Edge Function
3. Edge Function adds API key and calls Anthropic
4. Returns structured response with AI thinking data

**Response Structure**:
```typescript
{
  response: string,
  thinking: {
    assumptions: Array<{text, confidence, reasoning}>,
    uncertainties: Array<{question, priority, suggestedContexts}>,
    confidenceLevel: 'high' | 'medium' | 'low',
    reasoningSteps: string[],
    contextUsage: Array<{contextId, influence, howUsed}>,
    suggestedContexts: Array<{title, description, reason}>
  }
}
```

### 3. ContextCreationService (`src/services/contextCreationService.ts`)

**Purpose**: Creates knowledge contexts from various sources

**Creation Methods**:
- From selected chat messages
- From AI-generated suggestions
- From file uploads
- From user prompts

**Key Features**:
- AI-powered context generation
- Automatic tagging and categorization
- Fallback to manual creation if AI fails

## State Management (Stores)

### 1. ChatStore (`src/stores/chatStore.ts`)

**Manages**: All chat-related state and operations

**Key State**:
```typescript
{
  chats: Chat[],
  activeChat: Chat | null,
  messages: Record<chatId, Message[]>,
  isLoading: boolean,
  selectedMessageIds: Set<string>
}
```

**Core Actions**:
- `createChat()`: Creates new chat session
- `sendMessage()`: Full message lifecycle management
- `selectMessages()`: For context creation from messages
- `archiveChat()`: Soft delete functionality

**Message Send Flow**:
```typescript
async sendMessage(chatId, content, contexts) {
  // 1. Create user message
  const userMessage = createMessage('user', content)
  await storageService.saveMessage(userMessage)
  
  // 2. Create AI placeholder
  const aiMessage = createMessage('assistant', '')
  
  // 3. Call AI service with contexts
  const response = await supabaseAnthropicService.sendMessage(
    messages, 
    contexts
  )
  
  // 4. Update AI message with response
  aiMessage.content = response.response
  aiMessage.thinking = response.thinking
  
  // 5. Save to storage
  await storageService.saveMessage(aiMessage)
}
```

### 2. ContextStore (`src/stores/contextStore.ts`)

**Manages**: Knowledge context state and operations

**Key State**:
```typescript
{
  contexts: Context[],
  selectedContextIds: Set<string>,
  searchQuery: string,
  filterCategory: string | null
}
```

**Core Actions**:
- `createContext()`: Creates new contexts
- `selectContext()`: Manages context selection for chats
- `updateUsageStats()`: Tracks context usage
- `searchContexts()`: Full-text search

**Context Selection Pattern**:
```typescript
// Contexts are selected before sending messages
contextStore.selectContext(contextId)
// Selected contexts are passed to AI
chatStore.sendMessage(content, contextStore.selectedContexts)
```

### 3. AppStore (`src/stores/appStore.ts`)

**Manages**: Global application state

**Key State**:
```typescript
{
  user: UserProfile,
  preferences: {
    theme: 'light' | 'dark',
    notifications: boolean,
    language: string
  },
  isOnboarded: boolean
}
```

## Context System

### What are Contexts?

Contexts are reusable pieces of knowledge that enhance AI responses. They can be:
- **Knowledge**: General information (e.g., company policies, technical specs)
- **Document**: File-based content (e.g., PDFs, code files)
- **Chat**: Excerpts from previous conversations

### How Contexts Work

1. **Selection**: User selects relevant contexts before chatting
2. **Injection**: Contexts are injected into the AI's system prompt
3. **Usage Tracking**: AI reports which contexts influenced its response
4. **Learning**: System suggests new contexts based on chat content

### Context Lifecycle

```
Create Context → Tag & Categorize → Select for Chat
                                           ↓
                                    Include in AI Prompt
                                           ↓
                                    AI Uses Context
                                           ↓
                                    Track Usage Stats
                                           ↓
                                    Suggest Related Contexts
```

## Data Models

### Chat
```typescript
interface Chat {
  id: string
  name: string
  archived: boolean
  lastMessage?: string
  messageCount: number
  contextIds: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}
```

### Message
```typescript
interface Message {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  thinking?: AIThinking  // AI's reasoning process
  status: 'sending' | 'sent' | 'delivered' | 'read'
  timestamp: string
  contextIds?: string[]  // Contexts used for this message
}
```

### Context
```typescript
interface Context {
  id: string
  title: string
  content: string
  category: 'knowledge' | 'document' | 'chat'
  tags: string[]
  metadata: {
    source?: string
    author?: string
    createdFrom?: 'manual' | 'ai' | 'chat' | 'file'
  }
  usageCount: number
  lastUsedAt?: string
  createdAt: string
  updatedAt: string
}
```

### AIThinking
```typescript
interface AIThinking {
  assumptions: Array<{
    text: string
    confidence: 'high' | 'medium' | 'low'
    reasoning: string
  }>
  uncertainties: Array<{
    question: string
    priority: 'high' | 'medium' | 'low'
    suggestedContexts: string[]
  }>
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoningSteps: string[]
  contextUsage: Array<{
    contextId: string
    influence: 'high' | 'medium' | 'low'
    howUsed: string
  }>
  suggestedContexts: Array<{
    title: string
    description: string
    reason: string
  }>
}
```

## Supabase-Anthropic Integration

### Current Implementation

**Edge Function**: `supabase/functions/anthropic-chat/index.ts`

```typescript
const systemPrompt = `
You are a helpful AI assistant with access to the following contexts:
${contexts.map(c => `[${c.title}]: ${c.content}`).join('\n')}

Provide your reasoning process in your response...
`

const anthropicResponse = await anthropic.messages.create({
  model: 'claude-3-opus-20240229',
  system: systemPrompt,
  messages: formattedMessages,
  max_tokens: 4000
})
```

### Security Model
- API keys stored in Supabase environment variables
- Edge Functions handle authentication
- No client-side API key exposure
- CORS configured for frontend origin

## Migration Guide

### To Firebase

1. **Replace Supabase Edge Functions with Firebase Functions**:
   ```typescript
   // Firebase Function example
   exports.anthropicChat = functions.https.onCall(async (data, context) => {
     // Verify authentication
     if (!context.auth) throw new Error('Unauthenticated')
     
     // Same logic as Supabase function
     const response = await anthropic.messages.create({...})
     return parseAIResponse(response)
   })
   ```

2. **Update Service Layer**:
   ```typescript
   // Create FirebaseAnthropicService.ts
   class FirebaseAnthropicService {
     async sendMessage(messages, contexts) {
       const anthropicChat = httpsCallable(functions, 'anthropicChat')
       const result = await anthropicChat({ messages, contexts })
       return result.data
     }
   }
   ```

3. **Authentication Integration**:
   - Use Firebase Auth for user management
   - Update AppStore to use Firebase user object
   - Add auth state listeners

### To Appwrite

1. **Create Appwrite Functions**:
   ```typescript
   // Appwrite Function
   export default async ({ req, res }) => {
     const { messages, contexts } = JSON.parse(req.body)
     
     // Call Anthropic API
     const response = await anthropic.messages.create({...})
     
     res.json(parseAIResponse(response))
   }
   ```

2. **Update Service Layer**:
   ```typescript
   // Create AppwriteAnthropicService.ts
   class AppwriteAnthropicService {
     async sendMessage(messages, contexts) {
       const execution = await functions.createExecution(
         'anthropic-chat-function-id',
         JSON.stringify({ messages, contexts })
       )
       return JSON.parse(execution.response)
     }
   }
   ```

3. **Database Integration** (Optional):
   - Appwrite Database for chat/context persistence
   - Realtime subscriptions for collaborative features

### Common Migration Steps

1. **Environment Variables**:
   ```env
   # Firebase
   FIREBASE_API_KEY=...
   FIREBASE_AUTH_DOMAIN=...
   ANTHROPIC_API_KEY=...
   
   # Appwrite
   APPWRITE_ENDPOINT=...
   APPWRITE_PROJECT_ID=...
   ANTHROPIC_API_KEY=...
   ```

2. **Update Imports**:
   ```typescript
   // Replace
   import { supabaseAnthropicService } from './services/supabaseAnthropicService'
   
   // With
   import { firebaseAnthropicService } from './services/firebaseAnthropicService'
   // or
   import { appwriteAnthropicService } from './services/appwriteAnthropicService'
   ```

3. **Minimal Store Changes**:
   - Stores remain largely unchanged
   - Only service injection points need updates
   - Local storage (IndexedDB) continues working

4. **Keep AI Response Structure**:
   - Maintain the same response format
   - Preserve thinking metadata structure
   - Context integration patterns stay the same

### Testing Migration

1. **Unit Tests**: Update service mocks
2. **Integration Tests**: Test new backend endpoints
3. **E2E Tests**: Verify full message flow
4. **Performance Tests**: Compare response times

### Deployment Considerations

- **Firebase**: Use Firebase Hosting for frontend
- **Appwrite**: Self-host or use Appwrite Cloud
- **Environment**: Separate dev/staging/prod configurations
- **Monitoring**: Set up function logs and error tracking

## Best Practices

1. **Service Abstraction**: Keep service interfaces consistent
2. **Error Handling**: Implement retry logic and fallbacks
3. **Caching**: Use React Query for server state
4. **Offline Support**: Maintain IndexedDB functionality
5. **Security**: Never expose API keys client-side

## Conclusion

The architecture is designed to be backend-agnostic. The main migration work involves:
1. Creating new cloud functions (Firebase/Appwrite)
2. Updating the service layer
3. Configuring authentication
4. Setting up environment variables

The stores, UI components, and context system remain unchanged, making migration straightforward.
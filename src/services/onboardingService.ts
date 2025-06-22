
import { v4 as uuidv4 } from 'uuid'
import { useChatStore } from '../stores/chatStore'
import { useContextStore } from '../stores/contextStore'

export const onboardingService = {
  async createFirstChat() {
    const chatStore = useChatStore.getState()
    const contextStore = useContextStore.getState()
    
    // Create a comprehensive "what can this app do" context
    const appFeaturesContext = {
      title: 'WhatsFLEX: Your Memory-Powered AI Assistant',
      description: 'Complete guide to WhatsFLEX features and capabilities',
      content: `# WhatsFLEX: Your Memory-Powered AI Assistant

## 🧠 **Core Innovation: Persistent Memory**
Unlike ChatGPT, I remember EVERYTHING across all conversations:
- Every detail you share becomes part of my knowledge about you
- I can reference information from weeks or months ago
- Context automatically builds up over time

## ✨ **Key Features**

### **Smart Context Suggestions**
- I'll suggest when to save important information
- Creates reusable knowledge from our conversations
- Helps me give more personalized responses

### **Cross-Chat Memory**
- Information from one conversation helps in completely different chats
- I can connect dots between different topics you've discussed
- Your knowledge base grows automatically

### **Context Library Management**
- Save and organize information I can reference anytime
- Create contexts manually or from conversation highlights
- Tag and categorize for easy discovery

### **Message-Based Context Creation**
- Turn any conversation into reusable knowledge
- I can suggest creating contexts from our discussions
- Build your personal AI knowledge base naturally

## 🎯 **Perfect For Remembering:**
- **Personal Projects**: Goals, progress, obstacles, ideas
- **Work Context**: Responsibilities, team members, processes
- **Family & Friends**: Preferences, important dates, relationships
- **Learning**: Skills you're developing, resources, progress
- **Technical Details**: Specifications, requirements, decisions
- **Creative Work**: Ideas, inspiration, feedback, iterations

## 💡 **Pro Tips for Best Results:**
1. **Be Specific**: The more detail you provide, the better I understand
2. **Share Context**: Tell me about your background, goals, and preferences
3. **Use Contexts**: Let me suggest saving important information
4. **Reference Past Conversations**: I can pull up previous discussions
5. **Guide My Learning**: Correct me when I misunderstand something

## 🚀 **Getting Started:**
- Start chatting naturally about anything you're working on
- I'll ask clarifying questions to understand you better
- When I suggest creating a context, it's because I found something worth remembering
- The more we chat, the more personalized my responses become

**Ready to build your personalized AI experience? Let's start with what's on your mind today!**`,
      type: 'knowledge' as const,
      tags: ['guide', 'features', 'onboarding', 'memory', 'ai-assistant'],
      category: 'Knowledge',
      size: 2048,
      usageCount: 0,
      lastUsed: new Date(),
      isPrivate: false,
      autoSuggest: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Add context to store
    const savedContext = contextStore.addContext(appFeaturesContext)
    
    // Create the first chat with an engaging title
    const firstChat = chatStore.createNewChat('🚀 Let\'s Get Started!')
    
    // Create a personalized welcome message that invites immediate interaction
    const welcomeMessage = {
      id: uuidv4(),
      chatId: firstChat.id,
      type: 'ai' as const,
      content: `Hey there! 🎉 Welcome to your **real** WhatsFLEX experience!

I just loaded up everything I know about my capabilities, and I'm genuinely excited to start learning about YOU. Unlike other AI assistants, I'll actually remember our conversations and build up knowledge about your world.

**I'm curious - what brings you here today?** Are you:

🚀 **Working on a project** I could help with?
🤔 **Facing a challenge** you'd like to talk through?
📚 **Learning something new** I could support?
💼 **Managing work stuff** that could use some AI assistance?
🎯 **Planning something** where my memory could be useful?

Or maybe you just want to **test me out** and see how this whole "memory-powered AI" thing works?

*The more you tell me, the better I get at helping you. I'll suggest saving important details as contexts so I never forget what matters to you.*

**So... what's on your mind?** ✨`,
      timestamp: new Date(),
      status: 'delivered' as const
    }
    
    // Add message to store
    chatStore.addMessage(welcomeMessage)
    
    // Attach the context to this chat
    contextStore.attachContextsToChat(firstChat.id, [savedContext.id])
    
    return firstChat.id
  }
}

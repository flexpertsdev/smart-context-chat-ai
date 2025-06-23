# Build Instructions - Smart Context Chat AI

## Project Setup Instructions

These self-executing instructions will guide you through building a complete Smart Context Chat AI application from scratch.

## Prerequisites

```bash
# Required tools
- Node.js 18+ with npm
- Git
- Code editor (VS Code recommended)
- Anthropic API key (get from https://console.anthropic.com/)
```

## Step 1: Project Initialization

```bash
# Create project with Vite
npm create vite@latest smart-context-chat-ai -- --template react-ts

# Navigate to project
cd smart-context-chat-ai

# Install core dependencies
npm install

# Install additional dependencies
npm install @supabase/supabase-js @tanstack/react-query zustand dexie
npm install react-router-dom framer-motion react-hook-form zod
npm install lucide-react uuid date-fns
npm install class-variance-authority clsx tailwind-merge
npm install -D @types/uuid
```

## Step 2: Configure Build Tools

### Update vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080,
    host: '::',
  },
})
```

### Update tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Step 3: Setup Tailwind CSS & shadcn/ui

```bash
# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install shadcn/ui dependencies
npm install tailwindcss-animate
npm install @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-toast
npm install @radix-ui/react-tooltip @radix-ui/react-switch @radix-ui/react-alert-dialog
```

### Create tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        whatsapp: {
          primary: "#25d366",
          dark: "#075e54",
          light: "#dcf8c6",
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## Step 4: Create Core Type System

### Create src/types/index.ts
```typescript
export interface Chat {
  id: string
  title: string
  lastMessage?: Message
  lastActivity: Date
  contextIds: string[]
  unreadCount: number
  isArchived: boolean
  tags: string[]
}

export interface Message {
  id: string
  chatId: string
  content: string
  type: 'user' | 'ai' | 'system'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  attachments?: Attachment[]
  aiThinking?: AIThinking
}

export interface Context {
  id: string
  title: string
  description: string
  content: string
  type: 'knowledge' | 'document' | 'chat'
  tags: string[]
  category: string
  size: number
  usageCount: number
  lastUsed: Date
  isPrivate: boolean
  autoSuggest: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AIThinking {
  messageId: string
  assumptions: Assumption[]
  uncertainties: Uncertainty[]
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoningChain: ReasoningStep[]
  suggestedContexts: string[]
}

// Add remaining types...
```

## Step 5: Setup State Management

### Create src/stores/appStore.ts
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // State
  user: User | null
  preferences: UserPreferences
  onboardingComplete: boolean
  
  // Actions
  setUser: (user: User | null) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  completeOnboarding: () => void
  resetDemo: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      preferences: {
        theme: 'light',
        liveThinking: true,
        notifications: true,
        autoSuggestContexts: true,
      },
      onboardingComplete: false,
      
      setUser: (user) => set({ user }),
      updatePreferences: (prefs) => 
        set((state) => ({ 
          preferences: { ...state.preferences, ...prefs } 
        })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetDemo: () => set({ 
        user: null, 
        onboardingComplete: false 
      }),
    }),
    {
      name: 'app-store',
    }
  )
)
```

### Create remaining stores (chatStore, contextStore)
Follow similar pattern for chat and context management stores.

## Step 6: Setup Service Layer

### Create src/services/storageService.ts
```typescript
import Dexie, { Table } from 'dexie'
import { Chat, Message, Context } from '@/types'

class AppDatabase extends Dexie {
  chats!: Table<Chat>
  messages!: Table<Message>
  contexts!: Table<Context>

  constructor() {
    super('SmartContextChatDB')
    this.version(1).stores({
      chats: 'id, lastActivity, isArchived',
      messages: 'id, chatId, timestamp',
      contexts: 'id, category, lastUsed, createdAt',
    })
  }
}

export const db = new AppDatabase()

export const storageService = {
  // Chat operations
  async saveChat(chat: Chat): Promise<void> {
    await db.chats.put(chat)
  },
  
  async getChat(id: string): Promise<Chat | undefined> {
    return await db.chats.get(id)
  },
  
  // Add remaining CRUD operations...
}
```

## Step 7: Create UI Components

### Create component structure
```bash
mkdir -p src/components/{ui,layout,chat,context,ai,settings}
```

### Create base UI components
Start with essential shadcn/ui components:
- Button
- Card
- Dialog
- Sheet
- Input
- Textarea
- Toast

### Create layout components
- AdaptiveLayout
- ResponsiveNavigation
- TabBar (mobile)
- Header

## Step 8: Implement Core Features

### 1. Chat Interface
- WhatsApp-style message bubbles
- Message composer with attachments
- Real-time typing indicators
- Message status tracking

### 2. AI Integration
- Anthropic Claude service
- Structured response parsing
- Live thinking visualization
- Context-aware responses

### 3. Context Management
- Context library browser
- Create/edit contexts
- Attach contexts to chats
- AI-powered context creation

### 4. Mobile Optimization
- Touch-friendly interfaces
- Bottom sheets for mobile
- Swipeable interactions
- Responsive layouts

## Step 9: Setup Routing

### Create src/App.tsx
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          <Route path="/contexts" element={<ContextLibrary />} />
          <Route path="/contexts/new" element={<CreateContext />} />
          <Route path="/contexts/:contextId" element={<ContextDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

## Step 10: Testing & Validation

### Setup test environment
```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Create test structure
- Unit tests for services
- Component tests with RTL
- Integration tests for flows
- E2E tests for critical paths

## Step 11: Production Build

### Build optimization
```bash
# Build for production
npm run build

# Test production build
npm run preview
```

### Performance checklist
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] First paint < 2s
- [ ] Time to interactive < 3s

## Step 12: Deployment

### Deploy to Netlify/Vercel
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Environment variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Validation Checklist

- [ ] Chat creation and messaging works
- [ ] AI responses display with thinking data
- [ ] Contexts can be created and attached
- [ ] Mobile layout is responsive
- [ ] Data persists across sessions
- [ ] Settings save properly
- [ ] No console errors
- [ ] Performance metrics met

## Next Steps

1. Add user authentication if needed
2. Implement file upload for contexts
3. Add streaming AI responses
4. Enhance context suggestions UI
5. Add analytics tracking
6. Implement export features

This completes the build instructions for Smart Context Chat AI!
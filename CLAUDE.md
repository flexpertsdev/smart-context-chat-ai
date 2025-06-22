# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Smart Context Chat AI - An AI-powered chat application with advanced context management, featuring live AI thinking visualization and persistent conversation storage.

## Development Commands

```bash
# Development
npm run dev        # Start dev server on http://localhost:8080
npm run build      # Production build
npm run build:dev  # Development build  
npm run preview    # Preview production build
npm run lint       # Run ESLint

# Dependency Management
npm install        # Install dependencies
```

## Architecture Overview

### Core Technologies
- **Frontend**: React 18.3 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand with persistence middleware
- **Backend**: Supabase (Edge Functions + Auth)
- **AI**: Anthropic Claude API
- **Local Storage**: Dexie (IndexedDB wrapper)
- **Server State**: TanStack Query

### State Management Architecture

The application uses Zustand stores with clear domain separation:

1. **appStore** (`src/stores/appStore.ts`)
   - Onboarding status
   - User preferences
   - UI settings (theme, layout)

2. **chatStore** (`src/stores/chatStore.ts`)
   - Messages and conversations
   - Active conversation management
   - Message persistence via Dexie

3. **contextStore** (`src/stores/contextStore.ts`)
   - Context library management
   - Context creation and updates
   - Search and filtering

### Service Layer Pattern

Services abstract external integrations:

- **anthropicService.ts**: Direct Claude API integration
- **supabaseAnthropicService.ts**: Supabase Edge Function wrapper
- **contextCreationService.ts**: AI-powered context generation
- **storageService.ts**: Dexie database operations
- **navigationService.ts**: Centralized routing logic

### Component Architecture

Components follow atomic design principles:

```
components/
├── ui/          # Base shadcn/ui components
├── layout/      # Page layouts (Adaptive, Standard, Universal)
├── chat/        # Chat-specific components
├── context/     # Context management components
├── ai/          # AI features (thinking drawer, indicators)
└── settings/    # Settings page sections
```

### Key Architectural Patterns

1. **Adaptive Layout System**
   - ResponsiveNavigation component for dynamic navigation
   - Mobile-first with breakpoint-aware components
   - TabBar for mobile, sidebar for desktop

2. **AI Thinking Visualization**
   - Real-time streaming of AI reasoning
   - Structured thinking data extraction
   - Interactive thinking drawer with live updates

3. **Context Management**
   - Context as reusable conversation snippets
   - AI-powered context generation from messages
   - Tag-based organization system

4. **Message Persistence**
   - Dexie for local IndexedDB storage
   - Automatic save on message creation
   - Conversation history management

### Backend Integration

**Supabase Edge Functions**:
- `/anthropic-chat`: Handles AI chat requests with streaming
- `/generate-context`: Creates contexts from message content

**Environment Variables**:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_ANTHROPIC_API_KEY
```

### Routing Structure

Using React Router v6:
- `/` - Home/Chat view
- `/onboarding` - New user onboarding
- `/context-library` - Context management
- `/settings` - User preferences
- `/context/:id` - Individual context details

### Development Patterns

1. **TypeScript First**
   - Strict typing throughout
   - Interface definitions in `src/types/index.ts`
   - Type-safe Zustand stores

2. **Component Composition**
   - Prefer composition over inheritance
   - Use custom hooks for logic reuse
   - Implement compound components for complex UI

3. **Responsive Design**
   - Mobile-first approach
   - `use-mobile` hook for responsive logic
   - Tailwind breakpoints: sm, md, lg, xl, 2xl

4. **Error Handling**
   - Toast notifications via Sonner
   - Try-catch blocks in async operations
   - Graceful fallbacks for failed API calls

### Performance Considerations

- Lazy loading for route components
- Memoization for expensive computations
- Virtual scrolling for message lists (planned)
- Optimistic updates for better UX

### Testing Approach

Currently no automated tests. When adding tests:
- Use Vitest for unit tests
- React Testing Library for components
- Mock Zustand stores for isolation

### Code Style

- Functional components only
- Custom hooks prefix: `use`
- Service functions: async/await pattern
- File naming: PascalCase for components, camelCase for utilities

### Common Development Tasks

**Adding a New Feature**:
1. Create component in appropriate folder
2. Add types to `src/types/index.ts`
3. Update relevant Zustand store if needed
4. Add service function if external API required
5. Update routing in App.tsx if new page

**Working with AI Features**:
- Check `anthropicService.ts` for API integration
- Use `extractThinkingContent` for parsing responses
- Handle streaming responses with proper state updates

**Managing State**:
- Keep UI state local when possible
- Use Zustand for cross-component state
- Persist important data with Dexie
- Use React Query for server state

### Current Implementation Status

~85% complete with core features working:
- ✅ Full Anthropic integration
- ✅ Live thinking drawer
- ✅ Context creation and management
- ✅ Message persistence
- ✅ Responsive design
- 🚧 Settings improvements pending
- 🚧 Performance optimizations needed
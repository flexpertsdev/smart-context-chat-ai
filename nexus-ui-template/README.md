# Nexus UI Template

A modern, adaptive UI system built with React, TypeScript, Tailwind CSS, and Framer Motion. This template provides a complete foundation for building AI-powered chat applications with context management.

## 🚀 Features

- **Adaptive Design**: Automatically adjusts layout for mobile, tablet, and desktop
- **Complete UI System**: Foundation components, layouts, and screens
- **AI-Ready**: Built-in chat interface with context management
- **Mobile-First**: WhatsApp-style UI with bottom sheets and native gestures
- **Type-Safe**: Full TypeScript support throughout
- **Animated**: Smooth transitions with Framer Motion
- **Customizable**: Easy to theme and extend

## 📦 What's Included

### Foundation Components
- **Typography**: Heading and text components with variants
- **Button**: Multiple variants, sizes, loading states
- **Card**: Container component with hover effects
- **Theme**: Comprehensive design tokens

### Layout System
- **AdaptiveLayout**: Automatically switches between device layouts
- **MobileLayout**: Mobile-specific with safe areas
- **TabletLayout**: Compact sidebar navigation
- **DesktopLayout**: Full sidebar navigation

### Navigation
- **NexusNavigation**: Adaptive navigation component
  - Mobile: Bottom tabs + header
  - Tablet: Compact sidebar
  - Desktop: Full sidebar

### Chat Components
- **MessageBubble**: WhatsApp-style messages with status
- **MessageComposer**: Rich input with attachments
- **ChatHeader**: Chat header with actions
- **ContextBottomSheet**: Mobile-friendly context selector

### Context Management
- **ContextCard**: Display context information
- **ContextSelector**: Multi-select context picker
- **ContextDetails**: Full CRUD for contexts

### AI Components
- **ThinkingIndicator**: Multiple variants
- **AIInsightsPanel**: Floating insights display

### Screens
- **Home**: Dashboard with quick actions
- **Chat**: Full messaging interface
- **Chat List**: Conversation history
- **Contexts**: Context library with search
- **Context Details**: View/edit contexts
- **Insights**: AI analytics dashboard
- **Settings**: Preferences management
- **Profile**: User profile editing

## 🛠️ Installation

1. **Copy the Nexus folder** into your project's `src` directory

2. **Install dependencies**:
   ```bash
   npm install framer-motion lucide-react
   # or
   yarn add framer-motion lucide-react
   ```

3. **Ensure you have Tailwind CSS configured** in your project

4. **Add the Nexus routes** to your main App component:
   ```tsx
   import NexusApp from './nexus/NexusApp'
   
   // In your routes
   <Route path="/nexus/*" element={<NexusApp />} />
   ```

5. **Add mobile viewport fixes** to your global CSS:
   ```css
   /* Prevent body scroll on mobile */
   html, body {
     overflow: hidden;
     position: fixed;
     width: 100%;
     height: 100%;
   }
   
   #root {
     height: 100%;
     overflow: hidden;
   }
   ```

## 🎨 Customization

### Theme
Edit `nexus/foundations/theme.ts` to customize:
- Colors
- Typography
- Spacing
- Shadows
- Border radius

### Components
All components are built to be easily extended. Example:

```tsx
import Button from './nexus/foundations/Button'

// Use as-is
<Button variant="primary">Click me</Button>

// Or extend
const CustomButton = styled(Button)`
  background: linear-gradient(45deg, #667eea 30%, #764ba2 90%);
`
```

## 📱 Mobile Considerations

- Safe area insets are handled automatically
- Bottom sheets for mobile context selection
- Native scroll behavior with overscroll protection
- Touch-optimized tap targets (44px minimum)
- Gesture support for swipe actions

## 🏗️ Project Structure

```
nexus/
├── foundations/          # Core design system
│   ├── theme.ts         # Design tokens
│   ├── Button.tsx       # Button component
│   ├── Card.tsx         # Card component
│   └── Typography.tsx   # Text components
├── layouts/             # Layout components
│   ├── AdaptiveLayout.tsx
│   ├── MobileLayout.tsx
│   ├── TabletLayout.tsx
│   └── DesktopLayout.tsx
├── components/          # Reusable components
│   ├── NexusNavigation.tsx
│   ├── chat/
│   ├── context/
│   └── ai/
├── screens/             # Page components
│   ├── NexusHome.tsx
│   ├── NexusChat.tsx
│   ├── NexusChatList.tsx
│   └── ...
├── NexusApp.tsx         # Main app component
└── NexusShowcase.tsx    # Component showcase
```

## 🚀 Quick Start

1. Copy the template to your project
2. Install dependencies
3. Add routing
4. Start building!

```tsx
// Example: Using in your app
import { Routes, Route } from 'react-router-dom'
import NexusApp from './nexus/NexusApp'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<NexusApp />} />
    </Routes>
  )
}
```

## 🤝 Best Practices

1. **Keep components small**: Each component should have a single responsibility
2. **Use TypeScript**: All components are fully typed
3. **Follow the pattern**: Consistency is key for maintainability
4. **Mobile-first**: Design for mobile, enhance for desktop
5. **Test thoroughly**: Especially on real devices

## 📄 License

This template is free to use for any project. Enjoy!

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Framer Motion.
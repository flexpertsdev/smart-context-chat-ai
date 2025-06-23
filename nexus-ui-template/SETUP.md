# Nexus UI Template - Setup Guide

## Quick Setup (5 minutes)

### 1. Create a new React + TypeScript project

```bash
# Using Vite (recommended)
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install

# Or using Create React App
npx create-react-app my-app --template typescript
cd my-app
```

### 2. Install Tailwind CSS

```bash
# Install Tailwind and its peer dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Update tailwind.config.js
```

```js
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Mobile viewport fixes */
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

### 3. Install required dependencies

```bash
npm install react-router-dom framer-motion lucide-react
```

### 4. Copy Nexus folder

Copy the `nexus` folder from this template into your project's `src` directory.

### 5. Update your App.tsx

```tsx
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NexusApp from './nexus/NexusApp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<NexusApp />} />
      </Routes>
    </Router>
  )
}

export default App
```

### 6. Run your app

```bash
npm run dev
```

Visit `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) to see your Nexus UI!

## Customization Examples

### Change the primary color

Edit `src/nexus/foundations/theme.ts`:

```ts
primary: {
  50: '#your-color-50',
  100: '#your-color-100',
  // ... etc
}
```

### Add your own API integration

Replace the mock data in screens with your API calls:

```tsx
// src/nexus/screens/NexusChat.tsx
const handleSendMessage = async (content: string) => {
  // Replace this with your API call
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: content })
  })
  // Handle response...
}
```

### Add authentication

Wrap the NexusApp with your auth provider:

```tsx
import { AuthProvider } from './auth'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<NexusApp />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
```

## Common Issues

### Tailwind styles not working
- Make sure Tailwind is properly configured
- Check that your CSS file is imported in main.tsx/index.tsx
- Restart your dev server

### Routing not working
- Ensure react-router-dom is installed
- Check that you're wrapping with BrowserRouter
- For production, configure your server for client-side routing

### Mobile layout issues
- Add the viewport meta tag to your index.html:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  ```
- Ensure the mobile CSS fixes are added

## Next Steps

1. **Replace mock data** with your real backend
2. **Add authentication** if needed
3. **Customize the theme** to match your brand
4. **Build additional screens** using the existing components
5. **Deploy** to your preferred hosting service

## Deployment

### Netlify
```bash
npm run build
# Drop the 'dist' folder into Netlify
```

### Vercel
```bash
npm i -g vercel
vercel
```

### Traditional hosting
```bash
npm run build
# Upload contents of 'dist' folder to your server
# Configure server to redirect all routes to index.html
```
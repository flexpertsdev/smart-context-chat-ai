# Design System Analyzer Tool

A portable, zero-config tool to analyze and rebuild any React project's design system. Just copy this folder into your project and run!

## Quick Start

```bash
# 1. Copy this folder into your project root
cp -r design-analyzer-tool /path/to/your/project/

# 2. Run the analyzer
cd /path/to/your/project/design-analyzer-tool
npm install
npm run analyze
```

## What It Does

- 🔍 **Analyzes** your existing components and design patterns
- 🎨 **Detects** colors, typography, spacing, and layouts
- 📊 **Shows** confidence scores for detected patterns
- 🖼️ **Previews** suggested improvements
- 🔧 **Generates** updated design system files
- ✅ **Non-destructive** - creates new files, doesn't modify existing ones

## Usage Options

```bash
# Analyze only (no changes)
npm run analyze

# Interactive mode (recommended)
npm run rebuild

# Automatic mode (applies best patterns)
npm run rebuild:auto

# With visual preview server
npm run rebuild:preview
```

## What Gets Generated

After running the tool, you'll get:

```
your-project/
├── design-analyzer-tool/          # The tool itself
└── generated-design-system/       # NEW - Your rebuilt design system
    ├── theme/
    │   ├── colors.css            # Extracted color system
    │   ├── typography.css        # Typography scales
    │   └── spacing.css           # Consistent spacing
    ├── components/
    │   ├── Button.tsx            # Updated components
    │   ├── Card.tsx
    │   └── Navigation.tsx
    ├── layouts/
    │   ├── AppShell.tsx          # Responsive layouts
    │   └── MobileNav.tsx
    └── migration-guide.md        # How to apply changes
```

## Requirements

- Node.js 14+
- React project with TypeScript/JavaScript
- Tailwind CSS (optional but recommended)

## How It Works

1. **Scans** all `.tsx`, `.jsx`, `.ts`, `.js` files
2. **Extracts** className patterns and style usage
3. **Detects** design patterns using AI-like pattern matching
4. **Suggests** improvements based on best practices
5. **Generates** new design system following your choices

## Common Fixes

- ❌ `min-h-screen` → ✅ `min-h-dvh` (mobile viewport fix)
- ❌ Inconsistent spacing → ✅ Unified spacing system
- ❌ Desktop-only navigation → ✅ Responsive navigation
- ❌ Small touch targets → ✅ 44px minimum touch targets
- ❌ Multiple button styles → ✅ Consistent component system

## Privacy & Security

- Runs 100% locally
- No data sent anywhere
- Only reads files, doesn't modify originals
- Open source - check the code yourself
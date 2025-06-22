# Design System Migration Guide

Generated on: 6/17/2025

## Overview

This guide helps you migrate to the improved design system based on the analysis of your project.

## Detected Patterns

- **Navigation**: top-nav
- **Style**: minimal
- **Layout**: single-column
- **Spacing**: comfortable

## Issues to Fix

- [ ] Found 2 files using min-h-screen (breaks on mobile)
- [ ] Found 350 buttons with touch targets < 44px
- [ ] Inconsistent spacing: 10 different values found

## Step-by-Step Migration

### 1. Update CSS Variables

Copy the contents of `theme/variables.css` to your global CSS file.

### 2. Update Tailwind Config

Merge the generated `theme/tailwind.config.js` with your existing config.

### 3. Fix Viewport Heights

Replace all instances of:
```
min-h-screen → min-h-dvh
h-screen → h-dvh
```

### 4. Fix Touch Targets

Update all buttons to use the new button component with minimum 44px height.

### 5. Standardize Spacing

Use the new spacing variables:
- `space-xs` (4px)
- `space-sm` (8px)
- `space-md` (12px)
- `space-base` (16px)
- `space-lg` (24px)
- `space-xl` (32px)

## Testing

After migration:
1. Test on real mobile devices
2. Check all touch targets are at least 44px
3. Verify navigation works on all screen sizes
4. Ensure consistent spacing throughout

## Rollback

All original files remain untouched. To rollback:
1. Delete the `generated-design-system` folder
2. Continue using your original design system

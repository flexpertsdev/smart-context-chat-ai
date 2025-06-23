# Cleanup and Organization Plan

## Current Project Structure Analysis

### Active Components (Nexus UI)
- `/src/nexus/` - All active UI components
- `/src/App.tsx` - Main app entry
- `/src/main.tsx` - React entry point
- `/src/styles/index.css` - Consolidated CSS

### Services & Stores (Still in use)
- `/src/services/` - Backend services (need review)
- `/src/stores/` - State management (need review)
- `/src/integrations/supabase/` - Supabase integration

### Potentially Unused Files
1. **Old CSS Files** (backed up)
   - `src/index.css.backup`
   - `src/App.css.backup`

2. **Old Components** (if any exist outside nexus)
   - Check `/src/components/` for non-nexus components
   - Check `/src/pages/` for old pages

3. **Unused Dependencies**
   - Many Radix UI components in package.json may not be used
   - Check actual usage vs installed packages

## Recommended Actions

### 1. File Cleanup
```bash
# Remove backup CSS files
rm src/index.css.backup src/App.css.backup

# Archive old components (if any)
mkdir -p archive/old-components
# mv src/components/* archive/old-components/ 2>/dev/null
# mv src/pages/* archive/old-pages/ 2>/dev/null
```

### 2. Documentation Organization
```bash
# Create organized docs structure
mkdir -p docs/archive
mkdir -p docs/active

# Move task docs to archive
mv docs/Tasks docs/archive/

# Move old docs
mv IMPLEMENTATION_STATUS.md docs/archive/
mv IMPLEMENTATION_GUIDE.md docs/archive/
mv UX_IMPROVEMENT_TASKS.md docs/archive/
mv ANALYSIS/ docs/archive/
mv REVIEW/ docs/archive/

# Keep active docs in root
# - README.md
# - CLAUDE.md
# - BACKEND_HANDOVER.md
# - MOBILE_OPTIMIZATIONS.md
# - LAYOUT_HIERARCHY_VALIDATION_REPORT.md
```

### 3. Build Configuration
Create `.github/workflows/build.yml`:
```yaml
name: Build and Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run linter
      run: npm run lint
      
    - name: Build project
      run: npm run build
      
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
```

### 4. Package Cleanup
Analyze and remove unused dependencies:
```bash
# Install depcheck globally
npm install -g depcheck

# Run dependency check
depcheck

# Remove unused packages
# npm uninstall [unused-package-names]
```

### 5. Services Review
Review which services are actually used:
- `anthropicService.ts` - Check if used by Nexus
- `supabaseAnthropicService.ts` - Check if used
- `contextCreationService.ts` - Check if used
- `navigationService.ts` - May be obsolete
- `onboardingService.ts` - Check if needed

## Execution Order
1. ✅ Remove page load animations (DONE)
2. Archive documentation
3. Clean up unused files
4. Set up GitHub Actions
5. Review and clean dependencies
6. Review services usage
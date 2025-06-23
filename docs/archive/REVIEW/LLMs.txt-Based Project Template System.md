# LLMs.txt-Based Project Template System

## Concept Overview

A revolutionary project template system where **every file is either an `llms.txt` guidance document or a placeholder code file containing only intelligent comments**. The AI navigates through a cascading pyramid of context, understanding the entire project architecture before writing a single line of code.

---

## Template Structure Philosophy

### **Hierarchical Knowledge Cascade**
```
PROJECT_ROOT.llms.txt (Master Overview)
├── ARCHITECTURE.llms.txt (System Design)
├── TECH_STACK.llms.txt (Technology Decisions)
├── DESIGN_SYSTEM.llms.txt (UI/UX Principles)
├── FEATURES.llms.txt (Feature Specifications)
├── WORKFLOWS.llms.txt (User Journeys)
├── PITFALLS.llms.txt (Common Mistakes to Avoid)
└── src/
    ├── MODULE.llms.txt (Per-module guidance)
    ├── component.tsx (Placeholder with comments)
    └── service.ts (Placeholder with comments)
```

### **AI Navigation Principles**
1. **Start at the top**: Always read PROJECT_ROOT.llms.txt first
2. **Follow the breadcrumbs**: Each file points to related files
3. **Understand before coding**: Read context before implementation
4. **Validate decisions**: Check against design principles and pitfalls

---

## Master Template: Next.js SaaS Application

### **PROJECT_ROOT.llms.txt**
```markdown
# PROJECT: FlexDeploy SaaS Platform
# LAST_UPDATED: 2025-01-13
# NAVIGATION_START: Read this file completely, then proceed to ARCHITECTURE.llms.txt

## PROJECT OVERVIEW
A modern SaaS platform for one-click deployments with user management, billing, and analytics.
Target users: Developers, agencies, non-technical users wanting quick deployments.

## CORE VALUE PROPOSITION
- Zero-config deployments from GitHub to live sites
- Template library with guaranteed success rates
- Real-time deployment monitoring and status
- Team collaboration and project management

## PROJECT SCOPE & CONSTRAINTS
- MVP: Single-user deployments with 5 free templates
- Timeline: 8 weeks to MVP
- Budget: Optimize for serverless/free tiers
- Scale: 1000 deployments/month initially

## TECH STACK OVERVIEW
- Frontend: Next.js 15 + React 19 + TypeScript
- Styling: Tailwind CSS + shadcn/ui components
- Backend: Supabase (Auth + Database + Edge Functions)
- Deployment: Netlify with custom domain
- Payment: Stripe integration for premium features

## PROJECT STRUCTURE NAVIGATION
1. ARCHITECTURE.llms.txt - System design and data flow
2. TECH_STACK.llms.txt - Detailed technology decisions
3. DESIGN_SYSTEM.llms.txt - UI/UX principles and components
4. FEATURES.llms.txt - Feature specifications and requirements
5. WORKFLOWS.llms.txt - User journeys and interaction flows
6. PITFALLS.llms.txt - Common mistakes and how to avoid them

## SUCCESS METRICS
- Deployment success rate: >95%
- Time to first deployment: <2 minutes
- User activation rate: >60%
- Monthly recurring revenue: $5k by month 6

## NEXT_FILE: Read ARCHITECTURE.llms.txt to understand system design
```

### **ARCHITECTURE.llms.txt**
```markdown
# SYSTEM ARCHITECTURE & DATA FLOW
# CONTEXT: Read after PROJECT_ROOT.llms.txt
# NEXT_FILES: TECH_STACK.llms.txt, src/lib/CORE_SERVICES.llms.txt

## ARCHITECTURAL PRINCIPLES
1. **Serverless-First**: Minimize server maintenance and costs
2. **Edge-Native**: Deploy close to users for performance
3. **Real-time**: WebSocket connections for live updates
4. **Fail-Safe**: Graceful degradation and error recovery
5. **Observable**: Comprehensive logging and monitoring

## SYSTEM DIAGRAM
```
[User Browser] 
    ↓ (Authentication)
[Next.js Frontend] 
    ↓ (API Calls)
[Supabase Edge Functions] 
    ↓ (Repository Operations)
[GitHub/GitLab APIs] 
    ↓ (Deployment)
[Netlify API] → [Live Site]
```

## DATA FLOW ARCHITECTURE
### Authentication Flow
User → Next.js → Supabase Auth → JWT Token → Protected Routes

### Deployment Flow  
1. User submits GitHub URL
2. Frontend validates URL format
3. Edge Function: Fork repository 
4. Edge Function: Import to GitLab
5. Edge Function: Create Netlify site
6. WebSocket: Stream deployment status
7. Frontend: Display live site URL

## DATABASE SCHEMA OVERVIEW
- **users**: Authentication and profile data
- **deployments**: Deployment history and status
- **templates**: Curated template library
- **organizations**: Team management (future)
- **analytics**: Usage metrics and insights

## SECURITY ARCHITECTURE
- Row Level Security (RLS) on all tables
- API rate limiting on Edge Functions
- Environment variable encryption
- CORS policies for API access
- Content Security Policy headers

## PERFORMANCE ARCHITECTURE
- Edge caching for static assets
- Database connection pooling
- Lazy loading for non-critical components
- Image optimization with Next.js Image
- Bundle splitting by route

## FILE_LOCATIONS:
- Database schema: src/lib/database/SCHEMA.llms.txt
- API endpoints: src/app/api/README.llms.txt
- Authentication: src/lib/auth/AUTH_FLOW.llms.txt
- Deployment logic: src/lib/deployment/DEPLOYMENT_ENGINE.llms.txt

## NEXT_FILE: Read TECH_STACK.llms.txt for technology decisions
```

### **DESIGN_SYSTEM.llms.txt**
```markdown
# DESIGN SYSTEM & UI PRINCIPLES
# CONTEXT: Read after understanding architecture
# APPLIES_TO: All UI components and styling decisions

## DESIGN PHILOSOPHY
"Functional Beauty" - Every design decision serves both aesthetic and functional purposes.
- Clarity over cleverness
- Consistency over creativity  
- Performance over perfection
- Accessibility as a foundation, not an afterthought

## VISUAL HIERARCHY MATHEMATICS
### Typography Scale (Perfect Fourth - 1.333 ratio)
- xs: 0.75rem (12px)
- sm: 1rem (16px) ← Base size
- md: 1.33rem (21px)
- lg: 1.77rem (28px)
- xl: 2.36rem (38px)
- 2xl: 3.15rem (50px)

### Spacing System (8px base grid)
- 1: 0.25rem (4px) - Micro spacing
- 2: 0.5rem (8px) - Small spacing  
- 3: 0.75rem (12px) - Component padding
- 4: 1rem (16px) - Standard spacing
- 6: 1.5rem (24px) - Section spacing
- 8: 2rem (32px) - Large spacing
- 12: 3rem (48px) - Layout spacing

## COLOR SYSTEM PSYCHOLOGY
### Primary Palette (Trust & Action)
- Blue 500: #3B82F6 (Primary actions, links)
- Blue 600: #2563EB (Hover states)
- Blue 50: #EFF6FF (Subtle backgrounds)

### Semantic Colors (Communication)
- Green 500: #10B981 (Success, positive actions)
- Red 500: #EF4444 (Errors, destructive actions)
- Amber 500: #F59E0B (Warnings, pending states)
- Gray 500: #6B7280 (Secondary text, borders)

### Usage Rules
- Primary blue: Call-to-action buttons, active states
- Semantic colors: Status indicators, alerts only
- Gray scale: Text hierarchy, borders, backgrounds
- Never use more than 3 colors in a single component

## COMPONENT DESIGN PRINCIPLES
### Atomic Design Structure
1. **Tokens**: Colors, typography, spacing values
2. **Atoms**: Button, Input, Label, Icon
3. **Molecules**: SearchBox, StatusCard, Navigation
4. **Organisms**: Header, DeploymentDashboard, TemplateGrid
5. **Templates**: PageLayout, DashboardLayout
6. **Pages**: HomePage, DashboardPage, TemplatesPage

### Component Consistency Rules
- All interactive elements have hover, focus, and disabled states
- Loading states for any action taking >200ms
- Error states with clear recovery actions
- Empty states with helpful guidance
- Responsive behavior on all screen sizes

## ACCESSIBILITY MATHEMATICS
### Color Contrast Requirements
- Normal text: 4.5:1 minimum ratio
- Large text (18px+): 3:1 minimum ratio
- Interactive elements: 3:1 for boundaries
- Disabled elements: No contrast requirement

### Touch Target Sizing
- Minimum: 44x44px for mobile interactions
- Recommended: 48x48px for comfortable use
- Spacing: 8px minimum between adjacent targets

### Focus Management
- Tab order follows reading order (left-to-right, top-to-bottom)
- Skip links for keyboard navigation
- Focus visible on all interactive elements
- Focus trap in modals and dropdowns

## RESPONSIVE DESIGN BREAKPOINTS
```css
/* Mobile-first approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Large desktops */
2xl: 1536px /* Extra large screens */
```

### Component Responsive Behavior
- Stack vertically on mobile, grid on desktop
- Collapse navigation to hamburger <768px
- Reduce padding/margins on smaller screens
- Single column layout <640px

## ANIMATION & MICRO-INTERACTION PRINCIPLES
### Timing Functions
- Ease-out: UI elements entering (0.2s ease-out)
- Ease-in: UI elements exiting (0.15s ease-in)
- Spring: Interactive feedback (0.3s spring)

### Animation Purposes
- **Feedback**: Button press, form submission
- **Transition**: Page changes, state updates
- **Attention**: Important notifications, errors
- **Guidance**: User flow, feature discovery

### Performance Rules
- Animate only transform and opacity properties
- Use will-change sparingly and remove after animation
- Prefer CSS animations over JavaScript for simple effects
- Always provide prefers-reduced-motion alternatives

## COMPONENT_FILES_TO_EXAMINE:
- src/components/ui/BUTTON.llms.txt - Button component specifications
- src/components/ui/FORM.llms.txt - Form component guidelines
- src/components/layout/NAVIGATION.llms.txt - Navigation patterns
- src/components/features/DEPLOYMENT_STATUS.llms.txt - Status components

## NEXT_FILE: Read FEATURES.llms.txt to understand feature requirements
```

### **PITFALLS.llms.txt**
```markdown
# COMMON PITFALLS & HOW TO AVOID THEM
# CRITICAL: Read this before implementing any feature
# CONTEXT: Lessons learned from failed deployments and user research

## DEPLOYMENT PITFALLS

### ❌ PITFALL 1: Assuming Environment Variables Exist
**Common Mistake**: Writing code that requires API keys or database URLs
```typescript
// BAD - Will fail in production
const apiKey = process.env.OPENAI_API_KEY; // Undefined!
```

**Solution**: Always provide fallbacks and clear error messages
```typescript
// GOOD - Graceful degradation
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required. Set it in your Netlify dashboard.');
}
```

### ❌ PITFALL 2: Wrong Build Output Directory
**Common Mistake**: Hardcoding build directories without checking framework
```toml
# BAD - Wrong for Next.js
[build]
  publish = "dist"
```

**Solution**: Framework-specific configurations
```typescript
const getBuildConfig = (framework: string) => {
  switch(framework) {
    case 'nextjs': return { publish: '.next', command: 'npm run build' };
    case 'vite': return { publish: 'dist', command: 'npm run build' };
    case 'gatsby': return { publish: 'public', command: 'gatsby build' };
    default: return { publish: 'dist', command: 'npm run build' };
  }
};
```

### ❌ PITFALL 3: Not Handling Monorepos
**Common Mistake**: Treating all repositories as single-app projects
```bash
# BAD - Builds entire monorepo
npm run build
```

**Solution**: Detect and handle monorepo structures
```typescript
const isMonorepo = await checkForMonorepo(repoPath);
if (isMonorepo) {
  // Use workspace-specific build commands
  buildCommand = `npm run build --workspace=${targetApp}`;
}
```

## USER EXPERIENCE PITFALLS

### ❌ PITFALL 4: No Loading States
**Common Mistake**: Users see blank screens during deployments
```typescript
// BAD - No feedback during deployment
const deploy = async () => {
  const result = await deployToNetlify(repoUrl);
  setDeploymentResult(result);
};
```

**Solution**: Progressive status updates
```typescript
// GOOD - Step-by-step feedback
const deploy = async () => {
  setStatus('Forking repository...');
  await forkRepository(repoUrl);
  
  setStatus('Importing to GitLab...');
  await importToGitLab(forkUrl);
  
  setStatus('Creating Netlify site...');
  const result = await deployToNetlify(gitlabUrl);
  
  setStatus('Deployment complete!');
  setDeploymentResult(result);
};
```

### ❌ PITFALL 5: Showing Live URLs Before Site is Ready
**Common Mistake**: Users click links and see 404 errors
```typescript
// BAD - URL shown immediately
return <a href={deploymentUrl}>View Site</a>;
```

**Solution**: Verify site availability before showing link
```typescript
// GOOD - Wait for site to be live
const [siteReady, setSiteReady] = useState(false);

useEffect(() => {
  if (deploymentUrl) {
    pollSiteAvailability(deploymentUrl).then(setSiteReady);
  }
}, [deploymentUrl]);

return siteReady ? (
  <a href={deploymentUrl}>View Live Site</a>
) : (
  <span>Site is building... ⏳</span>
);
```

## SECURITY PITFALLS

### ❌ PITFALL 6: Exposing API Keys in Frontend
**Common Mistake**: Including sensitive keys in client-side code
```typescript
// BAD - Exposed to all users
const GITHUB_TOKEN = 'ghp_your_secret_token';
```

**Solution**: Use server-side functions for API calls
```typescript
// GOOD - Keep secrets on server
// In Edge Function:
const GITHUB_TOKEN = Deno.env.get('GITHUB_TOKEN');

// In Frontend:
const deployRepo = async (repoUrl: string) => {
  return fetch('/api/deploy', {
    method: 'POST',
    body: JSON.stringify({ repoUrl })
  });
};
```

### ❌ PITFALL 7: No Input Validation
**Common Mistake**: Trusting user input without validation
```typescript
// BAD - No validation
const deployRepository = async (url: string) => {
  return await githubApi.fork(url); // Could be malicious
};
```

**Solution**: Strict input validation
```typescript
// GOOD - Validate GitHub URLs
const isValidGitHubUrl = (url: string): boolean => {
  const pattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
  return pattern.test(url);
};

const deployRepository = async (url: string) => {
  if (!isValidGitHubUrl(url)) {
    throw new Error('Invalid GitHub repository URL');
  }
  return await githubApi.fork(url);
};
```

## PERFORMANCE PITFALLS

### ❌ PITFALL 8: Blocking UI During Long Operations
**Common Mistake**: Synchronous operations freezing the interface
```typescript
// BAD - Blocks UI for minutes
const result = await longRunningDeployment(repoUrl);
```

**Solution**: Background processing with WebSocket updates
```typescript
// GOOD - Non-blocking with real-time updates
const startDeployment = async (repoUrl: string) => {
  const deploymentId = await initiateDeployment(repoUrl);
  
  // Connect to WebSocket for real-time updates
  const ws = new WebSocket(`wss://api.example.com/deployments/${deploymentId}`);
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    updateDeploymentStatus(update);
  };
};
```

### ❌ PITFALL 9: Not Caching Template Data
**Common Mistake**: Fetching template list on every page load
```typescript
// BAD - Slow loading
const Templates = () => {
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    fetchTemplates().then(setTemplates); // Every time!
  }, []);
};
```

**Solution**: Smart caching strategy
```typescript
// GOOD - Cache with revalidation
const useTemplates = () => {
  return useSWR('/api/templates', fetchTemplates, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });
};
```

## ERROR HANDLING PITFALLS

### ❌ PITFALL 10: Generic Error Messages
**Common Mistake**: Unhelpful error messages for users
```typescript
// BAD - Not actionable
catch (error) {
  setError('Something went wrong');
}
```

**Solution**: Contextual, actionable error messages
```typescript
// GOOD - Specific and actionable
catch (error) {
  if (error.status === 403) {
    setError('Repository access denied. Make sure the repository is public or you have permission to access it.');
  } else if (error.status === 404) {
    setError('Repository not found. Please check the URL and try again.');
  } else {
    setError(`Deployment failed: ${error.message}. Please try again or contact support.`);
  }
}
```

## TESTING PITFALLS

### ❌ PITFALL 11: Not Testing Error States
**Common Mistake**: Only testing happy path scenarios
```typescript
// BAD - Only tests success
test('deploys repository successfully', async () => {
  const result = await deployRepository('https://github.com/user/repo');
  expect(result.success).toBe(true);
});
```

**Solution**: Comprehensive error scenario testing
```typescript
// GOOD - Tests all scenarios
describe('Repository Deployment', () => {
  test('succeeds with valid repository', async () => {
    const result = await deployRepository('https://github.com/user/repo');
    expect(result.success).toBe(true);
  });
  
  test('fails with invalid URL', async () => {
    await expect(deployRepository('invalid-url')).rejects.toThrow('Invalid GitHub repository URL');
  });
  
  test('handles private repository access', async () => {
    const result = await deployRepository('https://github.com/user/private-repo');
    expect(result.error).toContain('access denied');
  });
});
```

## VALIDATION_CHECKLIST:
Before implementing any feature, verify:
- [ ] Input validation for all user inputs
- [ ] Error handling with actionable messages
- [ ] Loading states for all async operations
- [ ] No hardcoded environment variables
- [ ] Framework-specific build configurations
- [ ] Security review for API endpoints
- [ ] Performance optimization for long operations
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Error state testing

## NEXT_FILE: Examine specific implementation files in src/ directory
```

---

## Placeholder Code File Examples

### **src/components/ui/button.tsx**
```typescript
/*
 * BUTTON COMPONENT - Core UI Element
 * 
 * PURPOSE:
 * Primary interactive element following design system principles.
 * Handles all button variants, states, and accessibility requirements.
 * 
 * DESIGN_REQUIREMENTS: (Read DESIGN_SYSTEM.llms.txt)
 * - Size variants: xs, sm, md, lg, xl (following typography scale)
 * - Visual variants: primary, secondary, outline, ghost, destructive
 * - States: default, hover, focus, disabled, loading
 * - Accessibility: ARIA labels, keyboard navigation, screen reader support
 * 
 * TECHNICAL_REQUIREMENTS:
 * - Built with React.forwardRef for ref forwarding
 * - Uses Tailwind CSS classes with cva (class-variance-authority)
 * - Supports both onClick handlers and form submission
 * - Loading state shows spinner and disables interaction
 * - Proper TypeScript interfaces for all props
 * 
 * USAGE_EXAMPLES:
 * <Button variant="primary" size="md">Deploy Now</Button>
 * <Button variant="destructive" onClick={deleteProject}>Delete</Button>
 * <Button variant="outline" loading={isDeploying}>Deploy</Button>
 * 
 * ACCESSIBILITY_REQUIREMENTS:
 * - Minimum 44x44px touch target on mobile
 * - Color contrast ratio > 4.5:1 for text
 * - Focus visible indicator
 * - Disabled state announced to screen readers
 * - Loading state with aria-busy="true"
 * 
 * RELATED_FILES:
 * - ../DESIGN_SYSTEM.llms.txt (Design specifications)
 * - ../PITFALLS.llms.txt (Common button mistakes)
 * - ./button.stories.tsx (Storybook documentation)
 * - ./button.test.tsx (Component tests)
 * 
 * IMPLEMENTATION_NOTES:
 * 1. Use cva for variant management
 * 2. Forward refs for form integration
 * 3. Handle loading state with spinner
 * 4. Apply focus-visible ring styling
 * 5. Support polymorphic 'as' prop for flexibility
 * 
 * COMMON_PITFALLS_TO_AVOID:
 * - Don't use onClick for form submission (use type="submit")
 * - Don't forget disabled state styling
 * - Don't hardcode colors (use CSS variables)
 * - Don't skip loading state for async operations
 * - Don't use non-semantic HTML elements
 * 
 * TODO_WHEN_IMPLEMENTING:
 * 1. Read DESIGN_SYSTEM.llms.txt for exact color values
 * 2. Import cva and clsx utilities
 * 3. Define ButtonProps interface
 * 4. Create variant configurations
 * 5. Implement forwardRef component
 * 6. Add proper ARIA attributes
 * 7. Test with keyboard navigation
 * 8. Verify color contrast ratios
 * 
 * NEXT_FILE_TO_READ: ./form-input.tsx for form component patterns
 */

// Implementation goes here after reading all context
```

### **src/lib/deployment/deployment-engine.ts**
```typescript
/*
 * DEPLOYMENT ENGINE - Core Business Logic
 * 
 * PURPOSE:
 * Orchestrates the entire deployment pipeline fr
# CLAUDE.md - Project Reverse Engineering & Build Workflow

## Overview
This document defines the complete end-to-end workflow for Claude Code to reverse engineer imported project repositories and build new projects based on comprehensive analysis. The system operates through two main phases: **Analysis** (reverse engineering) and **Build** (project creation).

## Project Structure

```
/CLAUDE.md              # This workflow file
/TOOLS/                 # Custom scripts and utilities
  ├── file_indexer.js
  ├── component_mapper.js
  ├── dependency_analyzer.js
  ├── theme_extractor.js
  └── build_generator.js
/DOCS/                  # Documentation and templates
  ├── import_analysis_template.md
  ├── build_guide.md
  ├── ai_guides/
  └── best_practices.md
/SPACES/                # Project workspaces
  ├── 01_imported_project_[name]/
  │   ├── INPUT/         # Original cloned project
  │   └── OUTPUT/        # Analysis results
  └── 02_imported_project_[name]/
      ├── INPUT/
      └── OUTPUT/
```

## Phase 1: Import & Analysis Workflow

### Step 1: Project Import
**Trigger**: Repository URL provided or manual project placement
**Tools**: GitHub MCP Server

```bash
# Auto-clone using GitHub MCP
github://clone [REPOSITORY_URL] -> /SPACES/[##]_imported_project_[repo_name]/INPUT/

# Manual placement verification
- Verify folder naming: ##_imported_project_[name]
- Confirm INPUT/OUTPUT structure exists
- Validate project is in INPUT subfolder
```

### Step 2: Initialize Analysis Workspace
**Action**: Setup analysis environment

```bash
# Create analysis template
cp /DOCS/import_analysis_template.md /SPACES/[current_space]/OUTPUT/import_analysis.md

# Initialize log files
touch /SPACES/[current_space]/OUTPUT/analysis.log
touch /SPACES/[current_space]/OUTPUT/file_tree.txt
touch /SPACES/[current_space]/OUTPUT/errors.log
```

### Step 3: File System Analysis
**Tools**: `file_indexer.js`

```javascript
// Generate complete file tree
const fileTree = indexProject('/SPACES/[current_space]/INPUT/')
writeToSection('import_analysis.md', 'FILE_TREE', fileTree)

// Identify project root and key files
const projectStructure = {
  root: detectProjectRoot(),
  packageJson: findFile('package.json'),
  configFiles: findFiles(['*.config.js', '*.config.ts', '.env*']),
  entryPoints: findFiles(['index.*', 'main.*', 'app.*'])
}
writeToSection('import_analysis.md', 'PROJECT_STRUCTURE', projectStructure)
```

### Step 4: Documentation Extraction
**Action**: Find and read all documentation

```bash
# Find all text/markdown files
find /SPACES/[current_space]/INPUT/ -name "*.md" -o -name "*.txt" -o -name "README*"

# Read and categorize documentation
for doc in documentFiles:
  content = readFile(doc)
  category = categorizeDocument(doc.name)
  writeToSection('import_analysis.md', 'DOCUMENTATION', {file: doc, content, category})
```

### Step 5: Application Architecture Analysis
**Tools**: `component_mapper.js`

```javascript
// Map all pages and routes
const pages = discoverPages({
  react: 'src/pages/, src/app/',
  nextjs: 'pages/, app/',
  flutter: 'lib/screens/, lib/pages/'
})
writeToSection('import_analysis.md', 'PAGES_ROUTES', pages)

// Map components for each page
const componentMap = {}
for (page of pages) {
  componentMap[page] = {
    directComponents: extractDirectImports(page),
    nestedComponents: traceComponentTree(page),
    sharedComponents: identifySharedComponents(page)
  }
}
writeToSection('import_analysis.md', 'COMPONENT_MAPPING', componentMap)
```

### Step 6: Design System Analysis
**Tools**: `theme_extractor.js`

```javascript
// Extract theme configuration
const designSystem = {
  globalTheme: extractGlobalTheme([
    'theme.js', 'theme.ts', 'tailwind.config.js', 
    'styles/globals.css', 'src/theme/'
  ]),
  colorPalette: extractColors(),
  typography: extractTypography(),
  spacing: extractSpacing(),
  breakpoints: extractBreakpoints(),
  designLibraries: identifyDesignLibraries([
    'material-ui', 'chakra-ui', 'ant-design', 'styled-components'
  ]),
  inlineStyles: scanInlineStyles()
}
writeToSection('import_analysis.md', 'DESIGN_SYSTEM', designSystem)
```

### Step 7: State & Data Management Analysis
**Tools**: `dependency_analyzer.js`

```javascript
// Identify state management
const stateManagement = {
  globalState: identifyStateManagement([
    'redux', 'zustand', 'context', 'recoil', 'mobx'
  ]),
  localStorage: scanLocalStorage(),
  sessionStorage: scanSessionStorage(),
  databases: identifyDatabases(),
  apiCalls: extractApiCalls(),
  dataTransformations: identifyDataTransforms()
}
writeToSection('import_analysis.md', 'STATE_DATA', stateManagement)
```

### Step 8: Type System Analysis

```javascript
// Extract TypeScript definitions
const typeSystem = {
  globalTypes: extractGlobalTypes(['types/', '@types/', '*.d.ts']),
  interfaces: extractInterfaces(),
  enums: extractEnums(),
  inlineTypes: scanInlineTypes(),
  generics: identifyGenerics(),
  apiTypes: extractApiTypes()
}
writeToSection('import_analysis.md', 'TYPE_SYSTEM', typeSystem)
```

### Step 9: Authentication & Security Analysis

```javascript
// Security implementation
const authSystem = {
  authProvider: identifyAuthProvider(),
  routeGuards: extractRouteGuards(),
  permissions: extractPermissions(),
  apiSecurity: analyzeApiSecurity(),
  encryption: identifyEncryption(),
  tokens: analyzeTokenHandling()
}
writeToSection('import_analysis.md', 'AUTHENTICATION', authSystem)
```

### Step 10: User Journey Mapping

```javascript
// Map complete user flows
const userJourneys = {
  publicFlows: mapPublicJourneys(),
  authenticatedFlows: mapAuthenticatedJourneys(),
  adminFlows: mapAdminJourneys(),
  errorStates: mapErrorHandling(),
  loadingStates: mapLoadingStates(),
  formFlows: mapFormJourneys()
}
writeToSection('import_analysis.md', 'USER_JOURNEYS', userJourneys)
```

### Step 11: Performance & Optimization Analysis

```javascript
// Performance patterns
const performance = {
  lazyLoading: identifyLazyLoading(),
  codesplitting: analyzeCodeSplitting(),
  caching: analyzeCaching(),
  bundleOptimization: analyzeBundling(),
  imageOptimization: analyzeImages(),
  apiOptimization: analyzeApiPatterns()
}
writeToSection('import_analysis.md', 'PERFORMANCE', performance)
```

### Step 12: Complete Analysis Review

```javascript
// Final validation and completion
const analysisValidation = {
  sectionsCompleted: validateAllSections('import_analysis.md'),
  missingData: identifyMissingSections(),
  analysisQuality: scoreAnalysisCompleteness(),
  recommendations: generateRecommendations()
}

// Mark analysis as complete
writeToSection('import_analysis.md', 'ANALYSIS_STATUS', 'COMPLETE')
writeToSection('import_analysis.md', 'VALIDATION', analysisValidation)
```

## Phase 2: Build Workflow

### Step 1: Pre-Build Analysis Review
**Action**: Comprehensive analysis review before building

```javascript
// Load and review complete analysis
const analysisData = loadAnalysis('/SPACES/[current_space]/OUTPUT/import_analysis.md')
const buildContext = {
  analysis: analysisData,
  userRequirements: loadUserRequirements(),
  aiGuides: loadAiGuides('/DOCS/ai_guides/'),
  toolsContext: loadTools('/TOOLS/'),
  docsContext: loadDocs('/DOCS/')
}

// Generate build strategy
const buildStrategy = generateBuildStrategy(buildContext)
writeToFile('/SPACES/[current_space]/OUTPUT/build_strategy.md', buildStrategy)
```

### Step 2: Feature Parity Planning

```javascript
// Determine build scope
const buildPlan = {
  featureParity: {
    coreFeatures: identifyCoreFeatures(analysisData),
    enhancedFeatures: identifyEnhancements(analysisData),
    newFeatures: identifyNewFeatures(userRequirements),
    deprecatedFeatures: identifyDeprecations(analysisData)
  },
  qualityImprovements: {
    codeQuality: planCodeQualityImprovements(),
    performance: planPerformanceImprovements(),
    accessibility: planAccessibilityImprovements(),
    testing: planTestingStrategy()
  },
  modernization: {
    dependencyUpdates: planDependencyUpdates(),
    architectureImprovements: planArchitectureUpdates(),
    securityEnhancements: planSecurityUpdates(),
    designSystemUpdates: planDesignSystemUpdates()
  }
}
writeToSection('build_strategy.md', 'BUILD_PLAN', buildPlan)
```

### Step 3: Mobile & Responsive Planning

```javascript
// Mobile-first considerations
const mobileStrategy = {
  responsiveBreakpoints: planResponsiveBreakpoints(),
  mobileOptimizations: planMobileOptimizations(),
  touchInteractions: planTouchInteractions(),
  performanceOptimizations: planMobilePerformance(),
  offlineCapabilities: planOfflineFeatures()
}
writeToSection('build_strategy.md', 'MOBILE_STRATEGY', mobileStrategy)
```

### Step 4: Technology Stack Selection

```javascript
// Select optimal technology stack
const techStack = {
  frontend: selectFrontendTech(analysisData, requirements),
  backend: selectBackendTech(analysisData, requirements),
  database: selectDatabase(analysisData, requirements),
  deployment: selectDeploymentStrategy(),
  monitoring: selectMonitoringTools(),
  testing: selectTestingFramework()
}
writeToSection('build_strategy.md', 'TECH_STACK', techStack)
```

### Step 5: Project Generation
**Tools**: `build_generator.js`

```javascript
// Generate new project structure
const newProject = generateProject({
  name: deriveProjectName(),
  techStack: techStack,
  features: buildPlan.featureParity.coreFeatures,
  enhancements: buildPlan.featureParity.enhancedFeatures,
  designSystem: analysisData.designSystem,
  architecture: buildPlan.modernization.architectureImprovements
})

// Create project files
createProjectStructure('/SPACES/[current_space]/OUTPUT/NEW_PROJECT/', newProject)
```

### Step 6: Feature Implementation

```javascript
// Implement features incrementally
for (feature of buildPlan.featureParity.coreFeatures) {
  const implementation = generateFeatureImplementation(feature, techStack)
  writeFeatureFiles(implementation)
  updateFeatureTests(feature)
  updateDocumentation(feature)
}

// Implement enhancements
for (enhancement of buildPlan.featureParity.enhancedFeatures) {
  const implementation = generateEnhancementImplementation(enhancement, techStack)
  writeFeatureFiles(implementation)
  updateFeatureTests(enhancement)
  updateDocumentation(enhancement)
}
```

### Step 7: Quality Assurance Implementation

```javascript
// Implement quality measures
const qualityImplementation = {
  linting: setupLinting(techStack),
  formatting: setupFormatting(techStack),
  testing: setupTesting(buildPlan.qualityImprovements.testing),
  ci_cd: setupCICD(),
  monitoring: setupMonitoring(techStack.monitoring),
  documentation: generateDocumentation()
}
implementQualityMeasures(qualityImplementation)
```

### Step 8: Build Validation & Testing

```javascript
// Validate build completeness
const buildValidation = {
  featureCompleteness: validateFeatureImplementation(),
  qualityChecks: runQualityChecks(),
  performanceTests: runPerformanceTests(),
  securityScans: runSecurityScans(),
  accessibilityTests: runAccessibilityTests(),
  mobileTests: runMobileTests()
}

// Generate build report
const buildReport = generateBuildReport(buildValidation)
writeToFile('/SPACES/[current_space]/OUTPUT/build_report.md', buildReport)
```

## Workflow Triggers

### Analysis Trigger
```bash
# Auto-trigger when new project detected in INPUT folder
watch /SPACES/*/INPUT/ -> execute_analysis_workflow()

# Manual trigger
claude-code run analysis --space [space_number]
```

### Build Trigger
```bash
# Auto-trigger when analysis marked complete
watch /SPACES/*/OUTPUT/import_analysis.md for "ANALYSIS_STATUS: COMPLETE" -> execute_build_workflow()

# Manual trigger with custom requirements
claude-code run build --space [space_number] --requirements [requirements_file]
```

## Error Handling & Recovery

### Analysis Phase Errors
```javascript
// Handle common analysis errors
const errorHandlers = {
  'FILE_NOT_FOUND': (error) => logWarning(error) && continueAnalysis(),
  'PARSE_ERROR': (error) => logError(error) && skipSection(),
  'DEPENDENCY_ERROR': (error) => logError(error) && useAlternativeMethod(),
  'TIMEOUT': (error) => logError(error) && retryWithTimeout()
}
```

### Build Phase Errors
```javascript
// Handle build errors gracefully
const buildErrorHandlers = {
  'GENERATION_ERROR': (error) => rollbackToLastStable() && reportError(),
  'DEPENDENCY_CONFLICT': (error) => resolveDependencies() && retry(),
  'VALIDATION_FAILURE': (error) => fixValidationIssues() && revalidate()
}
```

## Configuration & Customization

### Analysis Configuration
```javascript
// Configurable analysis depth
const analysisConfig = {
  depth: 'COMPREHENSIVE', // BASIC | STANDARD | COMPREHENSIVE
  includeTests: true,
  includeDependencies: true,
  includeDocumentation: true,
  customSections: [] // Additional analysis sections
}
```

### Build Configuration
```javascript
// Configurable build options
const buildConfig = {
  targetFramework: 'AUTO_DETECT', // Or specific framework
  qualityLevel: 'HIGH', // BASIC | STANDARD | HIGH | ENTERPRISE
  mobileFirst: true,
  includeTests: true,
  includeDocumentation: true,
  deploymentReady: true
}
```

## Logging & Monitoring

### Analysis Logging
```javascript
// Comprehensive logging during analysis
const logger = {
  info: (message) => log('INFO', message, 'analysis.log'),
  warn: (message) => log('WARN', message, 'analysis.log'),
  error: (message) => log('ERROR', message, 'errors.log'),
  debug: (message) => log('DEBUG', message, 'debug.log')
}
```

### Build Logging
```javascript
// Build progress tracking
const buildLogger = {
  progress: (step, total) => logProgress(step, total, 'build.log'),
  milestone: (milestone) => logMilestone(milestone, 'build.log'),
  completion: (status) => logCompletion(status, 'build.log')
}
```

## Integration Points

### MCP Server Integration
- GitHub MCP for repository operations
- File system MCP for local operations
- Custom MCP servers for specialized tools

### External Tool Integration
- ESLint/Prettier for code quality
- Jest/Vitest for testing
- Lighthouse for performance analysis
- axe-core for accessibility testing

## Success Criteria

### Analysis Success
- All template sections completed or marked as N/A
- File tree completely indexed
- Component relationships mapped
- Type system documented
- User journeys identified

### Build Success
- Project builds without errors
- All core features implemented
- Quality checks pass
- Documentation generated
- Deployment package created

## Maintenance & Updates

### Workflow Updates
- Regular template updates based on new frameworks
- Tool improvements and additions
- Error handling enhancements
- Performance optimizations

### Template Evolution
- Framework-specific templates
- Industry-specific analysis sections
- Best practices integration
- Community feedback incorporation

---

*This workflow is designed to be comprehensive yet flexible, ensuring thorough analysis and high-quality builds while maintaining extensibility for future enhancements.*
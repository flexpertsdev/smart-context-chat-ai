# Inverse Analysis Workflow Documentation

## Overview
This document defines the generation workflows for three post-analysis documents that transform import analysis results into actionable build instructions, implementation guidance, and selective extraction workflows.

## Document Types & Purposes

### 1. Build Instructions (build_instructions.md)
**Purpose**: Self-executing LLM-optimized instruction set for complete project builds
**Target**: AI assistants that need comprehensive, standalone build guidance
**Scope**: Complete project construction from analysis insights

### 2. Implementation Analysis (implementation_analysis.md)  
**Purpose**: Contextual relevance analysis for workspace integration
**Target**: Decision-making about what to adopt from imported projects
**Scope**: Strategic integration planning with current workspace context

### 3. RepoMerge Documentation (repo_merge.md)
**Purpose**: Focused extraction workflow for specific valuable components
**Target**: Selective component adoption and adaptation
**Scope**: Tactical extraction and adaptation of specific features/patterns

---

## Workflow 1: Build Instructions Generation

### Input Requirements
```yaml
required_inputs:
  - import_analysis.md (complete)
  - workspace_ai_guides/ (design system, conventions, schemas)
  - current_project_status.md
  - feature_requirements.md
  - workspace_context.json

optional_inputs:
  - user_preferences.json
  - deployment_requirements.md
  - integration_constraints.md
```

### Generation Process

#### Step 1: Workspace Context Assembly
```javascript
// Load all workspace-level guidance
const workspaceContext = {
  aiGuides: loadAiGuides('/DOCS/ai_guides/'),
  designSystem: loadDesignSystem('/DOCS/design_system.md'),
  namingConventions: loadConventions('/DOCS/conventions.md'),
  projectTemplates: loadTemplates('/DOCS/templates/'),
  typeDefinitions: loadTypes('/DOCS/types/'),
  servicePatterns: loadServices('/DOCS/services/'),
  storePatterns: loadStores('/DOCS/stores/')
}
```

#### Step 2: Analysis Integration
```javascript
// Merge import analysis with workspace standards
const buildFoundation = {
  coreFeatures: mapFeaturesToWorkspace(importAnalysis.features, workspaceContext),
  designPatterns: adaptDesignPatterns(importAnalysis.designSystem, workspaceContext.designSystem),
  dataPatterns: adaptDataPatterns(importAnalysis.stateData, workspaceContext.storePatterns),
  componentArchitecture: adaptComponents(importAnalysis.componentMapping, workspaceContext.projectTemplates)
}
```

#### Step 3: Self-Executing Instructions Generation
```javascript
// Generate comprehensive build instructions
const buildInstructions = {
  // Project Setup
  projectSetup: {
    title: "Project Initialization",
    dependencies: generateDependencyList(buildFoundation),
    projectStructure: generateProjectStructure(workspaceContext.projectTemplates),
    configurationFiles: generateConfigFiles(workspaceContext),
    environmentSetup: generateEnvironmentSetup()
  },

  // Core Implementation
  coreImplementation: {
    title: "Core Feature Implementation",
    fileTree: generateTargetFileTree(buildFoundation),
    componentImplementation: generateComponentInstructions(buildFoundation.componentArchitecture),
    stateImplementation: generateStateInstructions(buildFoundation.dataPatterns),
    routingImplementation: generateRoutingInstructions(buildFoundation.coreFeatures)
  },

  // Feature Development
  featureImplementation: {
    title: "Feature-by-Feature Implementation",
    features: buildFoundation.coreFeatures.map(feature => ({
      name: feature.name,
      description: feature.description,
      dependencies: feature.dependencies,
      files: feature.requiredFiles,
      implementation: generateFeatureSteps(feature),
      testing: generateTestingSteps(feature),
      validation: generateValidationSteps(feature)
    }))
  },

  // Quality & Validation
  qualityAssurance: {
    title: "Quality Assurance & Validation",
    linting: generateLintingSetup(workspaceContext),
    testing: generateTestingStrategy(buildFoundation),
    documentation: generateDocumentationRequirements(),
    deployment: generateDeploymentInstructions()
  },

  // Confirmation Checks
  confirmationChecks: {
    title: "Build Validation Checklist",
    functionalChecks: generateFunctionalChecks(buildFoundation.coreFeatures),
    qualityChecks: generateQualityChecks(),
    performanceChecks: generatePerformanceChecks(),
    accessibilityChecks: generateAccessibilityChecks(),
    deploymentChecks: generateDeploymentChecks()
  }
}
```

#### Step 4: Self-Execution Optimization
```javascript
// Optimize for LLM execution
const optimizedInstructions = {
  executionOrder: generateExecutionSequence(buildInstructions),
  contextualHelpers: {
    troubleshooting: generateTroubleshootingGuide(),
    alternativeApproaches: generateAlternatives(),
    errorRecovery: generateErrorRecovery(),
    progressTracking: generateProgressTrackers()
  },
  completionCriteria: {
    milestones: generateMilestones(buildInstructions),
    successMetrics: generateSuccessMetrics(),
    finalValidation: generateFinalValidation()
  }
}

// Combine into final document
const finalBuildInstructions = mergeInstructions(buildInstructions, optimizedInstructions)
writeDocument('/SPACES/[current_space]/OUTPUT/build_instructions.md', finalBuildInstructions)
```

---

## Workflow 2: Implementation Analysis Generation

### Input Requirements
```yaml
required_inputs:
  - import_analysis.md (complete)
  - current_workspace_status.md
  - pending_tasks.md
  - feature_requirements.md
  - project_roadmap.md

contextual_inputs:
  - existing_codebase_analysis.md
  - current_architecture.md
  - known_issues.md
  - improvement_opportunities.md
```

### Generation Process

#### Step 1: Context Assessment
```javascript
// Analyze current workspace state
const workspaceAssessment = {
  currentFeatures: analyzeExistingFeatures('/current_project/'),
  pendingTasks: loadPendingTasks(),
  technicalDebt: assessTechnicalDebt(),
  architecturalGaps: identifyArchitecturalGaps(),
  qualityIssues: identifyQualityIssues(),
  performanceBottlenecks: identifyBottlenecks()
}
```

#### Step 2: Relevance Mapping
```javascript
// Map imported features to workspace needs
const relevanceAnalysis = {
  directlyApplicable: identifyDirectMatches(importAnalysis, workspaceAssessment),
  adaptationRequired: identifyAdaptationCandidates(importAnalysis, workspaceAssessment),
  inspirationalOnly: identifyInspirationSources(importAnalysis, workspaceAssessment),
  notRelevant: identifyIrrelevantComponents(importAnalysis, workspaceAssessment)
}
```

#### Step 3: Implementation Strategy Analysis
```javascript
// Generate implementation strategies
const implementationAnalysis = {
  // High Priority Implementations
  highPriority: {
    title: "Immediate Implementation Candidates",
    items: relevanceAnalysis.directlyApplicable.map(item => ({
      component: item.name,
      reason: item.relevanceReason,
      currentGap: item.addressedGap,
      implementationEffort: estimateEffort(item),
      dependencies: identifyDependencies(item),
      risks: identifyRisks(item),
      benefits: identifyBenefits(item),
      integrationStrategy: generateIntegrationStrategy(item)
    }))
  },

  // Medium Priority Adaptations
  mediumPriority: {
    title: "Adaptation Required Implementations",
    items: relevanceAnalysis.adaptationRequired.map(item => ({
      component: item.name,
      adaptationRequired: item.requiredAdaptations,
      currentImplementation: item.currentAlternative,
      improvementPotential: item.improvementPotential,
      adaptationEffort: estimateAdaptationEffort(item),
      adaptationStrategy: generateAdaptationStrategy(item),
      riskAssessment: assessAdaptationRisks(item)
    }))
  },

  // Learning Opportunities
  learningOpportunities: {
    title: "Inspirational Patterns & Approaches",
    items: relevanceAnalysis.inspirationalOnly.map(item => ({
      pattern: item.name,
      principle: item.underlyingPrinciple,
      currentApproach: item.currentWorkspaceApproach,
      potentialImprovement: item.improvementOpportunity,
      learningValue: item.learningValue,
      applicationStrategy: item.applicationStrategy
    }))
  },

  // Improvement Roadmap
  improvementRoadmap: {
    title: "Strategic Improvement Roadmap",
    phases: generateImprovementPhases(relevanceAnalysis),
    dependencies: mapImplementationDependencies(relevanceAnalysis),
    timeline: generateImplementationTimeline(relevanceAnalysis),
    resourceRequirements: estimateResourceRequirements(relevanceAnalysis)
  }
}
```

#### Step 4: Decision Framework
```javascript
// Generate decision-making framework
const decisionFramework = {
  implementationCriteria: {
    effort: "Implementation effort vs. current task priority",
    impact: "Potential impact on workspace goals",
    risk: "Risk assessment and mitigation strategies",
    maintenance: "Long-term maintenance considerations"
  },
  
  prioritizationMatrix: generatePrioritizationMatrix(implementationAnalysis),
  
  recommendations: {
    immediate: generateImmediateRecommendations(implementationAnalysis.highPriority),
    shortTerm: generateShortTermRecommendations(implementationAnalysis.mediumPriority),
    longTerm: generateLongTermRecommendations(implementationAnalysis.learningOpportunities)
  }
}
```

---

## Workflow 3: RepoMerge Documentation Generation

### Input Requirements
```yaml
required_inputs:
  - import_analysis.md (complete)
  - extraction_targets.md (user-specified components of interest)
  - current_workspace_architecture.md

optional_inputs:
  - component_wishlist.md
  - feature_gaps.md
  - specific_requirements.md
```

### Generation Process

#### Step 1: Target Component Identification
```javascript
// Identify components for extraction
const extractionTargets = {
  userSpecified: loadExtractionTargets(),
  autoDetected: identifyValuableComponents(importAnalysis),
  gapFillers: identifyGapFillingComponents(importAnalysis, workspaceArchitecture)
}
```

#### Step 2: Component Essence Analysis
```javascript
// Analyze the essence of each target component
const componentEssenceAnalysis = extractionTargets.map(component => ({
  name: component.name,
  coreFunction: extractCoreFunction(component),
  userExperience: extractUserExperience(component),
  visualDesign: extractVisualDesign(component),
  interactionPatterns: extractInteractionPatterns(component),
  dataFlow: extractDataFlow(component),
  businessLogic: extractBusinessLogic(component),
  dependencies: extractMinimalDependencies(component),
  
  // Essence distillation
  essence: {
    whatMakesItWork: identifySuccessFactors(component),
    criticalFeatures: identifyCriticalFeatures(component),
    userValue: identifyUserValue(component),
    technicalValue: identifyTechnicalValue(component)
  },
  
  // Adaptation requirements
  adaptation: {
    contextualChanges: identifyContextualChanges(component, workspaceArchitecture),
    technicalAdaptations: identifyTechnicalAdaptations(component, workspaceArchitecture),
    designAdaptations: identifyDesignAdaptations(component, workspaceArchitecture),
    integrationRequirements: identifyIntegrationRequirements(component, workspaceArchitecture)
  }
}))
```

#### Step 3: Extraction Strategy Generation
```javascript
// Generate extraction and adaptation strategies
const extractionStrategies = componentEssenceAnalysis.map(component => ({
  component: component.name,
  
  // Extraction strategy
  extraction: {
    isolationStrategy: generateIsolationStrategy(component),
    dependencyHandling: generateDependencyStrategy(component),
    codeExtraction: generateCodeExtractionPlan(component),
    assetExtraction: generateAssetExtractionPlan(component)
  },
  
  // Adaptation strategy
  adaptation: {
    corePreservation: generateCorePreservationStrategy(component.essence),
    contextualAdaptation: generateContextualAdaptationStrategy(component.adaptation),
    integrationStrategy: generateIntegrationStrategy(component, workspaceArchitecture),
    testingStrategy: generateTestingStrategy(component)
  },
  
  // Implementation workflow
  implementationWorkflow: {
    phases: generateImplementationPhases(component),
    milestones: generateImplementationMilestones(component),
    validationSteps: generateValidationSteps(component),
    rollbackPlan: generateRollbackPlan(component)
  }
}))
```

#### Step 4: Focused Build Instructions
```javascript
// Generate focused, self-executing build instructions
const repoMergeInstructions = {
  overview: {
    title: "Selective Component Extraction & Integration",
    scope: extractionTargets.map(t => t.name),
    objectives: extractionTargets.map(t => t.objective),
    successCriteria: generateSuccessCriteria(extractionTargets)
  },
  
  extractionPhase: {
    title: "Component Extraction Phase",
    steps: generateExtractionSteps(extractionStrategies),
    tools: generateExtractionTools(),
    validation: generateExtractionValidation()
  },
  
  adaptationPhase: {
    title: "Component Adaptation Phase",
    steps: generateAdaptationSteps(extractionStrategies),
    guidelines: generateAdaptationGuidelines(),
    validation: generateAdaptationValidation()
  },
  
  integrationPhase: {
    title: "Integration & Testing Phase",
    steps: generateIntegrationSteps(extractionStrategies),
    testing: generateIntegrationTesting(),
    validation: generateIntegrationValidation()
  },
  
  completionValidation: {
    title: "Completion Validation",
    functionalTests: generateFunctionalTests(extractionTargets),
    qualityChecks: generateQualityChecks(extractionTargets),
    performanceValidation: generatePerformanceValidation(extractionTargets),
    userExperienceValidation: generateUXValidation(extractionTargets)
  }
}
```

---

## Document Templates

### Build Instructions Template Structure
```markdown
# Build Instructions - [Project Name]

## Executive Summary
- Project overview
- Key features to implement
- Technology stack
- Success criteria

## Pre-requisites
- Required tools and versions
- Environment setup
- Dependency requirements

## Project Structure
- Target file tree
- Folder organization
- Naming conventions

## Implementation Phases

### Phase 1: Foundation Setup
- Project initialization
- Core configuration
- Basic structure

### Phase 2: Core Features
- Feature-by-feature implementation
- Component development
- State management

### Phase 3: Integration & Testing
- Component integration
- Testing implementation
- Quality assurance

### Phase 4: Deployment & Validation
- Deployment preparation
- Final validation
- Performance optimization

## Validation Checklist
- [ ] All features implemented
- [ ] Tests passing
- [ ] Performance metrics met
- [ ] Documentation complete
```

### Implementation Analysis Template Structure
```markdown
# Implementation Analysis - [Import Project Name]

## Context Assessment
- Current workspace status
- Pending tasks and priorities
- Known gaps and issues

## Relevance Analysis

### High Priority Components
- Directly applicable features
- Implementation effort vs. benefit
- Integration strategy

### Adaptation Candidates
- Components requiring modification
- Adaptation effort and approach
- Risk assessment

### Learning Opportunities
- Inspirational patterns
- Principle extraction
- Application strategies

## Implementation Roadmap
- Phase 1: Immediate implementations
- Phase 2: Adaptations
- Phase 3: Inspirational applications

## Decision Framework
- Implementation criteria
- Prioritization matrix
- Resource requirements
```

### RepoMerge Template Structure
```markdown
# RepoMerge Documentation - [Target Components]

## Extraction Targets
- Component identification
- Extraction rationale
- Success criteria

## Component Analysis

### [Component Name]
- Core functionality
- User experience essence
- Technical implementation
- Dependencies

## Extraction Strategy
- Isolation approach
- Dependency handling
- Code extraction plan

## Adaptation Strategy
- Core preservation
- Contextual adaptation
- Integration approach

## Implementation Workflow
- Extraction phase
- Adaptation phase
- Integration phase
- Validation phase

## Success Validation
- Functional verification
- Quality assurance
- Performance validation
```

---

## Generation Triggers

### Build Instructions Generation
```bash
# Auto-trigger when analysis complete and workspace context available
trigger: import_analysis.md COMPLETE + workspace_context.json EXISTS
command: claude-code generate build-instructions --space [space_number]
```

### Implementation Analysis Generation
```bash
# Trigger when analysis complete and workspace status defined
trigger: import_analysis.md COMPLETE + workspace_status.md EXISTS
command: claude-code generate implementation-analysis --space [space_number]
```

### RepoMerge Generation
```bash
# Trigger when specific extraction targets defined
trigger: extraction_targets.md EXISTS + import_analysis.md COMPLETE
command: claude-code generate repo-merge --space [space_number] --targets [target_file]
```

---

## Quality Assurance

### Document Validation
- Completeness checks
- Self-execution validation
- Context accuracy verification
- Implementation feasibility assessment

### Continuous Improvement
- Feedback integration
- Template refinement
- Process optimization
- Success rate tracking

---

*These workflows transform comprehensive analysis into actionable, context-aware build guidance tailored to specific workspace needs and objectives.*
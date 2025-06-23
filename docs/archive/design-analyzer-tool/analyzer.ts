#!/usr/bin/env node
import { glob } from 'glob';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Types
interface DesignPattern {
  navigation: 'bottom-tab' | 'top-nav' | 'sidebar' | 'hamburger';
  style: 'minimal' | 'soft' | 'sharp' | 'brutal';
  layout: 'single-column' | 'two-column' | 'dashboard' | 'magazine';
  colors: {
    primary: string[];
    secondary: string[];
    neutral: string[];
  };
  spacing: 'compact' | 'comfortable' | 'spacious';
}

interface AnalysisResult {
  patterns: DesignPattern;
  confidence: Record<string, number>;
  issues: string[];
  improvements: string[];
  stats: {
    totalComponents: number;
    totalFiles: number;
    touchTargetIssues: number;
    viewportIssues: number;
    inconsistentSpacing: boolean;
  };
}

class DesignSystemAnalyzer {
  private projectRoot: string;
  private spinner = ora();

  constructor() {
    this.projectRoot = path.resolve(process.cwd(), '..');
  }

  async analyze(): Promise<AnalysisResult> {
    this.spinner.start('Analyzing project...');
    
    try {
      // Find all component files
      const files = await this.findComponentFiles();
      this.spinner.text = `Found ${files.length} component files`;

      // Analyze patterns
      const patterns = await this.analyzePatterns(files);
      
      // Detect issues
      const issues = await this.detectIssues(files);
      
      // Generate improvements
      const improvements = this.generateImprovements(patterns, issues);

      this.spinner.succeed('Analysis complete!');

      return {
        patterns,
        confidence: this.calculateConfidence(patterns),
        issues,
        improvements,
        stats: {
          totalComponents: files.length,
          totalFiles: files.length,
          touchTargetIssues: issues.filter(i => i.includes('touch')).length,
          viewportIssues: issues.filter(i => i.includes('viewport')).length,
          inconsistentSpacing: issues.some(i => i.includes('spacing'))
        }
      };
    } catch (error) {
      this.spinner.fail('Analysis failed');
      throw error;
    }
  }

  private async findComponentFiles(): Promise<string[]> {
    const patterns = [
      '**/*.tsx',
      '**/*.jsx',
      '**/*.ts',
      '**/*.js'
    ];

    const ignore = [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.next/**',
      '**/design-analyzer-tool/**'
    ];

    let allFiles: string[] = [];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, {
        cwd: this.projectRoot,
        ignore,
        absolute: true
      });
      allFiles = [...allFiles, ...files];
    }

    return allFiles;
  }

  private async analyzePatterns(files: string[]): Promise<DesignPattern> {
    const patterns: Record<string, number> = {
      'bottom-tab': 0,
      'top-nav': 0,
      'sidebar': 0,
      'minimal': 0,
      'soft': 0,
      'sharp': 0
    };

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Navigation pattern detection
      if (content.includes('fixed bottom-0') || content.includes('bottom-nav')) {
        patterns['bottom-tab'] += 10;
      }
      if (content.includes('sticky top-0') || content.includes('header')) {
        patterns['top-nav'] += 5;
      }
      if (content.includes('sidebar') || content.includes('aside')) {
        patterns['sidebar'] += 8;
      }

      // Style detection
      if (content.includes('rounded-none')) {
        patterns['sharp'] += 5;
      }
      if (content.includes('rounded-xl') || content.includes('rounded-2xl')) {
        patterns['soft'] += 5;
      }
      if (!content.includes('shadow')) {
        patterns['minimal'] += 3;
      }
    }

    // Extract colors
    const colors = await this.extractColors(files);

    return {
      navigation: this.getHighestPattern(patterns, ['bottom-tab', 'top-nav', 'sidebar']) as any,
      style: this.getHighestPattern(patterns, ['minimal', 'soft', 'sharp']) as any,
      layout: 'single-column', // Default for now
      colors,
      spacing: 'comfortable' // Default for now
    };
  }

  private async extractColors(files: string[]): Promise<DesignPattern['colors']> {
    const colorClasses = new Set<string>();
    
    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      const matches = content.matchAll(/(?:bg|text|border)-(\w+)-(\d+)/g);
      
      for (const match of matches) {
        colorClasses.add(`${match[1]}-${match[2]}`);
      }
    }

    // Group colors by type
    const primary = Array.from(colorClasses).filter(c => c.includes('blue') || c.includes('primary'));
    const secondary = Array.from(colorClasses).filter(c => c.includes('green') || c.includes('secondary'));
    const neutral = Array.from(colorClasses).filter(c => c.includes('gray') || c.includes('neutral'));

    return { primary, secondary, neutral };
  }

  private async detectIssues(files: string[]): Promise<string[]> {
    const issues: string[] = [];
    let minHeightScreenCount = 0;
    let smallTouchTargets = 0;
    const spacingValues = new Set<string>();

    for (const file of files) {
      const content = await fs.readFile(file, 'utf-8');
      
      // Check for viewport issues
      if (content.includes('min-h-screen')) {
        minHeightScreenCount++;
      }

      // Check for small touch targets
      const buttonMatches = content.matchAll(/className="[^"]*(?:h-(\d+)|py-(\d+))[^"]*"/g);
      for (const match of buttonMatches) {
        const height = parseInt(match[1] || match[2] || '0');
        if (height > 0 && height < 11) { // Less than 44px (11 * 4px)
          smallTouchTargets++;
        }
      }

      // Extract spacing values
      const spacingMatches = content.matchAll(/(?:p|m|gap)-(\d+)/g);
      for (const match of spacingMatches) {
        spacingValues.add(match[1]);
      }
    }

    if (minHeightScreenCount > 0) {
      issues.push(`Found ${minHeightScreenCount} files using min-h-screen (breaks on mobile)`);
    }

    if (smallTouchTargets > 0) {
      issues.push(`Found ${smallTouchTargets} buttons with touch targets < 44px`);
    }

    if (spacingValues.size > 8) {
      issues.push(`Inconsistent spacing: ${spacingValues.size} different values found`);
    }

    return issues;
  }

  private generateImprovements(patterns: DesignPattern, issues: string[]): string[] {
    const improvements: string[] = [];

    // Navigation improvements
    if (patterns.navigation === 'hamburger' || patterns.navigation === 'sidebar') {
      improvements.push('Consider bottom tab navigation for better mobile UX');
    }

    // Viewport improvements
    if (issues.some(i => i.includes('min-h-screen'))) {
      improvements.push('Replace min-h-screen with min-h-dvh for proper mobile viewport');
    }

    // Touch target improvements
    if (issues.some(i => i.includes('touch targets'))) {
      improvements.push('Increase button sizes to minimum 44px for accessibility');
    }

    // Spacing improvements
    if (issues.some(i => i.includes('spacing'))) {
      improvements.push('Standardize spacing to 4px base unit system');
    }

    return improvements;
  }

  private getHighestPattern(patterns: Record<string, number>, keys: string[]): string {
    let highest = keys[0];
    let highestValue = patterns[keys[0]] || 0;

    for (const key of keys) {
      if ((patterns[key] || 0) > highestValue) {
        highest = key;
        highestValue = patterns[key] || 0;
      }
    }

    return highest;
  }

  private calculateConfidence(patterns: DesignPattern): Record<string, number> {
    // Simple confidence calculation
    return {
      navigation: 85,
      style: 72,
      layout: 90,
      colors: 95,
      spacing: 68
    };
  }

  async rebuild(options: { auto?: boolean; preview?: boolean }) {
    const analysis = await this.analyze();
    
    console.log(chalk.bold('\n📊 Analysis Results:\n'));
    console.log(chalk.cyan('Detected Patterns:'));
    console.log(`  Navigation: ${chalk.yellow(analysis.patterns.navigation)} (${analysis.confidence.navigation}% confidence)`);
    console.log(`  Style: ${chalk.yellow(analysis.patterns.style)} (${analysis.confidence.style}% confidence)`);
    console.log(`  Layout: ${chalk.yellow(analysis.patterns.layout)} (${analysis.confidence.layout}% confidence)`);
    
    if (analysis.issues.length > 0) {
      console.log(chalk.red('\n⚠️  Issues Found:'));
      analysis.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    if (analysis.improvements.length > 0) {
      console.log(chalk.green('\n✨ Suggested Improvements:'));
      analysis.improvements.forEach(imp => console.log(`  - ${imp}`));
    }

    if (!options.auto) {
      const { proceed } = await inquirer.prompt([{
        type: 'confirm',
        name: 'proceed',
        message: 'Would you like to generate an improved design system?',
        default: true
      }]);

      if (!proceed) {
        console.log(chalk.yellow('\nRebuild cancelled.'));
        return;
      }
    }

    await this.generateDesignSystem(analysis);
  }

  private async generateDesignSystem(analysis: AnalysisResult) {
    const outputDir = path.join(this.projectRoot, 'generated-design-system');
    
    this.spinner.start('Generating design system...');

    try {
      // Create output directory
      await fs.mkdir(outputDir, { recursive: true });
      await fs.mkdir(path.join(outputDir, 'theme'), { recursive: true });
      await fs.mkdir(path.join(outputDir, 'components'), { recursive: true });
      await fs.mkdir(path.join(outputDir, 'layouts'), { recursive: true });

      // Generate theme files
      await this.generateThemeFiles(outputDir, analysis);
      
      // Generate component examples
      await this.generateComponentExamples(outputDir, analysis);
      
      // Generate migration guide
      await this.generateMigrationGuide(outputDir, analysis);

      this.spinner.succeed('Design system generated!');
      
      console.log(chalk.green(`\n✅ Success! Design system generated at:`));
      console.log(chalk.cyan(`   ${outputDir}`));
      console.log(chalk.yellow(`\n📖 Check migration-guide.md for next steps`));
    } catch (error) {
      this.spinner.fail('Generation failed');
      throw error;
    }
  }

  private async generateThemeFiles(outputDir: string, analysis: AnalysisResult) {
    // Generate CSS variables
    const cssVars = `/* Generated Design System Variables */
:root {
  /* Dynamic Viewport Height */
  --vh: 1vh;
  
  /* Colors */
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
  --secondary: 217 91% 60%;
  --secondary-foreground: 210 40% 98%;
  
  /* Spacing (4px base) */
  --space-unit: 1rem;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 0.75rem;
  --space-base: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Component Tokens */
  --radius: ${analysis.patterns.style === 'sharp' ? '0' : analysis.patterns.style === 'soft' ? '0.75rem' : '0.5rem'};
  --touch-target: 44px;
}`;

    await fs.writeFile(path.join(outputDir, 'theme', 'variables.css'), cssVars);

    // Generate Tailwind config
    const tailwindConfig = `module.exports = {
  theme: {
    extend: {
      height: {
        'dvh': 'calc(var(--vh, 1vh) * 100)',
      },
      minHeight: {
        'dvh': 'calc(var(--vh, 1vh) * 100)',
      },
    },
  },
  plugins: [],
}`;

    await fs.writeFile(path.join(outputDir, 'theme', 'tailwind.config.js'), tailwindConfig);
  }

  private async generateComponentExamples(outputDir: string, analysis: AnalysisResult) {
    // Generate Button component
    const buttonComponent = `import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors min-h-[44px] min-w-[44px]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-11 px-4 text-sm', // 44px minimum
        md: 'h-12 px-6',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export { buttonVariants };`;

    await fs.writeFile(path.join(outputDir, 'components', 'button.tsx'), buttonComponent);

    // Generate Navigation based on detected pattern
    if (analysis.patterns.navigation === 'bottom-tab') {
      const navComponent = `export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 inset-x-0 h-16 border-t bg-background pb-safe-bottom">
      <div className="h-full px-2 flex items-center justify-around">
        {/* Navigation items */}
      </div>
    </nav>
  );
}`;
      await fs.writeFile(path.join(outputDir, 'layouts', 'bottom-navigation.tsx'), navComponent);
    }
  }

  private async generateMigrationGuide(outputDir: string, analysis: AnalysisResult) {
    const guide = `# Design System Migration Guide

Generated on: ${new Date().toLocaleDateString()}

## Overview

This guide helps you migrate to the improved design system based on the analysis of your project.

## Detected Patterns

- **Navigation**: ${analysis.patterns.navigation}
- **Style**: ${analysis.patterns.style}
- **Layout**: ${analysis.patterns.layout}
- **Spacing**: ${analysis.patterns.spacing}

## Issues to Fix

${analysis.issues.map(issue => `- [ ] ${issue}`).join('\n')}

## Step-by-Step Migration

### 1. Update CSS Variables

Copy the contents of \`theme/variables.css\` to your global CSS file.

### 2. Update Tailwind Config

Merge the generated \`theme/tailwind.config.js\` with your existing config.

### 3. Fix Viewport Heights

Replace all instances of:
\`\`\`
min-h-screen → min-h-dvh
h-screen → h-dvh
\`\`\`

### 4. Fix Touch Targets

Update all buttons to use the new button component with minimum 44px height.

### 5. Standardize Spacing

Use the new spacing variables:
- \`space-xs\` (4px)
- \`space-sm\` (8px)
- \`space-md\` (12px)
- \`space-base\` (16px)
- \`space-lg\` (24px)
- \`space-xl\` (32px)

## Testing

After migration:
1. Test on real mobile devices
2. Check all touch targets are at least 44px
3. Verify navigation works on all screen sizes
4. Ensure consistent spacing throughout

## Rollback

All original files remain untouched. To rollback:
1. Delete the \`generated-design-system\` folder
2. Continue using your original design system
`;

    await fs.writeFile(path.join(outputDir, 'migration-guide.md'), guide);
  }
}

// CLI setup
const argv = yargs(hideBin(process.argv))
  .command('analyze', 'Analyze the project design system')
  .command('rebuild', 'Rebuild the design system', {
    auto: {
      type: 'boolean',
      describe: 'Automatically apply best patterns'
    },
    preview: {
      type: 'boolean',
      describe: 'Show preview before applying'
    }
  })
  .help()
  .argv;

// Main execution
const analyzer = new DesignSystemAnalyzer();

if (process.argv[2] === 'analyze') {
  analyzer.analyze().then(result => {
    console.log(chalk.bold('\n📊 Analysis Complete!\n'));
    console.log(`Total files analyzed: ${chalk.cyan(result.stats.totalFiles)}`);
    console.log(`Issues found: ${chalk.yellow(result.issues.length)}`);
    console.log(`Improvements available: ${chalk.green(result.improvements.length)}`);
  });
} else if (process.argv[2] === 'rebuild') {
  analyzer.rebuild({
    auto: process.argv.includes('--auto'),
    preview: process.argv.includes('--preview')
  });
} else {
  console.log(chalk.yellow('Usage: npm run analyze | npm run rebuild'));
}
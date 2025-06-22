
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		// Enhanced responsive breakpoints
		screens: {
			'xs': '475px',   // Extra small devices
			'sm': '640px',   // Small devices (landscape phones)
			'md': '768px',   // Medium devices (tablets)
			'lg': '1024px',  // Large devices (laptops)
			'xl': '1280px',  // Extra large devices (desktops)
			'2xl': '1536px', // 2X Extra large devices (large desktops)
			// Custom breakpoints for specific use cases
			'mobile-lg': '414px',  // Large mobile devices
			'tablet-sm': '768px',  // Small tablets
			'desktop-sm': '1024px', // Small desktops
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				'sm': '1.5rem',
				'lg': '2rem',
				'xl': '2.5rem',
				'2xl': '3rem',
			},
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px'
			}
		},
		extend: {
			// Responsive spacing scale
			spacing: {
				// Touch-friendly sizes
				'touch': '44px',     // Minimum touch target
				'touch-sm': '40px',  // Small touch target
				'touch-lg': '48px',  // Large touch target
				// Panel sizes
				'sidebar': '280px',
				'sidebar-sm': '240px',
				'sidebar-lg': '320px',
				'context-panel': '320px',
				'context-panel-sm': '280px',
				'context-panel-lg': '400px',
			},
			// Responsive font sizes
			fontSize: {
				// Mobile-first typography
				'xs': ['0.75rem', { lineHeight: '1rem' }],
				'sm': ['0.875rem', { lineHeight: '1.25rem' }],
				'base': ['1rem', { lineHeight: '1.5rem' }],
				'lg': ['1.125rem', { lineHeight: '1.75rem' }],
				'xl': ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				// Responsive headings
				'heading-sm': ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
				'heading-md': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
				'heading-lg': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
				'heading-xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
			},
			// Animation durations for responsive transitions
			transitionDuration: {
				'150': '150ms',
				'200': '200ms',
				'250': '250ms',
				'300': '300ms',
				'400': '400ms',
				'500': '500ms',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				whatsapp: {
					primary: '#25d366',
					dark: '#075e54',
					light: '#dcf8c6',
					background: '#f0f0f0',
				},
				confidence: {
					high: '#28a745',
					medium: '#ffc107',
					low: '#dc3545',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						transform: 'scale(0.95)',
						opacity: '0'
					},
					'100%': {
						transform: 'scale(1)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

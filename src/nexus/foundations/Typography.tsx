import React from 'react'

interface TextProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  align?: 'left' | 'center' | 'right'
  truncate?: boolean
}

const Text: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'p',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  truncate = false
}) => {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  }

  const weightStyles = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const colorStyles = {
    default: 'text-gray-900',
    primary: 'text-green-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <Component
      className={`
        ${sizeStyles[size]}
        ${weightStyles[weight]}
        ${colorStyles[color]}
        ${alignStyles[align]}
        ${truncate ? 'truncate' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  )
}

// Preset components for common use cases
export const Heading1: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = (props) => (
  <Text as="h1" size="4xl" weight="bold" {...props} />
)

export const Heading2: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = (props) => (
  <Text as="h2" size="3xl" weight="semibold" {...props} />
)

export const Heading3: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = (props) => (
  <Text as="h3" size="2xl" weight="semibold" {...props} />
)

export const Heading4: React.FC<Omit<TextProps, 'as' | 'size' | 'weight'>> = (props) => (
  <Text as="h4" size="xl" weight="medium" {...props} />
)

export const Body: React.FC<Omit<TextProps, 'as'>> = (props) => (
  <Text as="p" {...props} />
)

export const Caption: React.FC<Omit<TextProps, 'as' | 'size' | 'color'>> = (props) => (
  <Text as="span" size="sm" color="secondary" {...props} />
)

export default Text
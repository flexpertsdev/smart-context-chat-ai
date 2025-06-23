import { cva } from 'class-variance-authority';

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

export { buttonVariants };
import {cva, type VariantProps} from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-accent-primary text-white hover:bg-accent-primary/90 focus-visible:ring-accent-primary',
        secondary:
          'bg-canvas-elevated text-text-primary hover:bg-canvas-elevated/80 focus-visible:ring-text-primary',
        ghost:
          'hover:bg-canvas-elevated hover:text-text-primary focus-visible:ring-text-primary',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

import * as React from 'react';
import {buttonVariants} from '~/lib/variants';
import {cn} from '~/utils/cn';
import type {ButtonVariantProps} from '~/lib/variants';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariantProps {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, ...props}, ref) => {
    return (
      <button
        className={cn(buttonVariants({variant, size, className}))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export {Button};
export type {ButtonProps};

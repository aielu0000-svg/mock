import * as React from 'react';
import { cn } from '../../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
};

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-[#e40112] text-white hover:bg-[#b3000e] focus-visible:ring-[#e40112]',
  secondary: 'bg-white text-[#e40112] border border-[#e40112] hover:bg-[#fff1f3] focus-visible:ring-[#e40112]'
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  default: 'h-10 px-4 py-2 text-sm',
  lg: 'h-11 px-8 text-base'
};

const baseClass = 'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(baseClass, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button };

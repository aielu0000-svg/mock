import * as React from 'react';
import { cn } from '../../../lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn('h-4 w-4 rounded border-slate-400 text-[#00a0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a0e9]', className)}
      {...props}
    />
  )
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };

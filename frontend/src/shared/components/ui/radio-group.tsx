import * as React from 'react';
import { cn } from '../../../lib/utils';

type RadioGroupProps = React.HTMLAttributes<HTMLDivElement>;

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return <div role="radiogroup" className={cn('flex items-center gap-5', className)} {...props} />;
}

type RadioGroupItemProps = React.InputHTMLAttributes<HTMLInputElement>;

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="radio"
    className={cn('h-4 w-4 border-slate-400 text-[#00a0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a0e9]', className)}
    {...props}
  />
));
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };

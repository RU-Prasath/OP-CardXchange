import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'grad';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-white/[0.06] text-white/70 border border-white/[0.1]': variant === 'default',
          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': variant === 'success',
          'bg-amber-500/10 text-amber-400 border border-amber-500/20': variant === 'warning',
          'bg-red-500/10 text-red-400 border border-red-500/20': variant === 'destructive',
          'border border-white/[0.15] text-white/60': variant === 'outline',
          'bg-gradient-to-br from-cyan-400/20 via-indigo-500/20 to-violet-500/20 text-violet-300 border border-violet-500/30': variant === 'grad',
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

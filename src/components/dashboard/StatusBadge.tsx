import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'SAFE' | 'DANGER';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isSafe = status === 'SAFE';
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        isSafe 
          ? 'bg-success/10 text-success border border-success/20' 
          : 'bg-destructive/10 text-destructive border border-destructive/20 animate-pulse',
        className
      )}
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          isSafe ? 'bg-success' : 'bg-destructive animate-ping'
        )}
      />
      {status}
    </span>
  );
}

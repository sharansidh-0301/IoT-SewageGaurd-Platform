import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
  message: string;
  details?: string;
  className?: string;
}

export function AlertBanner({ message, details, className }: AlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div className={cn(
      'gradient-danger text-destructive-foreground py-3 px-4 shadow-lg',
      className
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 animate-pulse" />
          <div>
            <p className="font-semibold">{message}</p>
            {details && <p className="text-sm opacity-90">{details}</p>}
          </div>
        </div>
        <button 
          onClick={() => setIsDismissed(true)}
          className="p-1 hover:bg-destructive-foreground/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

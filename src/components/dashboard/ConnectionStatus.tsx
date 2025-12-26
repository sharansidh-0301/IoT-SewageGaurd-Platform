import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
  lastPing?: Date;
}

export function ConnectionStatus({ isConnected, lastPing }: ConnectionStatusProps) {
  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
      isConnected 
        ? 'bg-success/10 text-success border border-success/20' 
        : 'bg-destructive/10 text-destructive border border-destructive/20'
    )}>
      {isConnected ? (
        <>
          <Wifi className="h-3.5 w-3.5" />
          <span>Connected</span>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
        </>
      ) : (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}

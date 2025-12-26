import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GasSensorProps } from '@/types/sensor';

interface GasSensorCardProps extends GasSensorProps {
  className?: string;
}

export function GasSensorCard({ label, value, status, unit = 'ppm', className }: GasSensorCardProps) {
  const isDanger = status === 'DANGER';
  
  // Calculate percentage for the gauge (assuming max 1000 ppm)
  const percentage = Math.min((value / 1000) * 100, 100);
  
  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300',
      isDanger && 'ring-2 ring-destructive/50 shadow-lg shadow-destructive/10',
      className
    )}>
      {isDanger && (
        <div className="absolute inset-0 bg-destructive/5 animate-pulse pointer-events-none" />
      )}
      
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Flame className={cn(
            'h-4 w-4',
            isDanger ? 'text-destructive' : 'text-primary'
          )} />
          {label}
        </CardTitle>
        <StatusBadge status={status} />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-3xl font-bold font-mono tracking-tight',
              isDanger ? 'text-destructive' : 'text-foreground'
            )}>
              {value.toFixed(0)}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          
          {/* Progress bar gauge */}
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isDanger ? 'gradient-danger' : 'bg-primary'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>Threshold: 400</span>
            <span>1000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

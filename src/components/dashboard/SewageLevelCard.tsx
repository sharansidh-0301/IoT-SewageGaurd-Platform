import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Waves, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SewageLevelProps } from '@/types/sensor';

interface Props extends SewageLevelProps {
  className?: string;
}

export function SewageLevelCard({ distance, maxDistance = 200, className }: Props) {
  // Calculate fill level (inverted - smaller distance = higher level)
  const fillPercentage = Math.max(0, Math.min(100, ((maxDistance - distance) / maxDistance) * 100));
  
  // Status based on fill level
  const status = fillPercentage > 80 ? 'critical' : fillPercentage > 60 ? 'warning' : 'normal';
  
  return (
    <Card className={cn(
      'relative overflow-hidden',
      status === 'critical' && 'ring-2 ring-destructive/50',
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Waves className={cn(
              'h-4 w-4',
              status === 'critical' ? 'text-destructive' : 
              status === 'warning' ? 'text-warning' : 'text-primary'
            )} />
            Sewage Level
          </span>
          {status === 'critical' && (
            <span className="flex items-center gap-1 text-destructive animate-pulse">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-semibold">HIGH</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-end gap-6">
          {/* Tank visualization */}
          <div className="relative w-24 h-32 border-2 border-border rounded-b-lg overflow-hidden bg-secondary/50">
            <div 
              className={cn(
                'absolute bottom-0 left-0 right-0 transition-all duration-700',
                status === 'critical' ? 'gradient-danger' : 
                status === 'warning' ? 'gradient-warning' : 'bg-primary'
              )}
              style={{ height: `${fillPercentage}%` }}
            >
              {/* Wave effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-t from-transparent to-primary-foreground/20" />
              </div>
            </div>
            
            {/* Level markers */}
            <div className="absolute inset-y-0 right-0 flex flex-col justify-between py-2 pr-1">
              {[100, 75, 50, 25, 0].map((level) => (
                <div key={level} className="flex items-center gap-1">
                  <div className="w-2 h-px bg-border" />
                  <span className="text-[8px] text-muted-foreground">{level}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Distance to Surface</div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono">{distance.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">cm</span>
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Fill Level</div>
              <div className="flex items-baseline gap-1">
                <span className={cn(
                  'text-2xl font-bold font-mono',
                  status === 'critical' ? 'text-destructive' : 
                  status === 'warning' ? 'text-warning' : 'text-foreground'
                )}>
                  {fillPercentage.toFixed(0)}
                </span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            
            <div className={cn(
              'text-xs font-medium px-2 py-1 rounded',
              status === 'critical' ? 'bg-destructive/10 text-destructive' : 
              status === 'warning' ? 'bg-warning/10 text-warning' : 
              'bg-success/10 text-success'
            )}>
              {status === 'critical' ? 'Critical - Immediate Action Required' : 
               status === 'warning' ? 'Warning - Monitor Closely' : 
               'Normal Operating Level'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

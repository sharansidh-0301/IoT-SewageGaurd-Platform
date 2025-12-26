import { RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DashboardHeaderProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  hasAlert: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ lastUpdated, isLoading, hasAlert, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              hasAlert ? 'bg-destructive/10' : 'bg-primary/10'
            )}>
              <Activity className={cn(
                'h-6 w-6',
                hasAlert ? 'text-destructive' : 'text-primary'
              )} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                IoT Sewage Gas Monitor
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time Sensor Monitoring Dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {hasAlert && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-lg animate-pulse">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">Alert Active</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-muted-foreground">Last Updated</div>
                <div className="text-sm font-mono">
                  {lastUpdated ? format(lastUpdated, 'HH:mm:ss') : '--:--:--'}
                </div>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

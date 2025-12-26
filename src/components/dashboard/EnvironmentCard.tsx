import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Thermometer, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnvironmentCardProps } from '@/types/sensor';

interface Props extends EnvironmentCardProps {
  className?: string;
}

export function EnvironmentCard({ temperature, humidity, className }: Props) {
  // Temperature status (comfortable range: 18-26°C)
  const tempStatus = temperature < 18 ? 'cold' : temperature > 35 ? 'hot' : 'normal';
  // Humidity status (comfortable range: 40-60%)
  const humidityStatus = humidity < 30 ? 'dry' : humidity > 70 ? 'humid' : 'normal';
  
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Environment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className={cn(
              'h-4 w-4',
              tempStatus === 'hot' ? 'text-destructive' : 
              tempStatus === 'cold' ? 'text-primary' : 'text-success'
            )} />
            <span className="text-xs">Temperature</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-2xl font-bold font-mono',
              tempStatus === 'hot' ? 'text-destructive' : 
              tempStatus === 'cold' ? 'text-primary' : 'text-foreground'
            )}>
              {temperature.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">°C</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                tempStatus === 'hot' ? 'bg-destructive' : 
                tempStatus === 'cold' ? 'bg-primary' : 'bg-success'
              )}
              style={{ width: `${Math.min((temperature / 50) * 100, 100)}%` }}
            />
          </div>
        </div>
        
        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplets className={cn(
              'h-4 w-4',
              humidityStatus === 'humid' ? 'text-primary' : 
              humidityStatus === 'dry' ? 'text-warning' : 'text-success'
            )} />
            <span className="text-xs">Humidity</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              'text-2xl font-bold font-mono',
              humidityStatus !== 'normal' ? 'text-warning' : 'text-foreground'
            )}>
              {humidity.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                humidityStatus === 'humid' ? 'bg-primary' : 
                humidityStatus === 'dry' ? 'bg-warning' : 'bg-success'
              )}
              style={{ width: `${humidity}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

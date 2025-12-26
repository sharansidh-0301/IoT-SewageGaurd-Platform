import { useSensorData } from '@/hooks/useSensorData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { GasSensorCard } from '@/components/dashboard/GasSensorCard';
import { EnvironmentCard } from '@/components/dashboard/EnvironmentCard';
import { SewageLevelCard } from '@/components/dashboard/SewageLevelCard';
import { SensorChart } from '@/components/dashboard/SensorChart';
import { ConnectionStatus } from '@/components/dashboard/ConnectionStatus';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Database } from 'lucide-react';
import { format } from 'date-fns';

const Index = () => {
  const { latestData, history, isLoading, error, lastUpdated, refreshData } = useSensorData();

  if (isLoading && !latestData) {
    return <DashboardSkeleton />;
  }

  const hasAlert = latestData?.alert_flag ?? false;
  const isConnected = !!latestData && lastUpdated && 
    (new Date().getTime() - lastUpdated.getTime()) < 30000;

  // Default data when no sensor data exists
  const data = latestData || {
    gas1: 0,
    gas2: 0,
    gas3: 0,
    gas4: 0,
    temperature: 0,
    humidity: 0,
    distance: 0,
    gas1_status: 'SAFE' as const,
    gas2_status: 'SAFE' as const,
    gas3_status: 'SAFE' as const,
    gas4_status: 'SAFE' as const,
    created_at: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Alert Banner */}
      {hasAlert && (
        <AlertBanner 
          message="⚠️ Hazardous Gas Levels Detected!" 
          details="One or more gas sensors have exceeded safe thresholds. Immediate ventilation recommended."
        />
      )}

      {/* Header */}
      <DashboardHeader 
        lastUpdated={lastUpdated}
        isLoading={isLoading}
        hasAlert={hasAlert}
        onRefresh={refreshData}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <ConnectionStatus isConnected={isConnected} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                <span>{history.length} readings recorded</span>
              </div>
            </div>
            {latestData && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last reading: {format(new Date(latestData.created_at), 'PPpp')}</span>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="py-4">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* No Data State */}
          {!latestData && !isLoading && (
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="py-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No Sensor Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Waiting for ESP32 to send sensor readings...
                </p>
                <p className="text-sm text-muted-foreground font-mono">
                  POST to: /functions/v1/sensor-data
                </p>
              </CardContent>
            </Card>
          )}

          {/* Gas Sensor Cards */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Gas Sensors (MQ Series)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <GasSensorCard 
                label="Gas Sensor 1" 
                value={data.gas1} 
                status={data.gas1_status} 
              />
              <GasSensorCard 
                label="Gas Sensor 2" 
                value={data.gas2} 
                status={data.gas2_status} 
              />
              <GasSensorCard 
                label="Gas Sensor 3" 
                value={data.gas3} 
                status={data.gas3_status} 
              />
              <GasSensorCard 
                label="Gas Sensor 4" 
                value={data.gas4} 
                status={data.gas4_status} 
              />
            </div>
          </section>

          {/* Environment & Sewage Level */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              Environmental Conditions
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <EnvironmentCard 
                temperature={data.temperature} 
                humidity={data.humidity} 
              />
              <SewageLevelCard 
                distance={data.distance} 
              />
            </div>
          </section>

          {/* Historical Charts */}
          {history.length > 1 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                Historical Trends
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <SensorChart 
                  data={history}
                  title="Gas Levels Over Time"
                  dataKeys={[
                    { key: 'gas1', color: 'hsl(199, 89%, 48%)', label: 'Gas 1' },
                    { key: 'gas2', color: 'hsl(142, 76%, 36%)', label: 'Gas 2' },
                    { key: 'gas3', color: 'hsl(38, 92%, 50%)', label: 'Gas 3' },
                    { key: 'gas4', color: 'hsl(0, 84%, 60%)', label: 'Gas 4' },
                  ]}
                />
                <SensorChart 
                  data={history}
                  title="Temperature & Humidity"
                  dataKeys={[
                    { key: 'temperature', color: 'hsl(0, 84%, 60%)', label: 'Temperature (°C)' },
                    { key: 'humidity', color: 'hsl(199, 89%, 48%)', label: 'Humidity (%)' },
                  ]}
                />
              </div>
            </section>
          )}

          {/* API Documentation Card */}
          <Card className="bg-sidebar text-sidebar-foreground">
            <CardHeader>
              <CardTitle className="text-sm">ESP32 API Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-sidebar-foreground/70 mb-1">POST Endpoint (Send Sensor Data):</p>
                <code className="block bg-sidebar-accent px-3 py-2 rounded text-xs font-mono">
                  POST https://iplxcuwwemybymlrbgnu.supabase.co/functions/v1/sensor-data
                </code>
              </div>
              <div>
                <p className="text-sidebar-foreground/70 mb-1">Request Body:</p>
                <pre className="bg-sidebar-accent px-3 py-2 rounded text-xs font-mono overflow-x-auto">
{`{
  "gas1": 250, "gas2": 180, "gas3": 320, "gas4": 150,
  "temperature": 28.5, "humidity": 65.2,
  "distance": 45.0
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            IoT Sewage Gas Monitoring System • Real-time Dashboard • Smart City Solution
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

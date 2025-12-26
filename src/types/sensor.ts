export interface SensorData {
  id: string;
  gas1: number;
  gas2: number;
  gas3: number;
  gas4: number;
  temperature: number;
  humidity: number;
  distance: number;
  gas1_status: 'SAFE' | 'DANGER';
  gas2_status: 'SAFE' | 'DANGER';
  gas3_status: 'SAFE' | 'DANGER';
  gas4_status: 'SAFE' | 'DANGER';
  alert_flag: boolean;
  created_at: string;
}

export interface GasSensorProps {
  label: string;
  value: number;
  status: 'SAFE' | 'DANGER';
  unit?: string;
}

export interface EnvironmentCardProps {
  temperature: number;
  humidity: number;
}

export interface SewageLevelProps {
  distance: number;
  maxDistance?: number;
}

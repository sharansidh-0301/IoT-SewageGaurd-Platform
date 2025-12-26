# 🚨 IoT Sewage Guard Platform

A real-time sensor monitoring dashboard for sewage gas detection and environmental monitoring. This platform provides live data visualization, alert systems, and historical trend analysis for sewage management systems. 

🌐 **Live Demo:** [https://iot-sewage-gaurd-platform.vercel.app/](https://iot-sewage-gaurd-platform.vercel.app/)

<img width="1827" height="962" alt="Screenshot 2025-12-26 192959" src="https://github.com/user-attachments/assets/c4e2942e-270b-4043-a7a6-e9d8aabeae32" />


## 📋 Overview

The IoT Sewage Guard Platform is a comprehensive monitoring solution that tracks multiple gas sensors (MQ series), environmental conditions (temperature and humidity), and sewage levels in real-time. The system provides instant alerts when dangerous gas levels are detected, ensuring worker safety and system reliability.

## ✨ Features

### 🎯 Real-Time Monitoring
- **Gas Sensors (MQ Series)**: Monitor up to 4 gas sensors simultaneously
- **Environmental Conditions**: Track temperature and humidity
- **Sewage Level Detection**: Monitor fill levels and distance to surface
- **Live Updates**: Auto-refresh functionality with connection status indicators
- **Alert System**: Real-time danger alerts when thresholds are exceeded

### 📊 Data Visualization
<img width="1751" height="927" alt="Screenshot 2025-12-26 193033" src="https://github.com/user-attachments/assets/5d7e1a17-67e3-452a-8b1e-dd43697fbeed" />

- **Historical Trends**: Interactive charts showing gas levels over time
- **Temperature & Humidity Graphs**: Visualize environmental conditions
- **Threshold Indicators**: Clear visual warnings when sensors detect dangerous levels
- **Progress Bars**: Intuitive display of gas sensor readings with color-coded safety levels

### 🔧 Technical Features
- **ESP32 API Integration**: RESTful API for IoT device connectivity
- **Database Storage**: Supabase backend for reliable data persistence
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Charts**: Recharts
- **Backend**: Supabase
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharansidh-0301/IoT-SewageGaurd-Platform.git
   cd IoT-SewageGaurd-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📡 ESP32 API Integration

The platform accepts sensor data from ESP32 devices via a POST endpoint: 

### Endpoint
```
POST https://1pixcuwwemybm1rbgnu.supabase.co/functions/v1/sensor-data
```

### Request Body Format
```json
{
  "gas1": 250,
  "gas2": 180,
  "gas3": 320,
  "gas4": 150,
  "temperature": 28.5,
  "humidity": 65.2,
  "distance": 45.0
}
```

### Sensor Parameters
- **gas1-4**: Gas sensor readings (0-1000 ppm)
- **temperature**: Temperature in Celsius
- **humidity**: Relative humidity percentage
- **distance**: Distance to sewage surface in centimeters

### Safety Thresholds
- **Safe**: 0-400 ppm
- **Danger**: > 400 ppm

## 📂 Project Structure

```
IoT-SewageGaurd-Platform/
├── src/
│   ├── components/      # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── pages/          # Route pages
│   └── styles/         # CSS styles
├── public/             # Static assets
├── supabase/           # Supabase functions
└── package.json        # Dependencies
```

## 🎨 Key Components

- **Gas Sensor Cards**: Real-time display of individual sensor readings
- **Environmental Monitor**: Temperature and humidity tracking
- **Sewage Level Indicator**: Visual representation of fill levels
- **Historical Trends Chart**: Multi-line graph for temporal analysis
- **Alert System**: Visual and status-based warnings

## 🔐 Security

- Environment variables for sensitive credentials
- Supabase Row Level Security (RLS) policies
- API endpoint authentication
- HTTPS encryption for all communications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is available for use under standard terms. Please contact the repository owner for specific licensing information.

## 👤 Author

**sharansidh-0301**
- GitHub: [@sharansidh-0301](https://github.com/sharansidh-0301)

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Powered by [Supabase](https://supabase.com/)
- Charts by [Recharts](https://recharts.org/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainer.

---

**⚠️ Safety Notice**: This system is designed to monitor hazardous gases in sewage systems. Always follow proper safety protocols and use this platform as part of a comprehensive safety system, not as a standalone solution.

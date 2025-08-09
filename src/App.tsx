import React, { useState } from 'react';
import { Warehouse, Users, Settings, HeadphonesIcon, Zap, Cpu, Brain, Eye } from 'lucide-react';
import WorkerView from './components/WorkerView';
import SupervisorDashboard from './components/SupervisorDashboard';
import AnimatedBackground from './components/AnimatedBackground';
import QuantumButton from './components/QuantumButton';

type ViewMode = 'worker' | 'supervisor';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('worker');

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <AnimatedBackground intensity="high" theme="quantum" />
      {/* Navigation Header */}
      <header className="relative z-20 bg-black/40 backdrop-blur-xl border-b-2 border-cyan-400/50 neural-interface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 animate-spin">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <Brain className="h-8 w-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping" />
              </div>
              <div>
                <h1 className="text-2xl font-bold holographic-text font-quantum">
                  QUANTUM WAREHOUSE NEXUS
                </h1>
                <p className="text-sm text-cyan-400 font-neural">Multi-Dimensional Voice-Neural Interface</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-6">
              <nav className="flex space-x-4">
                <QuantumButton
                  onClick={() => setCurrentView('worker')}
                  variant={currentView === 'worker' ? 'primary' : 'secondary'}
                  size="lg"
                  icon={<Eye size={20} />}
                  className="quantum-btn"
                >
                  NEURAL AGENT
                </QuantumButton>
                <QuantumButton
                  onClick={() => setCurrentView('supervisor')}
                  variant={currentView === 'supervisor' ? 'primary' : 'secondary'}
                  size="lg"
                  icon={<Brain size={20} />}
                  className="quantum-btn"
                >
                  COMMAND NEXUS
                </QuantumButton>
              </nav>

              {/* Settings */}
              <QuantumButton
                variant="secondary"
                icon={<Settings size={20} />}
                className="quantum-btn"
              >
                QUANTUM CONFIG
              </QuantumButton>
            </div>
          </div>
          
          {/* Holographic line effect */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 via-purple-500 to-transparent animate-shimmer" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {currentView === 'worker' ? <WorkerView /> : <SupervisorDashboard />}
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-black/40 backdrop-blur-xl border-t-2 border-cyan-400/50 mt-auto neural-interface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400 font-neural">
              <span className="holographic-text font-bold text-lg">
                © 2025 QUANTUM WAREHOUSE NEXUS
              </span>
              <span className="ml-4 text-cyan-400">• Multi-Dimensional Neural Interface • Quantum Voice Recognition • EN/JP Neural Protocols</span>
            </div>
            <div className="flex items-center space-x-8 text-sm font-neural">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </div>
                <span className="text-green-400 font-bold">NEURAL LINK ACTIVE</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cpu className="text-blue-400 animate-pulse" size={16} />
                <span className="text-blue-400 font-bold">QUANTUM MATRIX SYNCED</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="text-purple-400 animate-bounce" size={16} />
                <span className="text-purple-400 font-bold">DIMENSIONAL PHASE: STABLE</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default App
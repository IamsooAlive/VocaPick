import React, { useState, useEffect } from 'react';

interface VoiceWaveformProps {
  isListening: boolean;
  amplitude?: number;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening, amplitude = 0.5 }) => {
  const [bars, setBars] = useState<number[]>(Array(12).fill(0.1));

  useEffect(() => {
    if (!isListening) {
      setBars(Array(12).fill(0.1));
      return;
    }

    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * amplitude + 0.1));
    }, 100);

    return () => clearInterval(interval);
  }, [isListening, amplitude]);

  return (
    <div className="flex items-center justify-center space-x-1 h-12">
      {bars.map((height, index) => (
        <div
          key={index}
          className={`w-1 bg-gradient-to-t transition-all duration-100 rounded-full ${
            isListening 
              ? 'from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/50' 
              : 'from-gray-400 to-gray-600'
          }`}
          style={{
            height: `${height * 100}%`,
            animationDelay: `${index * 50}ms`
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
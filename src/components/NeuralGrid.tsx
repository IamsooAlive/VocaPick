import React, { useEffect, useRef, useState } from 'react';

interface NeuralGridProps {
  intensity?: number;
  color?: string;
  animated?: boolean;
}

const NeuralGrid: React.FC<NeuralGridProps> = ({ 
  intensity = 0.3, 
  color = '#00ffff',
  animated = true 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const gridSize = 40;
  const cols = Math.ceil(dimensions.width / gridSize);
  const rows = Math.ceil(dimensions.height / gridSize);

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: intensity }}
    >
      <defs>
        <pattern id="neural-grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#neural-grid)" />
      
      {/* Animated scanning lines */}
      {animated && (
        <>
          <line
            x1="0"
            y1="0"
            x2={dimensions.width}
            y2="0"
            stroke={color}
            strokeWidth="2"
            opacity="0.8"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; 0,${dimensions.height}; 0,0`}
              dur="4s"
              repeatCount="indefinite"
            />
          </line>
          
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={dimensions.height}
            stroke={color}
            strokeWidth="2"
            opacity="0.6"
            filter="url(#glow)"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              values={`0,0; ${dimensions.width},0; 0,0`}
              dur="6s"
              repeatCount="indefinite"
            />
          </line>
        </>
      )}
      
      {/* Neural nodes */}
      {Array.from({ length: Math.floor(cols * rows * 0.1) }).map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * dimensions.width}
          cy={Math.random() * dimensions.height}
          r="2"
          fill={color}
          opacity="0.6"
          filter="url(#glow)"
        >
          <animate
            attributeName="opacity"
            values="0.2;0.8;0.2"
            dur={`${2 + Math.random() * 3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
};

export default NeuralGrid;
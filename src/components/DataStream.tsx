import React, { useEffect, useState } from 'react';

interface DataStreamProps {
  isActive?: boolean;
  speed?: number;
  density?: number;
}

const DataStream: React.FC<DataStreamProps> = ({ 
  isActive = false, 
  speed = 1,
  density = 20 
}) => {
  const [streams, setStreams] = useState<Array<{
    id: number;
    characters: string[];
    position: number;
    speed: number;
    column: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setStreams([]);
      return;
    }

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    const newStreams = Array.from({ length: density }, (_, i) => ({
      id: i,
      characters: Array.from({ length: 20 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ),
      position: Math.random() * -100,
      speed: 0.5 + Math.random() * speed,
      column: i
    }));

    setStreams(newStreams);

    const interval = setInterval(() => {
      setStreams(prev => prev.map(stream => ({
        ...stream,
        position: stream.position > 100 ? -20 : stream.position + stream.speed,
        characters: stream.position % 10 === 0 ? 
          stream.characters.map(() => 
            characters[Math.floor(Math.random() * characters.length)]
          ) : stream.characters
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [isActive, speed, density]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {streams.map(stream => (
        <div
          key={stream.id}
          className="absolute text-green-400 font-mono text-xs opacity-60"
          style={{
            left: `${(stream.column / density) * 100}%`,
            top: `${stream.position}%`,
            transform: 'translateY(-50%)',
            textShadow: '0 0 10px currentColor',
            writingMode: 'vertical-rl'
          }}
        >
          {stream.characters.map((char, i) => (
            <span
              key={i}
              className="block"
              style={{
                opacity: Math.max(0.1, 1 - (i * 0.1)),
                color: i === 0 ? '#00ff00' : '#004400'
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataStream;
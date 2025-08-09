import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Zap, Activity } from 'lucide-react';

interface TerminalLine {
  id: number;
  text: string;
  type: 'input' | 'output' | 'system' | 'error';
  timestamp: Date;
}

interface HolographicTerminalProps {
  title?: string;
  isActive?: boolean;
  commands?: string[];
  onCommand?: (command: string) => void;
}

const HolographicTerminal: React.FC<HolographicTerminalProps> = ({
  title = "Neural Command Interface",
  isActive = true,
  commands = [],
  onCommand
}) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, text: "Neural Warehouse System v2.1.0", type: 'system', timestamp: new Date() },
    { id: 2, text: "Initializing quantum processors...", type: 'output', timestamp: new Date() },
    { id: 3, text: "Voice recognition matrix: ONLINE", type: 'output', timestamp: new Date() },
    { id: 4, text: "Holographic interface: ACTIVE", type: 'output', timestamp: new Date() },
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commands.length > 0) {
      const latestCommand = commands[commands.length - 1];
      addLine(latestCommand, 'input');
      
      // Simulate processing
      setTimeout(() => {
        addLine(`Processing: ${latestCommand}`, 'output');
        setTimeout(() => {
          addLine('Command executed successfully', 'system');
        }, 500);
      }, 200);
    }
  }, [commands]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = (text: string, type: TerminalLine['type']) => {
    const newLine: TerminalLine = {
      id: Date.now(),
      text,
      type,
      timestamp: new Date()
    };
    
    setLines(prev => [...prev.slice(-20), newLine]); // Keep only last 20 lines
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim()) return;

    addLine(`> ${currentInput}`, 'input');
    onCommand?.(currentInput);
    setCurrentInput('');
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'input': return 'text-cyan-400';
      case 'output': return 'text-green-400';
      case 'system': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const typewriterEffect = (text: string, callback: () => void) => {
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setCurrentInput(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        callback();
      }
    }, 50);
  };

  return (
    <div className="relative bg-black/90 backdrop-blur-sm border border-cyan-500/30 rounded-lg overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30">
        <div className="flex items-center space-x-2">
          <Terminal className="text-cyan-400" size={16} />
          <span className="text-cyan-400 font-mono text-sm">{title}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <Activity className="text-cyan-400" size={14} />
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/50"
      >
        {lines.map((line) => (
          <div key={line.id} className={`${getLineColor(line.type)} flex items-start space-x-2`}>
            <span className="text-gray-600 text-xs min-w-[60px]">
              {line.timestamp.toLocaleTimeString().slice(0, 8)}
            </span>
            <span className="flex-1 break-all">{line.text}</span>
          </div>
        ))}
        
        {/* Cursor */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-600 text-xs min-w-[60px]">
            {new Date().toLocaleTimeString().slice(0, 8)}
          </span>
          <span className="text-cyan-400">{'>'}</span>
          <span className="text-white">
            {currentInput}
            <span className="animate-pulse">|</span>
          </span>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t border-cyan-500/30 p-3">
        <div className="flex items-center space-x-2">
          <Zap className="text-yellow-400" size={16} />
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Enter neural command..."
            className="flex-1 bg-transparent text-cyan-400 placeholder-gray-500 outline-none font-mono"
            disabled={isTyping}
          />
        </div>
      </form>

      {/* Holographic effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default HolographicTerminal;
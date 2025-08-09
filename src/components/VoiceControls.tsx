import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, HelpCircle, Zap, Radio } from 'lucide-react';
import voiceService from '../services/voiceService';
import HolographicCard from './HolographicCard';
import QuantumButton from './QuantumButton';
import VoiceWaveform from './VoiceWaveform';

interface VoiceControlsProps {
  onCommand: (command: string, confidence: number) => void;
  language: 'en' | 'ja';
  onLanguageChange: (language: 'en' | 'ja') => void;
  isEnabled?: boolean;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  onCommand,
  language,
  onLanguageChange,
  isEnabled = true
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
    voiceService.setLanguage(language);
  }, [language]);

  const toggleListening = () => {
    if (!isEnabled || !isSupported) return;

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
    } else {
      try {
        voiceService.startListening((command, confidence) => {
          setLastCommand(command);
          onCommand(command, confidence);
        });
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
      }
    }
  };

  const testSpeech = () => {
    const testMessage = language === 'en' 
      ? 'Voice system is working correctly' 
      : 'ボイスシステムが正常に動作しています';
    voiceService.speak(testMessage, language);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ja' : 'en';
    onLanguageChange(newLanguage);
  };

  const voiceCommands = voiceService.getVoiceCommands(language);

  if (!isSupported) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">
          {language === 'en' 
            ? 'Voice recognition is not supported in this browser' 
            : 'このブラウザではボイス認識がサポートされていません'}
        </p>
      </div>
    );
  }

  return (
    <HolographicCard className="p-6 border-l-4 border-cyan-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Radio className="text-cyan-400" size={24} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {language === 'en' ? 'Neural Voice Interface' : 'ニューラル音声インターフェース'}
          </h3>
        </div>
        <div className="flex space-x-2">
          <QuantumButton
            onClick={toggleLanguage}
            variant="secondary"
            size="sm"
            icon={<Languages size={16} />}
          >
            {language === 'en' ? 'JP' : 'EN'}
          </QuantumButton>
          <QuantumButton
            onClick={() => setShowHelp(!showHelp)}
            variant="secondary"
            size="sm"
            icon={<HelpCircle size={16} />}
          >
            {language === 'en' ? 'Help' : 'ヘルプ'}
          </QuantumButton>
        </div>
      </div>

      {/* Voice Waveform Display */}
      <div className="mb-6 p-4 rounded-lg bg-black/20 border border-cyan-500/20">
        <VoiceWaveform isListening={isListening} />
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <QuantumButton
          onClick={toggleListening}
          disabled={!isEnabled}
          variant={isListening ? 'danger' : 'primary'}
          size="lg"
          icon={isListening ? <MicOff size={20} /> : <Mic size={20} />}
          className={isListening ? 'animate-pulse' : ''}
        >
          {isListening
            ? (language === 'en' ? 'Neural Link Active' : 'ニューラルリンク有効')
            : (language === 'en' ? 'Activate Neural Link' : 'ニューラルリンク開始')
          }
        </QuantumButton>

        <QuantumButton
          onClick={testSpeech}
          variant="success"
          icon={<Volume2 size={18} />}
        >
          {language === 'en' ? 'Audio Test' : 'オーディオテスト'}
        </QuantumButton>
      </div>

      {lastCommand && (
        <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg p-4 mb-6 border border-green-500/20">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="text-green-400" size={16} />
            <p className="text-sm text-green-400 font-medium">
              {language === 'en' ? 'Neural Command Processed:' : '処理されたニューラルコマンド:'}
            </p>
          </div>
          <p className="text-white font-mono bg-black/30 rounded px-3 py-2">"{lastCommand}"</p>
        </div>
      )}

      {showHelp && (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-6 border border-blue-500/20 mb-4">
          <h4 className="font-bold text-blue-400 mb-4 flex items-center">
            <HelpCircle className="mr-2" size={20} />
            {language === 'en' ? 'Last Command:' : '最後のコマンド:'}
          </p>
            {language === 'en' ? 'Available Commands' : '利用可能なコマンド'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(voiceCommands).map(([command, description]) => (
              <div key={command} className="bg-black/20 rounded-lg p-3 border border-blue-500/20">
                <div className="font-mono text-cyan-400 text-sm mb-1">{command}</div>
                <div className="text-gray-300 text-xs">{description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm border-t border-cyan-500/20 pt-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
          }`}></div>
          <span className="text-gray-300">
            {language === 'en' ? 'Neural Interface:' : 'ニューラルインターフェース:'} 
            <span className="text-cyan-400 ml-1">{language === 'en' ? 'English' : '日本語'}</span>
          </span>
        </div>
      </div>
    </HolographicCard>
  );
};

export default VoiceControls;
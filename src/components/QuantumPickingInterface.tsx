import React, { useState, useEffect, useRef } from 'react';
import { Package, MapPin, CheckCircle2, AlertTriangle, ArrowRight, Clock, Volume2, Target, Zap, Cpu, Eye, Brain, Waves, Orbit } from 'lucide-react';
import { Order, OrderItem, PickingSession } from '../types/warehouse';
import warehouseService from '../services/warehouseService';
import voiceService from '../services/voiceService';
import VoiceControls from './VoiceControls';
import HolographicCard from './HolographicCard';
import QuantumButton from './QuantumButton';
import AnimatedBackground from './AnimatedBackground';

interface QuantumPickingInterfaceProps {
  order: Order;
  onOrderComplete: () => void;
}

const QuantumPickingInterface: React.FC<QuantumPickingInterfaceProps> = ({ order, onOrderComplete }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [session, setSession] = useState<PickingSession | null>(null);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string>('');
  const [quantumState, setQuantumState] = useState<'idle' | 'scanning' | 'locked' | 'complete'>('idle');
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [dimensionalShift, setDimensionalShift] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    loadOrderItems();
    startSession();
    initializeQuantumField();
    
    // Neural activity simulation
    const neuralInterval = setInterval(() => {
      setNeuralActivity(prev => (prev + Math.random() * 20) % 100);
    }, 200);

    // Dimensional shift animation
    const dimensionalInterval = setInterval(() => {
      setDimensionalShift(prev => (prev + 1) % 360);
    }, 50);

    return () => {
      clearInterval(neuralInterval);
      clearInterval(dimensionalInterval);
    };
  }, [order.id]);

  useEffect(() => {
    if (orderItems.length > 0 && currentItemIndex < orderItems.length) {
      announceCurrentItem();
      setQuantumState('scanning');
      setTimeout(() => setQuantumState('locked'), 1500);
    }
  }, [currentItemIndex, orderItems, language]);

  const initializeQuantumField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const drawQuantumField = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Quantum particles
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(Date.now() * 0.001 + i) * canvas.width / 4) + canvas.width / 2;
        const y = (Math.cos(Date.now() * 0.0015 + i) * canvas.height / 4) + canvas.height / 2;
        
        ctx.beginPath();
        ctx.arc(x, y, Math.sin(Date.now() * 0.01 + i) * 3 + 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${(Date.now() * 0.1 + i * 10) % 360}, 70%, 60%)`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
      }

      requestAnimationFrame(drawQuantumField);
    };

    drawQuantumField();
  };

  const loadOrderItems = async () => {
    try {
      setIsLoading(true);
      const items = await warehouseService.getOrderItems(order.id);
      setOrderItems(items);
    } catch (error) {
      console.error('Failed to load order items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async () => {
    try {
      const newSession = await warehouseService.startPickingSession('1', order.id);
      setSession(newSession);
    } catch (error) {
      console.error('Failed to start picking session:', error);
    }
  };

  const announceCurrentItem = () => {
    const currentItem = orderItems[currentItemIndex];
    if (!currentItem || !currentItem.product) return;

    const location = warehouseService.getLocationString(currentItem.product);
    const message = language === 'en'
      ? `Quantum lock acquired. Target: ${currentItem.quantity_ordered} units of ${currentItem.product.name} at dimensional coordinates ${location}`
      : `量子ロック取得。ターゲット: 次元座標 ${location} の ${currentItem.product.name} を ${currentItem.quantity_ordered} 個`;

    voiceService.speak(message, language);
    setFeedback(message);
    
    // Trigger quantum state change
    setQuantumState('scanning');
    playQuantumSound();
  };

  const playQuantumSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  };

  const handleVoiceCommand = (command: string, confidence: number) => {
    const parsedCommand = voiceService.parsePickingCommand(command, language);
    
    if (confidence < 0.6) {
      const message = language === 'en' ? 'Neural link unstable. Recalibrating...' : 'ニューラルリンクが不安定です。再調整中...';
      voiceService.speak(message, language);
      setFeedback(message);
      return;
    }

    const currentItem = orderItems[currentItemIndex];
    if (!currentItem) return;

    switch (parsedCommand.action) {
      case 'pick':
        handleQuantumPick(parsedCommand.quantity);
        break;
      case 'confirm':
        handleDimensionalShift();
        break;
      case 'skip':
        handleQuantumSkip();
        break;
      case 'repeat':
        announceCurrentItem();
        break;
      case 'help':
        announceQuantumHelp();
        break;
      default:
        const message = language === 'en' ? 'Unknown quantum signature. Initiating help protocol.' : '不明な量子シグネチャ。ヘルププロトコルを開始します。';
        voiceService.speak(message, language);
        setFeedback(message);
    }
  };

  const handleQuantumPick = async (quantity: number) => {
    const currentItem = orderItems[currentItemIndex];
    if (!currentItem || !currentItem.product) return;

    setQuantumState('scanning');
    playQuantumSound();

    if (quantity > currentItem.quantity_ordered) {
      const message = language === 'en' 
        ? `Quantum overflow detected: ${quantity} units exceed required ${currentItem.quantity_ordered}`
        : `量子オーバーフロー検出: ${quantity} 個が必要な ${currentItem.quantity_ordered} 個を超えています`;
      voiceService.speak(message, language);
      setFeedback(message);
      return;
    }

    try {
      const updatedItem = await warehouseService.updateOrderItemStatus(
        currentItem.id,
        'picked',
        quantity
      );

      const newItems = [...orderItems];
      newItems[currentItemIndex] = updatedItem;
      setOrderItems(newItems);

      setQuantumState('locked');
      const message = language === 'en' 
        ? `Quantum entanglement successful: ${quantity} units secured. Awaiting dimensional confirmation.`
        : `量子もつれ成功: ${quantity} 個確保。次元確認を待機中。`;
      
      voiceService.speak(message, language);
      setFeedback(message);

    } catch (error) {
      console.error('Failed to update item:', error);
      const message = language === 'en' ? 'Quantum field disruption. Reinitializing...' : '量子フィールド破綻。再初期化中...';
      voiceService.speak(message, language);
      setFeedback(message);
    }
  };

  const handleDimensionalShift = () => {
    setQuantumState('complete');
    if (currentItemIndex < orderItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      const message = language === 'en' ? 'Dimensional shift complete. Acquiring next target.' : '次元シフト完了。次のターゲットを取得中。';
      setFeedback(message);
      setTimeout(() => setQuantumState('idle'), 1000);
    } else {
      completeQuantumMission();
    }
  };

  const handleQuantumSkip = async () => {
    const currentItem = orderItems[currentItemIndex];
    if (!currentItem) return;

    try {
      await warehouseService.updateOrderItemStatus(currentItem.id, 'pending', 0);
      
      const message = language === 'en' 
        ? 'Target phased out of reality. Shifting to next dimension.' 
        : 'ターゲットが現実から位相シフト。次の次元に移動中。';
      
      voiceService.speak(message, language);
      setFeedback(message);
      
      if (currentItemIndex < orderItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      } else {
        completeQuantumMission();
      }
    } catch (error) {
      console.error('Failed to skip item:', error);
    }
  };

  const announceQuantumHelp = () => {
    const helpMessage = language === 'en' 
      ? 'Quantum protocols available: Voice pick with quantity, Confirm for dimensional shift, Skip for phase displacement, Repeat for target reacquisition.'
      : '利用可能な量子プロトコル: 数量でボイスピック、次元シフトの確認、位相変位のスキップ、ターゲット再取得のリピート。';
    
    voiceService.speak(helpMessage, language);
    setFeedback(helpMessage);
  };

  const completeQuantumMission = () => {
    setQuantumState('complete');
    const message = language === 'en' ? 'Quantum mission accomplished! All dimensions secured!' : '量子ミッション達成！すべての次元が確保されました！';
    voiceService.speak(message, language);
    setFeedback(message);
    onOrderComplete();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-8 border-4 border-pink-400 rounded-full animate-spin"></div>
            <Brain className="absolute inset-0 m-auto text-white animate-pulse" size={32} />
          </div>
          <p className="text-cyan-400 font-mono text-lg mt-6 animate-pulse">Initializing Quantum Consciousness...</p>
        </div>
      </div>
    );
  }

  const currentItem = orderItems[currentItemIndex];
  const progressPercentage = ((currentItemIndex + 1) / orderItems.length) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <AnimatedBackground intensity="high" theme="quantum" />
      
      {/* Quantum Field Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 p-6">
        {/* Quantum Command Center */}
        <HolographicCard className="p-8 border-l-8 border-cyan-400" variant="quantum" animated>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 p-1 animate-spin">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Eye className="text-cyan-400 animate-pulse" size={32} />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h2 className="text-4xl font-bold holographic-text mb-2">
                  QUANTUM MISSION: {order.order_number}
                </h2>
                <p className="text-gray-400 font-mono text-lg">Neural Interface Status: 
                  <span className={`ml-2 font-bold ${
                    quantumState === 'idle' ? 'text-blue-400' :
                    quantumState === 'scanning' ? 'text-yellow-400 animate-pulse' :
                    quantumState === 'locked' ? 'text-green-400' :
                    'text-purple-400'
                  }`}>
                    {quantumState.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 font-mono">{currentItemIndex + 1}</div>
                <div className="text-sm text-gray-400">DIMENSION</div>
                <div className="text-xs text-cyan-400">of {orderItems.length}</div>
              </div>
              
              <div className="relative">
                <div className={`px-6 py-3 rounded-lg font-bold text-lg border-4 transform rotate-3 ${
                  order.priority === 'high' ? 'bg-red-500/30 text-red-300 border-red-400 animate-pulse shadow-red-500/50' :
                  order.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300 border-yellow-400 shadow-yellow-500/50' :
                  'bg-green-500/30 text-green-300 border-green-400 shadow-green-500/50'
                } shadow-2xl`}>
                  <Zap className="inline mr-2 animate-bounce" size={20} />
                  {order.priority.toUpperCase()} PRIORITY
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Quantum Progress Matrix */}
          <div className="relative mb-8">
            <div className="w-full h-8 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-400/50">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 animate-shimmer"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
            <div className="absolute -top-12 right-0 text-cyan-400 font-mono text-xl font-bold">
              QUANTUM COMPLETION: {Math.round(progressPercentage)}%
            </div>
            
            {/* Neural Activity Indicator */}
            <div className="absolute -bottom-8 left-0 flex items-center space-x-2">
              <Waves className="text-purple-400 animate-pulse" size={16} />
              <div className="text-purple-400 font-mono text-sm">
                Neural Activity: {Math.round(neuralActivity)}%
              </div>
              <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-400 rounded-full transition-all duration-200"
                  style={{ width: `${neuralActivity}%` }}
                ></div>
              </div>
            </div>
          </div>
        </HolographicCard>

        {/* Voice Controls */}
        <VoiceControls
          onCommand={handleVoiceCommand}
          language={language}
          onLanguageChange={setLanguage}
          isEnabled={!!currentItem}
        />

        {/* Quantum Target Display */}
        {currentItem && currentItem.product && (
          <HolographicCard className="p-8 border-l-8 border-green-400" variant="neural" glowColor="green">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Target Information */}
              <div className="xl:col-span-2 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 p-1 animate-pulse">
                        <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                          <Package className="text-green-400" size={32} />
                        </div>
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                        <Target size={16} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2 holographic-text">
                        {currentItem.product.name}
                      </h3>
                      <p className="text-gray-400 font-mono text-lg">QUANTUM ID: {currentItem.product.sku}</p>
                      {currentItem.product.description && (
                        <p className="text-gray-500 text-sm mt-2 max-w-md">{currentItem.product.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dimensional Coordinates */}
                <div className="bg-gradient-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 rounded-xl p-6 border-2 border-red-400/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent animate-shimmer"></div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <MapPin className="text-red-400 animate-pulse" size={32} />
                        <div className="absolute inset-0 animate-ping">
                          <MapPin className="text-red-400/50" size={32} />
                        </div>
                      </div>
                      <span className="text-red-400 font-bold text-xl">DIMENSIONAL COORDINATES</span>
                    </div>
                    <div className="text-4xl font-mono font-bold text-white mb-2">
                      {warehouseService.getLocationString(currentItem.product)}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-2 bg-black/30 rounded">
                        <div className="text-red-400 font-bold">SECTOR</div>
                        <div className="text-white text-xl">{currentItem.product.location_aisle}</div>
                      </div>
                      <div className="text-center p-2 bg-black/30 rounded">
                        <div className="text-red-400 font-bold">LEVEL</div>
                        <div className="text-white text-xl">{currentItem.product.location_shelf}</div>
                      </div>
                      <div className="text-center p-2 bg-black/30 rounded">
                        <div className="text-red-400 font-bold">UNIT</div>
                        <div className="text-white text-xl">{currentItem.product.location_bin}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quantum Status Matrix */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-400/50">
                    <h4 className="font-bold text-blue-400 mb-4 flex items-center">
                      <Cpu className="mr-3 animate-spin" size={24} />
                      QUANTUM STATUS
                    </h4>
                    <div className="flex items-center space-x-4">
                      {currentItem.status === 'picked' ? (
                        <CheckCircle2 className="text-green-400 animate-pulse" size={32} />
                      ) : (
                        <AlertTriangle className="text-yellow-400 animate-bounce" size={32} />
                      )}
                      <div>
                        <div className="text-2xl font-bold text-white capitalize">
                          {currentItem.status}
                        </div>
                        <div className="text-sm text-gray-400">
                          Progress: {currentItem.quantity_picked}/{currentItem.quantity_ordered}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-500 relative"
                        style={{ width: `${(currentItem.quantity_picked / currentItem.quantity_ordered) * 100}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl p-6 border-2 border-purple-400/50">
                    <h4 className="font-bold text-purple-400 mb-4 flex items-center">
                      <Orbit className="mr-3 animate-spin" size={24} />
                      REALITY MATRIX
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 font-mono">{currentItem.product.current_stock}</div>
                        <div className="text-xs text-gray-400">AVAILABLE</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-400 font-mono">{currentItem.product.reserved_stock}</div>
                        <div className="text-xs text-gray-400">RESERVED</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Reality Stability</span>
                        <span>{Math.round((currentItem.product.current_stock / (currentItem.product.current_stock + currentItem.product.reserved_stock)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            currentItem.product.current_stock > 50 ? 'bg-gradient-to-r from-green-400 to-cyan-400' :
                            currentItem.product.current_stock > 20 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 
                            'bg-gradient-to-r from-red-400 to-pink-400'
                          }`}
                          style={{ width: `${Math.min((currentItem.product.current_stock / 100) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantum Control Panel */}
              <div className="space-y-6">
                <div className="text-center bg-black/50 rounded-xl p-8 border-4 border-green-400/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-cyan-400/10 animate-pulse"></div>
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-green-400 mb-2 font-mono animate-pulse">
                      {currentItem.quantity_ordered}
                    </div>
                    <div className="text-lg text-gray-400 mb-2">UNITS REQUIRED</div>
                    <div className="text-2xl text-green-400 font-bold">
                      {currentItem.quantity_picked} SECURED
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <QuantumButton
                    onClick={() => handleQuantumPick(currentItem.quantity_ordered)}
                    variant="success"
                    size="lg"
                    className="w-full"
                    icon={<Target size={20} />}
                  >
                    QUANTUM ACQUIRE ALL
                  </QuantumButton>
                  
                  <QuantumButton
                    onClick={handleQuantumSkip}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    icon={<Zap size={20} />}
                  >
                    PHASE DISPLACEMENT
                  </QuantumButton>
                </div>

                {/* Dimensional Shift Indicator */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-400/50">
                  <div className="text-center">
                    <div className="text-purple-400 font-bold mb-2">DIMENSIONAL PHASE</div>
                    <div 
                      className="w-16 h-16 mx-auto border-4 border-purple-400 rounded-full flex items-center justify-center font-mono text-purple-400 font-bold"
                      style={{ transform: `rotate(${dimensionalShift}deg)` }}
                    >
                      {Math.round(dimensionalShift)}°
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HolographicCard>
        )}

        {/* Neural Feedback Display */}
        {feedback && (
          <HolographicCard className="p-6 border-l-8 border-cyan-400" variant="matrix">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
                  <Volume2 className="text-white" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
              <div className="flex-1">
                <h4 className="text-cyan-400 font-bold text-xl mb-3 flex items-center">
                  <Brain className="mr-2 animate-pulse" size={24} />
                  NEURAL TRANSMISSION
                </h4>
                <div className="bg-black/50 rounded-lg p-4 border border-cyan-400/30">
                  <p className="text-white font-mono text-lg leading-relaxed">{feedback}</p>
                </div>
              </div>
            </div>
          </HolographicCard>
        )}

        {/* Quantum Action Controls */}
        <div className="flex justify-between space-x-8">
          <QuantumButton
            onClick={() => currentItemIndex > 0 && setCurrentItemIndex(currentItemIndex - 1)}
            disabled={currentItemIndex === 0}
            variant="secondary"
            size="lg"
            className="flex-1"
            icon={<ArrowRight size={24} className="rotate-180" />}
          >
            PREVIOUS DIMENSION
          </QuantumButton>

          <QuantumButton
            onClick={handleDimensionalShift}
            disabled={!currentItem || currentItem.status !== 'picked'}
            variant="primary"
            size="lg"
            icon={<ArrowRight size={24} />}
            className="flex-1"
          >
            DIMENSIONAL SHIFT
          </QuantumButton>
        </div>
      </div>
    </div>
  );
};

export default QuantumPickingInterface;
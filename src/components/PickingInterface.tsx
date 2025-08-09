import React, { useState, useEffect } from 'react';
import { Package, MapPin, CheckCircle2, AlertCircle, ArrowRight, Clock, Volume2, Target, Zap, Cpu } from 'lucide-react';
import { Order, OrderItem, PickingSession } from '../types/warehouse';
import warehouseService from '../services/warehouseService';
import voiceService from '../services/voiceService';
import VoiceControls from './VoiceControls';
import HolographicCard from './HolographicCard';
import QuantumButton from './QuantumButton';
import AnimatedBackground from './AnimatedBackground';

interface PickingInterfaceProps {
  order: Order;
  onOrderComplete: () => void;
}

const PickingInterface: React.FC<PickingInterfaceProps> = ({ order, onOrderComplete }) => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [session, setSession] = useState<PickingSession | null>(null);
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    loadOrderItems();
    startSession();
  }, [order.id]);

  useEffect(() => {
    if (orderItems.length > 0 && currentItemIndex < orderItems.length) {
      announceCurrentItem();
    }
  }, [currentItemIndex, orderItems, language]);

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
      ? `Please pick ${currentItem.quantity_ordered} units of ${currentItem.product.name} from location ${location}`
      : `場所 ${location} から ${currentItem.product.name} を ${currentItem.quantity_ordered} 個ピックしてください`;

    voiceService.speak(message, language);
    setFeedback(message);
  };

  const handleVoiceCommand = (command: string, confidence: number) => {
    const parsedCommand = voiceService.parsePickingCommand(command, language);
    
    if (confidence < 0.6) {
      const message = language === 'en' ? 'Sorry, I didn\'t understand. Please repeat.' : 'すみません、聞き取れませんでした。もう一度お願いします。';
      voiceService.speak(message, language);
      setFeedback(message);
      return;
    }

    const currentItem = orderItems[currentItemIndex];
    if (!currentItem) return;

    switch (parsedCommand.action) {
      case 'pick':
        handlePickItem(parsedCommand.quantity);
        break;
      case 'confirm':
        handleConfirmPick();
        break;
      case 'skip':
        handleSkipItem();
        break;
      case 'repeat':
        announceCurrentItem();
        break;
      case 'help':
        announceHelp();
        break;
      default:
        const message = language === 'en' ? 'Unknown command. Say "help" for available commands.' : '不明なコマンドです。「ヘルプ」と言って利用可能なコマンドを確認してください。';
        voiceService.speak(message, language);
        setFeedback(message);
    }
  };

  const handlePickItem = async (quantity: number) => {
    const currentItem = orderItems[currentItemIndex];
    if (!currentItem || !currentItem.product) return;

    if (quantity > currentItem.quantity_ordered) {
      const message = language === 'en' 
        ? `Warning: You picked ${quantity} but only ${currentItem.quantity_ordered} required`
        : `警告: ${quantity} 個ピックしましたが、必要なのは ${currentItem.quantity_ordered} 個です`;
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

      const message = language === 'en' 
        ? `Picked ${quantity} units. Please confirm or say next.`
        : `${quantity} 個ピックしました。確認するか、次と言ってください。`;
      
      voiceService.speak(message, language);
      setFeedback(message);

    } catch (error) {
      console.error('Failed to update item:', error);
      const message = language === 'en' ? 'Error updating item. Please try again.' : 'アイテムの更新でエラーが発生しました。もう一度お試しください。';
      voiceService.speak(message, language);
      setFeedback(message);
    }
  };

  const handleConfirmPick = () => {
    if (currentItemIndex < orderItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      const message = language === 'en' ? 'Moving to next item.' : '次のアイテムに移ります。';
      setFeedback(message);
    } else {
      completeOrder();
    }
  };

  const handleSkipItem = async () => {
    const currentItem = orderItems[currentItemIndex];
    if (!currentItem) return;

    try {
      await warehouseService.updateOrderItemStatus(currentItem.id, 'pending', 0);
      
      const message = language === 'en' 
        ? 'Item skipped. Moving to next item.' 
        : 'アイテムをスキップしました。次のアイテムに移ります。';
      
      voiceService.speak(message, language);
      setFeedback(message);
      
      if (currentItemIndex < orderItems.length - 1) {
        setCurrentItemIndex(currentItemIndex + 1);
      } else {
        completeOrder();
      }
    } catch (error) {
      console.error('Failed to skip item:', error);
    }
  };

  const announceHelp = () => {
    const helpMessage = language === 'en' 
      ? 'Available commands: Pick followed by quantity, Confirm to proceed, Skip for missing items, Repeat for instructions.'
      : '利用可能なコマンド: 数量の後にピック、確認して進む、アイテムが見つからない場合はスキップ、指示を繰り返す。';
    
    voiceService.speak(helpMessage, language);
    setFeedback(helpMessage);
  };

  const completeOrder = () => {
    const message = language === 'en' ? 'Order picking completed!' : '注文のピックが完了しました！';
    voiceService.speak(message, language);
    setFeedback(message);
    onOrderComplete();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const currentItem = orderItems[currentItemIndex];
  const progressPercentage = ((currentItemIndex + 1) / orderItems.length) * 100;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <div className="relative z-10 max-w-6xl mx-auto space-y-8 p-6">
      {/* Progress Header */}
        <HolographicCard className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Target className="text-cyan-400" size={32} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Mission: {order.order_number}
                </h2>
                <p className="text-gray-400">Neural Picking Protocol Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{currentItemIndex + 1}</div>
                <div className="text-sm text-gray-400">of {orderItems.length}</div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-bold text-sm border-2 ${
                order.priority === 'high' ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse' :
                order.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                'bg-green-500/20 text-green-400 border-green-500/50'
              }`}>
                <Zap className="inline mr-1" size={16} />
                {order.priority.toUpperCase()} PRIORITY
              </div>
            </div>
          </div>

          {/* Advanced Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
              </div>
            </div>
            <div className="absolute -top-8 right-0 text-cyan-400 font-mono text-sm">
              {Math.round(progressPercentage)}% Complete
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

      {/* Current Item */}
      {currentItem && currentItem.product && (
        <HolographicCard className="p-8 border-l-4 border-green-500" glowColor="green">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Package className="text-green-400" size={32} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {currentItem.product.name}
                </h3>
                <p className="text-gray-400 font-mono">SKU: {currentItem.product.sku}</p>
                {currentItem.product.description && (
                  <p className="text-gray-500 text-sm mt-1">{currentItem.product.description}</p>
                )}
              </div>
            </div>
            <div className="text-center bg-black/30 rounded-lg p-4 border border-green-500/30">
              <div className="text-4xl font-bold text-green-400 mb-1">
                {currentItem.quantity_ordered}
              </div>
              <div className="text-sm text-gray-400">units required</div>
              <div className="text-xs text-green-400 mt-1">
                {currentItem.quantity_picked} picked
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Location Display */}
              <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/30">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPin className="text-red-400" size={24} />
                  <span className="text-red-400 font-medium">Target Location</span>
                </div>
                <div className="text-2xl font-mono font-bold text-white">
                  {warehouseService.getLocationString(currentItem.product)}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Aisle {currentItem.product.location_aisle} • Shelf {currentItem.product.location_shelf} • Bin {currentItem.product.location_bin}
                </div>
              </div>
              
              {/* Status Display */}
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/30">
                <h4 className="font-medium text-blue-400 mb-3 flex items-center">
                  <Cpu className="mr-2" size={20} />
                  Neural Status
                </h4>
                <div className="flex items-center space-x-3">
                  {currentItem.status === 'picked' ? (
                    <CheckCircle2 className="text-green-400" size={24} />
                  ) : (
                    <AlertCircle className="text-yellow-400" size={24} />
                  )}
                  <div>
                    <div className="capitalize font-bold text-white">
                      {currentItem.status}
                    </div>
                    <div className="text-sm text-gray-400">
                      Progress: {currentItem.quantity_picked}/{currentItem.quantity_ordered}
                    </div>
                  </div>
                </div>
                
                {/* Mini progress bar */}
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentItem.quantity_picked / currentItem.quantity_ordered) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Inventory Information */}
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border border-purple-500/30">
                <h4 className="font-medium text-purple-400 mb-3">Inventory Matrix</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{currentItem.product.current_stock}</div>
                    <div className="text-xs text-gray-400">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{currentItem.product.reserved_stock}</div>
                    <div className="text-xs text-gray-400">Reserved</div>
                  </div>
                </div>
                
                {/* Stock level indicator */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Stock Level</span>
                    <span>{Math.round((currentItem.product.current_stock / (currentItem.product.current_stock + currentItem.product.reserved_stock)) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentItem.product.current_stock > 50 ? 'bg-green-400' :
                        currentItem.product.current_stock > 20 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${Math.min((currentItem.product.current_stock / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 rounded-lg p-4 border border-gray-500/30">
                <h4 className="font-medium text-gray-400 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <QuantumButton
                    onClick={() => handlePickItem(currentItem.quantity_ordered)}
                    variant="success"
                    size="sm"
                  >
                    Pick All
                  </QuantumButton>
                  <QuantumButton
                    onClick={handleSkipItem}
                    variant="secondary"
                    size="sm"
                  >
                    Skip Item
                  </QuantumButton>
                </div>
              </div>
            </div>
          </div>
        </HolographicCard>
      )}

      {/* Voice Feedback */}
      {feedback && (
        <HolographicCard className="p-6 border-l-4 border-cyan-500">
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Volume2 className="text-cyan-400 mt-1" size={20} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            </div>
            <div>
              <h4 className="text-cyan-400 font-medium mb-2">Neural Feedback</h4>
              <p className="text-white bg-black/30 rounded-lg p-3 font-mono">{feedback}</p>
            </div>
          </div>
        </HolographicCard>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex justify-between space-x-6">
        <QuantumButton
          onClick={() => currentItemIndex > 0 && setCurrentItemIndex(currentItemIndex - 1)}
          disabled={currentItemIndex === 0}
          variant="secondary"
          size="lg"
          className="flex-1"
        >
          ← Previous Target
        </QuantumButton>

        <QuantumButton
          onClick={handleConfirmPick}
          disabled={!currentItem || currentItem.status !== 'picked'}
          variant="primary"
          size="lg"
          icon={<ArrowRight size={20} />}
          className="flex-1"
        >
          Confirm & Advance
        </QuantumButton>
      </div>
      </div>
    </div>
  );
};

export default PickingInterface;
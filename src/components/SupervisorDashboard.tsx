import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Package, Clock, AlertTriangle, TrendingUp, RefreshCw, Brain, Eye, Zap, Cpu } from 'lucide-react';
import { Order, WarehouseMetrics } from '../types/warehouse';
import warehouseService from '../services/warehouseService';
import HolographicCard from './HolographicCard';
import QuantumButton from './QuantumButton';

const SupervisorDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<WarehouseMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [metricsData, ordersData] = await Promise.all([
        warehouseService.getWarehouseMetrics('1'),
        warehouseService.getOrders('1')
      ]);
      
      setMetrics(metricsData);
      setOrders(ordersData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'picking': return 'bg-blue-100 text-blue-800';
      case 'picked': return 'bg-green-100 text-green-800';
      case 'packed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            <div className="absolute inset-8 border-4 border-pink-400 rounded-full animate-spin"></div>
            <Brain className="absolute inset-0 m-auto text-white animate-pulse" size={32} />
          </div>
          <p className="text-cyan-400 font-mono text-lg mt-6 animate-pulse">Initializing Command Matrix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
        <HolographicCard className="p-8" variant="quantum">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 p-1 animate-spin">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Eye className="text-purple-400 animate-pulse" size={32} />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold holographic-text mb-2">Neural Command Center</h1>
                <p className="text-gray-400 font-mono text-lg">Quantum Oversight Protocol Active</p>
              </div>
            </div>
          <div className="flex items-center space-x-4">
              <QuantumButton
              onClick={loadDashboardData}
                variant="primary"
                icon={<RefreshCw size={16} />}
            >
                Quantum Sync
              </QuantumButton>
            <div className="text-sm text-cyan-400 font-mono">
                Neural Link Updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
        </HolographicCard>

      {/* Metrics Cards */}
      {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <HolographicCard className="p-6" variant="neural" glowColor="blue">
            <div className="flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-blue-400">Total Missions</h3>
                  <p className="text-4xl font-bold text-blue-400 font-mono">{metrics.total_orders}</p>
              </div>
                <div className="relative">
                  <Package className="text-blue-400 animate-pulse" size={40} />
                  <div className="absolute inset-0 animate-ping">
                    <Package className="text-blue-400/30" size={40} />
                  </div>
                </div>
            </div>
            </HolographicCard>

            <HolographicCard className="p-6" variant="neural" glowColor="green">
            <div className="flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-green-400">Active Neural Links</h3>
                  <p className="text-4xl font-bold text-green-400 font-mono">{metrics.active_picking_sessions}</p>
              </div>
                <div className="relative">
                  <Brain className="text-green-400 animate-pulse" size={40} />
                  <div className="absolute inset-0 animate-ping">
                    <Brain className="text-green-400/30" size={40} />
                  </div>
                </div>
            </div>
            </HolographicCard>

            <HolographicCard className="p-6" variant="neural" glowColor="purple">
            <div className="flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-purple-400">Quantum Completions</h3>
                  <p className="text-4xl font-bold text-purple-400 font-mono">{metrics.completed_today}</p>
              </div>
                <div className="relative">
                  <TrendingUp className="text-purple-400 animate-bounce" size={40} />
                  <div className="absolute inset-0 animate-ping">
                    <TrendingUp className="text-purple-400/30" size={40} />
                  </div>
                </div>
            </div>
            </HolographicCard>

            <HolographicCard className="p-6" variant="neural" glowColor="yellow">
            <div className="flex items-center justify-between">
              <div>
                  <h3 className="text-lg font-semibold text-yellow-400">Pending Missions</h3>
                  <p className="text-4xl font-bold text-yellow-400 font-mono">{metrics.pending_orders}</p>
              </div>
                <div className="relative">
                  <Clock className="text-yellow-400 animate-spin" size={40} />
                  <div className="absolute inset-0 animate-ping">
                    <Clock className="text-yellow-400/30" size={40} />
                  </div>
                </div>
            </div>
            </HolographicCard>
        </div>
      )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Orders */}
          <HolographicCard variant="matrix">
            <div className="p-6 border-b border-green-400/30">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Cpu className="mr-3 text-green-400 animate-pulse" size={32} />
                <span className="holographic-text">Active Quantum Missions</span>
            </h2>
          </div>
          <div className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-green-500/50">
              {orders.map((order) => (
                  <div key={order.id} className="bg-gradient-to-r from-black/50 to-green-900/20 border border-green-400/30 rounded-lg p-4 hover:border-green-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white font-mono">{order.order_number}</h3>
                    <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getPriorityColor(order.priority)} animate-pulse`}>
                          <Zap className="inline mr-1" size={12} />
                        {order.priority.toUpperCase()}
                      </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                    <p className="text-sm text-cyan-400 mb-2">Target Entity: {order.customer_name}</p>
                  <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        Genesis: {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    {order.assigned_worker_id && (
                        <span className="text-green-400 font-mono">
                          Neural Agent #{order.assigned_worker_id}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {orders.length === 0 && (
                <div className="text-center py-8">
                    <div className="relative mb-4">
                      <Package className="mx-auto h-16 w-16 text-gray-400 animate-pulse" />
                      <div className="absolute inset-0 animate-ping">
                        <Package className="mx-auto h-16 w-16 text-gray-400/30" />
                      </div>
                    </div>
                    <p className="mt-2 text-gray-400">No active missions detected</p>
                </div>
              )}
            </div>
          </div>
          </HolographicCard>

        {/* Worker Productivity */}
          <HolographicCard variant="quantum">
            <div className="p-6 border-b border-purple-400/30">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Brain className="mr-3 text-purple-400 animate-pulse" size={32} />
                <span className="holographic-text">Neural Agent Performance</span>
            </h2>
          </div>
          <div className="p-6">
            {metrics && (
                <div className="space-y-6">
                {metrics.worker_productivity.map((worker) => (
                    <div key={worker.worker_id} className="bg-gradient-to-r from-black/50 to-purple-900/20 border border-purple-400/30 rounded-lg p-4 hover:border-purple-400 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white">{worker.worker_name}</h3>
                        <span className="text-sm text-purple-400 font-mono">Neural ID: {worker.worker_id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                          <p className="text-sm text-purple-400">Missions Completed</p>
                          <p className="text-2xl font-bold text-blue-400 font-mono">{worker.orders_completed}</p>
                      </div>
                      <div>
                          <p className="text-sm text-purple-400">Quantum Acquisitions</p>
                          <p className="text-2xl font-bold text-green-400 font-mono">{worker.items_picked}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                        <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-500 relative"
                          style={{ width: `${Math.min((worker.items_picked / 30) * 100, 100)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer"></div>
                          </div>
                      </div>
                        <p className="text-xs text-cyan-400 mt-1 font-mono">
                          Neural Efficiency: {Math.round((worker.items_picked / 30) * 100)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          </HolographicCard>
      </div>

      {/* Alerts Section */}
        <HolographicCard variant="neural">
          <div className="p-6 border-b border-cyan-400/30">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <AlertTriangle className="mr-3 text-cyan-400 animate-pulse" size={32} />
              <span className="holographic-text">Neural System Alerts</span>
          </h2>
        </div>
        <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg">
                <AlertTriangle className="text-yellow-400 mr-4 animate-bounce" size={24} />
              <div>
                  <p className="font-bold text-yellow-400">High Priority Mission Pending</p>
                  <p className="text-sm text-yellow-300">Mission ORD-2025-001 has been in quantum flux for over 2 hours</p>
              </div>
            </div>
            
              <div className="flex items-center p-4 bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-400/50 rounded-lg">
                <TrendingUp className="text-green-400 mr-4 animate-pulse" size={24} />
              <div>
                  <p className="font-bold text-green-400">Neural Voice Matrix Online</p>
                  <p className="text-sm text-green-300">All quantum voice recognition protocols functioning at optimal levels</p>
              </div>
            </div>
          </div>
        </div>
        </HolographicCard>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
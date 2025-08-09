export interface User {
  id: string;
  name: string;
  role: 'worker' | 'supervisor' | 'admin';
  warehouse_id: string;
  created_at: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description?: string;
  location_aisle: string;
  location_shelf: string;
  location_bin: string;
  current_stock: number;
  reserved_stock: number;
  warehouse_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  status: 'pending' | 'picking' | 'picked' | 'packed' | 'shipped';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_worker_id?: string;
  warehouse_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_picked: number;
  status: 'pending' | 'picking' | 'picked';
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface PickingSession {
  id: string;
  worker_id: string;
  order_id: string;
  status: 'active' | 'paused' | 'completed';
  started_at: string;
  completed_at?: string;
  total_items: number;
  picked_items: number;
}

export interface VoiceCommand {
  command: string;
  parameters?: Record<string, any>;
  language: 'en' | 'ja';
  confidence: number;
  timestamp: string;
}

export interface WarehouseMetrics {
  total_orders: number;
  active_picking_sessions: number;
  completed_today: number;
  pending_orders: number;
  worker_productivity: {
    worker_id: string;
    worker_name: string;
    orders_completed: number;
    items_picked: number;
  }[];
}
import { Order, OrderItem, Product, PickingSession, WarehouseMetrics, User } from '../types/warehouse';

class WarehouseService {
  private baseUrl = '/api/warehouse';

  // Mock data for demonstration
  private mockOrders: Order[] = [
    {
      id: '1',
      order_number: 'ORD-2025-001',
      customer_name: 'ABC Manufacturing',
      status: 'picking',
      priority: 'high',
      assigned_worker_id: '1',
      warehouse_id: '1',
      created_at: '2025-01-27T08:30:00Z',
      updated_at: '2025-01-27T09:15:00Z'
    },
    {
      id: '2',
      order_number: 'ORD-2025-002',
      customer_name: 'XYZ Corporation',
      status: 'pending',
      priority: 'medium',
      warehouse_id: '1',
      created_at: '2025-01-27T09:00:00Z',
      updated_at: '2025-01-27T09:00:00Z'
    }
  ];

  private mockOrderItems: OrderItem[] = [
    {
      id: '1',
      order_id: '1',
      product_id: '1',
      quantity_ordered: 5,
      quantity_picked: 3,
      status: 'picking',
      created_at: '2025-01-27T08:30:00Z',
      updated_at: '2025-01-27T09:15:00Z'
    },
    {
      id: '2',
      order_id: '1',
      product_id: '2',
      quantity_ordered: 2,
      quantity_picked: 0,
      status: 'pending',
      created_at: '2025-01-27T08:30:00Z',
      updated_at: '2025-01-27T08:30:00Z'
    }
  ];

  private mockProducts: Product[] = [
    {
      id: '1',
      sku: 'SKU-A001',
      name: 'Industrial Bearing',
      description: 'High-grade industrial bearing component',
      location_aisle: 'A',
      location_shelf: '3',
      location_bin: '15',
      current_stock: 150,
      reserved_stock: 25,
      warehouse_id: '1',
      created_at: '2025-01-27T08:00:00Z'
    },
    {
      id: '2',
      sku: 'SKU-B002',
      name: 'Steel Connector',
      description: 'Stainless steel connector piece',
      location_aisle: 'B',
      location_shelf: '1',
      location_bin: '08',
      current_stock: 89,
      reserved_stock: 12,
      warehouse_id: '1',
      created_at: '2025-01-27T08:00:00Z'
    }
  ];

  async getOrders(warehouseId: string, status?: string): Promise<Order[]> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let orders = this.mockOrders.filter(order => order.warehouse_id === warehouseId);
    if (status) {
      orders = orders.filter(order => order.status === status);
    }
    return orders;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const items = this.mockOrderItems.filter(item => item.order_id === orderId);
    
    // Attach product information
    return items.map(item => ({
      ...item,
      product: this.mockProducts.find(p => p.id === item.product_id)
    }));
  }

  async updateOrderItemStatus(itemId: string, status: string, quantityPicked?: number): Promise<OrderItem> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const itemIndex = this.mockOrderItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Order item not found');
    }

    this.mockOrderItems[itemIndex] = {
      ...this.mockOrderItems[itemIndex],
      status: status as any,
      quantity_picked: quantityPicked ?? this.mockOrderItems[itemIndex].quantity_picked,
      updated_at: new Date().toISOString()
    };

    return {
      ...this.mockOrderItems[itemIndex],
      product: this.mockProducts.find(p => p.id === this.mockOrderItems[itemIndex].product_id)
    };
  }

  async startPickingSession(workerId: string, orderId: string): Promise<PickingSession> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const orderItems = await this.getOrderItems(orderId);
    
    const session: PickingSession = {
      id: `session_${Date.now()}`,
      worker_id: workerId,
      order_id: orderId,
      status: 'active',
      started_at: new Date().toISOString(),
      total_items: orderItems.length,
      picked_items: orderItems.filter(item => item.status === 'picked').length
    };

    // Update order status
    const orderIndex = this.mockOrders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      this.mockOrders[orderIndex] = {
        ...this.mockOrders[orderIndex],
        status: 'picking',
        assigned_worker_id: workerId,
        updated_at: new Date().toISOString()
      };
    }

    return session;
  }

  async getWarehouseMetrics(warehouseId: string): Promise<WarehouseMetrics> {
    await new Promise(resolve => setTimeout(resolve, 400));

    return {
      total_orders: this.mockOrders.length,
      active_picking_sessions: 1,
      completed_today: 5,
      pending_orders: this.mockOrders.filter(order => order.status === 'pending').length,
      worker_productivity: [
        {
          worker_id: '1',
          worker_name: 'John Smith',
          orders_completed: 3,
          items_picked: 25
        },
        {
          worker_id: '2',
          worker_name: 'Maria Garcia',
          orders_completed: 2,
          items_picked: 18
        }
      ]
    };
  }

  async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      id: '1',
      name: 'John Smith',
      role: 'worker',
      warehouse_id: '1',
      created_at: '2025-01-27T08:00:00Z'
    };
  }

  getLocationString(product: Product): string {
    return `${product.location_aisle}-${product.location_shelf}-${product.location_bin}`;
  }

  validatePickQuantity(orderedQuantity: number, currentStock: number, pickedQuantity: number): boolean {
    return pickedQuantity <= orderedQuantity && pickedQuantity <= currentStock;
  }
}

export default new WarehouseService();
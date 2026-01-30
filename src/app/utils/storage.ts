// Storage utilities for managing orders and purchases

export interface OrderItem {
  productId: string;
  productName: string;
  productBarcode: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'upi' | 'card';
  paidAmount: number;
  remainingAmount: number;
  status: 'completed' | 'pending';
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  costPricePerUnit: number;
  totalCost: number;
}

export interface Purchase {
  id: string;
  date: string;
  supplierName: string;
  items: PurchaseItem[];
  totalCost: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'pending';
}

const ORDERS_KEY = 'wholesale_orders';
const PURCHASES_KEY = 'wholesale_purchases';

// Orders Management
export const getOrders = (): Order[] => {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading orders:', error);
    return [];
  }
};

export const saveOrder = (order: Order): void => {
  try {
    const orders = getOrders();
    orders.unshift(order); // Add to beginning
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving order:', error);
  }
};

export const updateOrder = (orderId: string, updates: Partial<Order>): void => {
  try {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  } catch (error) {
    console.error('Error updating order:', error);
  }
};

// Purchases Management
export const getPurchases = (): Purchase[] => {
  try {
    const data = localStorage.getItem(PURCHASES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading purchases:', error);
    return [];
  }
};

export const savePurchase = (purchase: Purchase): void => {
  try {
    const purchases = getPurchases();
    purchases.unshift(purchase); // Add to beginning
    localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
  } catch (error) {
    console.error('Error saving purchase:', error);
  }
};

export const updatePurchase = (purchaseId: string, updates: Partial<Purchase>): void => {
  try {
    const purchases = getPurchases();
    const index = purchases.findIndex(p => p.id === purchaseId);
    if (index !== -1) {
      purchases[index] = { ...purchases[index], ...updates };
      localStorage.setItem(PURCHASES_KEY, JSON.stringify(purchases));
    }
  } catch (error) {
    console.error('Error updating purchase:', error);
  }
};

// Generate unique ID
export const generateId = (prefix: string): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

// Statistics
export const getOrderStatistics = () => {
  const orders = getOrders();
  return {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalCollected: orders.reduce((sum, o) => sum + o.paidAmount, 0),
    totalPending: orders.reduce((sum, o) => sum + o.remainingAmount, 0),
  };
};

export const getPurchaseStatistics = () => {
  const purchases = getPurchases();
  return {
    total: purchases.length,
    paid: purchases.filter(p => p.status === 'paid').length,
    pending: purchases.filter(p => p.status === 'pending').length,
    totalExpense: purchases.reduce((sum, p) => sum + p.totalCost, 0),
    totalPaid: purchases.reduce((sum, p) => sum + p.paidAmount, 0),
    totalPending: purchases.reduce((sum, p) => sum + p.remainingAmount, 0),
  };
};

// Profit & Loss Calculation
export const calculateProfitLoss = (startDate?: string, endDate?: string) => {
  const orders = getOrders();
  const purchases = getPurchases();

  let filteredOrders = orders;
  let filteredPurchases = purchases;

  if (startDate && endDate) {
    filteredOrders = orders.filter(o => o.date >= startDate && o.date <= endDate);
    filteredPurchases = purchases.filter(p => p.date >= startDate && p.date <= endDate);
  }

  const totalSales = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalPurchases = filteredPurchases.reduce((sum, p) => sum + p.totalCost, 0);
  const profitLoss = totalSales - totalPurchases;

  return {
    totalSales,
    totalPurchases,
    profitLoss,
    margin: totalSales > 0 ? ((profitLoss / totalSales) * 100).toFixed(2) : '0',
  };
};

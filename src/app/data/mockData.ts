export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode: string;
  unit: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Rice',
    category: 'Grains',
    price: 45.99,
    stock: 500,
    barcode: '1234567890123',
    unit: 'kg'
  },
  {
    id: '2',
    name: 'Organic Wheat Flour',
    category: 'Grains',
    price: 35.50,
    stock: 350,
    barcode: '2345678901234',
    unit: 'kg'
  },
  {
    id: '3',
    name: 'Basmati Rice',
    category: 'Grains',
    price: 65.00,
    stock: 200,
    barcode: '3456789012345',
    unit: 'kg'
  },
  {
    id: '4',
    name: 'Cooking Oil',
    category: 'Oils',
    price: 120.00,
    stock: 150,
    barcode: '4567890123456',
    unit: 'L'
  },
  {
    id: '5',
    name: 'Sunflower Oil',
    category: 'Oils',
    price: 110.00,
    stock: 180,
    barcode: '5678901234567',
    unit: 'L'
  },
  {
    id: '6',
    name: 'Red Lentils',
    category: 'Pulses',
    price: 55.00,
    stock: 300,
    barcode: '6789012345678',
    unit: 'kg'
  },
  {
    id: '7',
    name: 'Chickpeas',
    category: 'Pulses',
    price: 48.00,
    stock: 250,
    barcode: '7890123456789',
    unit: 'kg'
  },
  {
    id: '8',
    name: 'Black Beans',
    category: 'Pulses',
    price: 52.00,
    stock: 220,
    barcode: '8901234567890',
    unit: 'kg'
  },
  {
    id: '9',
    name: 'White Sugar',
    category: 'Sweeteners',
    price: 38.00,
    stock: 400,
    barcode: '9012345678901',
    unit: 'kg'
  },
  {
    id: '10',
    name: 'Brown Sugar',
    category: 'Sweeteners',
    price: 42.00,
    stock: 280,
    barcode: '0123456789012',
    unit: 'kg'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2026-01-25',
    customerName: 'Green Valley Store',
    items: [
      { product: products[0], quantity: 50 },
      { product: products[3], quantity: 20 }
    ],
    total: 4699.50,
    status: 'completed'
  },
  {
    id: 'ORD-002',
    date: '2026-01-26',
    customerName: 'City Mart',
    items: [
      { product: products[1], quantity: 30 },
      { product: products[5], quantity: 25 }
    ],
    total: 2440.00,
    status: 'completed'
  },
  {
    id: 'ORD-003',
    date: '2026-01-27',
    customerName: 'Downtown Grocers',
    items: [
      { product: products[2], quantity: 40 },
      { product: products[6], quantity: 35 },
      { product: products[8], quantity: 50 }
    ],
    total: 6280.00,
    status: 'pending'
  }
];

export const shopkeeperInfo = {
  name: 'Rajesh Kumar',
  businessName: 'Kumar Wholesale Mart',
  phone: '+1 (555) 123-4567',
  email: 'rajesh@kumarwholesale.com',
  address: '123 Market Street, Commerce District',
  gstin: '27AAAAA0000A1Z5'
};

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Printer, User } from 'lucide-react';
import Barcode from 'react-barcode';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { products, shopkeeperInfo, type Product } from '../data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface CartItem {
  product: Product;
  quantity: number;
}

export function Billing() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const printRef = useRef<HTMLDivElement | null>(null);

  const addToCart = () => {
    if (!selectedProduct) return;
    
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    setSelectedProduct('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.product.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      .invoice-header { text-align: center; margin-bottom: 30px; }
      .invoice-details { margin-bottom: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background-color: #f3f4f6; font-weight: bold; }
      .totals { margin-top: 20px; text-align: right; }
      .totals div { margin: 5px 0; }
      .total-amount { font-size: 18px; font-weight: bold; }
      @media print { button { display: none; } }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  const handleClearCart = () => {
    setCart([]);
    setCustomerName('');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">Create and manage invoices</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="customer"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Add Product */}
              <div className="flex gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ${product.price}/{product.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addToCart} disabled={!selectedProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          ${item.product.price}/{item.product.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <Button
                  className="w-full gap-2"
                  onClick={handlePrint}
                  disabled={cart.length === 0}
                >
                  <Printer className="h-4 w-4" />
                  Print Bill
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearCart}
                  disabled={cart.length === 0}
                >
                  Clear Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hidden Print Template */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <div className="invoice-header">
            <h1>{shopkeeperInfo.businessName}</h1>
            <p>{shopkeeperInfo.address}</p>
            <p>Phone: {shopkeeperInfo.phone} | Email: {shopkeeperInfo.email}</p>
            <p>GSTIN: {shopkeeperInfo.gstin}</p>
          </div>

          <div className="invoice-details">
            <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Customer Name:</strong> {customerName || 'Walk-in Customer'}</p>
            <p><strong>Invoice #:</strong> INV-{Date.now().toString().slice(-6)}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Barcode</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>{item.product.barcode}</td>
                  <td>${item.product.price}/{item.product.unit}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="totals">
            <div>Subtotal: ${subtotal.toFixed(2)}</div>
            <div>Tax (18%): ${tax.toFixed(2)}</div>
            <div className="total-amount">Total Amount: ${total.toFixed(2)}</div>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px' }}>
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

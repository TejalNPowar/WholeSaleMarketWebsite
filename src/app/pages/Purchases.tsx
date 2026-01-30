import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Plus, Minus, Trash2, User, DollarSign, Calendar, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Separator } from '@/app/components/ui/separator';
import { Badge } from '@/app/components/ui/badge';
import { products } from '@/app/data/mockData';
import { savePurchase, getPurchases, getPurchaseStatistics, generateId, type Purchase, type PurchaseItem } from '@/app/utils/storage';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface PurchaseCartItem {
  productId: string;
  productName: string;
  quantity: number;
  costPricePerUnit: number;
}

export function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    totalExpense: 0,
    totalPaid: 0,
    totalPending: 0,
  });
  const [expandedPurchase, setExpandedPurchase] = useState<string | null>(null);

  // Form state
  const [cart, setCart] = useState<PurchaseCartItem[]>([]);
  const [supplierName, setSupplierName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [costPrice, setCostPrice] = useState('');
  const [paidAmount, setPaidAmount] = useState('');

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = () => {
    const loadedPurchases = getPurchases();
    const statistics = getPurchaseStatistics();
    setPurchases(loadedPurchases);
    setStats(statistics);
  };

  const addToCart = () => {
    if (!selectedProduct || !costPrice) {
      toast.error('Please select a product and enter cost price');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const cost = parseFloat(costPrice);
    if (cost <= 0) {
      toast.error('Cost price must be greater than 0');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1, costPricePerUnit: cost }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        costPricePerUnit: cost,
      }]);
    }
    
    setSelectedProduct('');
    setCostPrice('');
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const totalCost = cart.reduce((sum, item) => sum + (item.costPricePerUnit * item.quantity), 0);

  const handleClearForm = () => {
    setCart([]);
    setSupplierName('');
    setPaidAmount('');
  };

  const handleConfirmPurchase = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!supplierName.trim()) {
      toast.error('Please enter supplier name');
      return;
    }

    const paid = parseFloat(paidAmount) || 0;
    
    if (paid < 0) {
      toast.error('Paid amount cannot be negative');
      return;
    }

    const purchase: Purchase = {
      id: generateId('PUR'),
      date: new Date().toISOString().split('T')[0],
      supplierName: supplierName.trim(),
      items: cart.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        costPricePerUnit: item.costPricePerUnit,
        totalCost: item.costPricePerUnit * item.quantity,
      })),
      totalCost,
      paidAmount: paid,
      remainingAmount: totalCost - paid,
      status: (paid >= totalCost ? 'paid' : 'pending') as 'paid' | 'pending',
    };

    savePurchase(purchase);
    
    toast.success(`Purchase ${purchase.id} recorded successfully!`, {
      description: purchase.status === 'paid' 
        ? 'Payment completed' 
        : `Remaining: $${purchase.remainingAmount.toFixed(2)}`,
    });

    handleClearForm();
    loadPurchases();
  };

  const togglePurchase = (purchaseId: string) => {
    setExpandedPurchase(expandedPurchase === purchaseId ? null : purchaseId);
  };

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
        <p className="text-gray-500 mt-1">Track stock purchases and expenses</p>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Purchases</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Expense: ${stats.totalExpense.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Paid</p>
                  <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Amount: ${stats.totalPaid.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: ${stats.totalPending.toFixed(2)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Purchase Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Record Purchase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Supplier Name */}
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="supplier"
                    placeholder="Enter supplier name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Add Product */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Cost price"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                />
                <Button onClick={addToCart} disabled={!selectedProduct || !costPrice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <Separator />

              {/* Cart Items */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No items added</p>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.productName}</p>
                        <p className="text-sm text-gray-500">
                          Cost: ${item.costPricePerUnit.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold text-gray-900">
                          ${(item.costPricePerUnit * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.productId)}
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

        {/* Summary & Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Purchase Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span className="font-bold">Total Cost</span>
                  <span className="font-bold text-blue-600">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              {/* Paid Amount */}
              <div className="space-y-2">
                <Label htmlFor="paidAmount">Paid Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="paidAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="pl-7"
                  />
                </div>
                {paidAmount && parseFloat(paidAmount) < totalCost && (
                  <p className="text-xs text-orange-600">
                    Remaining: ${(totalCost - parseFloat(paidAmount)).toFixed(2)}
                  </p>
                )}
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleConfirmPurchase}
                  disabled={cart.length === 0}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Confirm Purchase
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleClearForm}
                  disabled={cart.length === 0}
                >
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Purchase History</h2>
        {purchases.map((purchase, index) => (
          <motion.div
            key={purchase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="cursor-pointer" onClick={() => togglePurchase(purchase.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{purchase.id}</CardTitle>
                      <Badge className={getStatusColor(purchase.status)}>
                        {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {purchase.supplierName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(purchase.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {purchase.items.length} items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Cost</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${purchase.totalCost.toFixed(2)}
                      </p>
                      <div className="flex gap-2 text-xs mt-1">
                        <span className="text-green-600">Paid: ${purchase.paidAmount.toFixed(2)}</span>
                        {purchase.remainingAmount > 0 && (
                          <span className="text-orange-600">Due: ${purchase.remainingAmount.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedPurchase === purchase.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedPurchase === purchase.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="border-t border-gray-100 pt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Purchase Items</h4>
                      <div className="space-y-2">
                        {purchase.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.productName}</p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div>
                                <span className="text-gray-600">Qty: </span>
                                <span className="font-semibold">{item.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Cost: </span>
                                <span className="font-semibold">
                                  ${item.costPricePerUnit.toFixed(2)}
                                </span>
                              </div>
                              <div className="w-24 text-right">
                                <span className="font-bold text-gray-900">
                                  ${item.totalCost.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex justify-end">
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-8 text-sm">
                            <span className="text-gray-600">Total Cost:</span>
                            <span className="font-bold text-blue-600">
                              ${purchase.totalCost.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-8 text-sm">
                            <span className="text-gray-600">Paid Amount:</span>
                            <span className="font-semibold text-green-600">
                              ${purchase.paidAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-8 text-sm pt-2 border-t border-gray-200">
                            <span className="font-bold">Remaining:</span>
                            <span className={`font-bold ${purchase.remainingAmount > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              ${purchase.remainingAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}

        {purchases.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No purchases recorded</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start recording your stock purchases above
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

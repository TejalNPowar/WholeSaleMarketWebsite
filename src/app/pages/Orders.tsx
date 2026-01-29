import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Calendar, User, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { mockOrders } from '@/app/data/mockData';

export function Orders() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">View and manage order history</p>
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
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{mockOrders.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
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
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockOrders.filter(o => o.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {mockOrders.filter(o => o.status === 'pending').length}
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

      {/* Orders List */}
      <div className="space-y-4">
        {mockOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="cursor-pointer" onClick={() => toggleOrder(order.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {order.customerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {order.items.length} items
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-bold text-blue-600">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedOrder === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="border-t border-gray-100 pt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                {item.product.category} • Barcode: {item.product.barcode}
                              </p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div>
                                <span className="text-gray-600">Qty: </span>
                                <span className="font-semibold">{item.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Price: </span>
                                <span className="font-semibold">
                                  ${item.product.price}/{item.product.unit}
                                </span>
                              </div>
                              <div className="w-24 text-right">
                                <span className="font-bold text-gray-900">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-200 flex justify-end">
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-8 text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-semibold">
                              ${(order.total / 1.18).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-8 text-sm">
                            <span className="text-gray-600">Tax (18%):</span>
                            <span className="font-semibold">
                              ${(order.total - order.total / 1.18).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-8 text-lg pt-2 border-t border-gray-200">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold text-blue-600">
                              ${order.total.toFixed(2)}
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
      </div>

      {mockOrders.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start creating orders in the billing section
          </p>
        </motion.div>
      )}
    </div>
  );
}

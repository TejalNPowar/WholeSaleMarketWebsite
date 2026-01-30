import { Outlet, Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Package, ShoppingCart, FileText, User, LogOut, ShoppingBag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { shopkeeperInfo } from '../data/mockData';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Products', icon: Package },
    { path: '/billing', label: 'Billing', icon: ShoppingCart },
    { path: '/orders', label: 'Orders', icon: FileText },
    { path: '/purchases', label: 'Purchases', icon: ShoppingBag },
  ];

  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">{shopkeeperInfo.businessName}</h1>
                <p className="text-xs text-gray-500">Wholesale Market</p>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className="gap-2"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {shopkeeperInfo.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{shopkeeperInfo.name}</span>
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Shopkeeper Details</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="px-2 py-3 space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-900">{shopkeeperInfo.name}</p>
                    <p className="text-gray-500 text-xs">{shopkeeperInfo.businessName}</p>
                  </div>
                  <div className="space-y-1 text-xs">
                    <p className="text-gray-600">📧 {shopkeeperInfo.email}</p>
                    <p className="text-gray-600">📱 {shopkeeperInfo.phone}</p>
                    <p className="text-gray-600">📍 {shopkeeperInfo.address}</p>
                    <p className="text-gray-600">🏢 GSTIN: {shopkeeperInfo.gstin}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-1 flex-col h-auto py-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
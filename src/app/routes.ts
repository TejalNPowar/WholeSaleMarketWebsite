import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Products } from './pages/Products';
import { Billing } from './pages/Billing';
import { Orders } from './pages/Orders';
import { Purchases } from './pages/Purchases';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Products },
      { path: 'billing', Component: Billing },
      { path: 'orders', Component: Orders },
      { path: 'purchases', Component: Purchases }
    ]
  }
]);
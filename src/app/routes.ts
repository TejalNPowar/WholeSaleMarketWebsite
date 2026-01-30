import { createBrowserRouter } from 'react-router';
import { Layout } from '@/app/components/Layout';
import { Products } from '@/app/pages/Products';
import { Billing } from '@/app/pages/Billing';
import { Orders } from '@/app/pages/Orders';
import { Purchases } from '@/app/pages/Purchases';

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
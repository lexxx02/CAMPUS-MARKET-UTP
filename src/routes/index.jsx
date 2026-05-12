import { createBrowserRouter } from 'react-router-dom';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import KiosksPage from '../pages/KiosksPage';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <StudentLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'kiosks', element: <KiosksPage /> },
    ],
  },
]);

export default router;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardOverview from './pages/DashboardOverview';
import ProductManager from './pages/ProductManager';
import CategoryManager from './pages/CategoryManager';
import FestivalManager from './pages/FestivalManager';
import OrderManager from './pages/OrderManager';
import DeliveryFleetManager from './pages/DeliveryFleetManager';
import SalesTeamManager from './pages/SalesTeamManager';
import UserManager from './pages/UserManager';
import DatabaseSeeder from './pages/DatabaseSeeder';
import AdminLogin from './pages/AdminLogin';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0B0F19]">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8">{children}</main>
    </div>
  );
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/"
            element={
              <ProtectedLayout>
                <DashboardOverview />
              </ProtectedLayout>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedLayout>
                <ProductManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedLayout>
                <CategoryManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/festivals"
            element={
              <ProtectedLayout>
                <FestivalManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedLayout>
                <OrderManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/delivery-fleet"
            element={
              <ProtectedLayout>
                <DeliveryFleetManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/sales-team"
            element={
              <ProtectedLayout>
                <SalesTeamManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedLayout>
                <UserManager />
              </ProtectedLayout>
            }
          />
          <Route
            path="/database"
            element={
              <ProtectedLayout>
                <DatabaseSeeder />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SalesAuthProvider, useSalesAuth } from './context/SalesAuthContext';
import SalesLogin from './pages/SalesLogin';
import SalesDashboard from './pages/SalesDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSalesAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <SalesAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SalesLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SalesDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </SalesAuthProvider>
  );
}

export default App;

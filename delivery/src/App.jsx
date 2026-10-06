import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DeliveryAuthProvider, useDeliveryAuth } from './context/DeliveryAuthContext';
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryLogin from './pages/DeliveryLogin';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useDeliveryAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <DeliveryAuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<DeliveryLogin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DeliveryDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </DeliveryAuthProvider>
  );
}

export default App;

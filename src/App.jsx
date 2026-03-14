import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import Ledger from './pages/Ledger';
import Layout from './components/Layout';

const PlaceholderPage = ({ title }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center text-gray-500">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p>This module is coming soon or yet to be implemented.</p>
  </div>
);

const PrivateRoute = ({ children }) => {
    const { user, loading } = React.useContext(AuthContext);
    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                    <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                    
                    <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
                    <Route path="/deliveries" element={<PrivateRoute><Deliveries /></PrivateRoute>} />
                    <Route path="/transfers" element={<PrivateRoute><Transfers /></PrivateRoute>} />
                    <Route path="/adjustments" element={<PrivateRoute><Adjustments /></PrivateRoute>} />
                    <Route path="/ledger" element={<PrivateRoute><Ledger /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

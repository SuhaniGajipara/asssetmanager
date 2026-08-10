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

import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import StockLevels from './pages/StockLevels';
import StockMovements from './pages/StockMovements';
import SalesOrders from './pages/SalesOrders';
import OrderDetails from './pages/OrderDetails';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseReceipts from './pages/PurchaseReceipts';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Users from './pages/Users';
import RolesPermissions from './pages/RolesPermissions';
import ReportsDashboard from './pages/ReportsDashboard';
import Support from './pages/Support';

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
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    {/* Private Routes */}
                    <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    
                    {/* INVENTORY */}
                    <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                    <Route path="/categories" element={<PrivateRoute><Categories /></PrivateRoute>} />
                    <Route path="/warehouses" element={<PrivateRoute><Warehouses /></PrivateRoute>} />
                    <Route path="/stock-levels" element={<PrivateRoute><StockLevels /></PrivateRoute>} />
                    <Route path="/stock-movements" element={<PrivateRoute><StockMovements /></PrivateRoute>} />
                    
                    {/* ORDERS */}
                    <Route path="/sales-orders" element={<PrivateRoute><SalesOrders /></PrivateRoute>} />
                    <Route path="/order-details" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />
                    
                    {/* PURCHASE */}
                    <Route path="/purchase-orders" element={<PrivateRoute><PurchaseOrders /></PrivateRoute>} />
                    <Route path="/purchase-receipts" element={<PrivateRoute><PurchaseReceipts /></PrivateRoute>} />
                    <Route path="/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
                    
                    {/* OPERATIONS */}
                    <Route path="/transfers" element={<PrivateRoute><Transfers /></PrivateRoute>} />
                    <Route path="/deliveries" element={<PrivateRoute><Deliveries /></PrivateRoute>} />
                    <Route path="/receipts" element={<PrivateRoute><Receipts /></PrivateRoute>} />
                    <Route path="/adjustments" element={<PrivateRoute><Adjustments /></PrivateRoute>} />
                    
                    {/* MANAGEMENT */}
                    <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
                    <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
                    <Route path="/roles-permissions" element={<PrivateRoute><RolesPermissions /></PrivateRoute>} />
                    
                    {/* REPORTS */}
                    <Route path="/reports" element={<PrivateRoute><ReportsDashboard /></PrivateRoute>} />
                    
                    {/* OTHER */}
                    <Route path="/ledger" element={<PrivateRoute><Ledger /></PrivateRoute>} />
                    <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
                    <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;

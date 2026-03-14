import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Mail, ArrowLeft, Send } from 'lucide-react';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('users/forgot-password/', { email });
            setSuccess(true);
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <div>
                    <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">Forgot Password?</h2>
                    <p className="mt-4 text-center text-sm text-gray-500 font-medium">
                        Enter your email and we'll send you a <br /> code to reset your password.
                    </p>
                </div>

                {success && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                         Reset code sent! Redirecting...
                    </div>
                )}

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                         <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                         {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-300" />
                            </div>
                            <input
                                type="email" required
                                className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                placeholder="name@company.com"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Reset Code'}
                        <Send size={18} />
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button onClick={() => navigate('/login')} className="text-gray-500 font-bold text-sm flex items-center justify-center gap-2 hover:text-gray-700 mx-auto">
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;

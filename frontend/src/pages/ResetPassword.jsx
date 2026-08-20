import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: location.state?.email || '',
        otp: '',
        new_password: '',
        confirm_password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.new_password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('users/reset-password/', {
                email: formData.email,
                otp: formData.otp,
                new_password: formData.new_password
            });
            alert('Password reset successful! Please login with your new password.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password. Check your code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-primary-container rounded-2xl flex items-center justify-center text-primary mb-4">
                        <ShieldCheck size={24} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Set New Password</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Verify your reset code and enter a new password.</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3">
                         <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                         {error}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Verification Code</label>
                        <input
                            name="otp" type="text" required
                            className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="6-digit code"
                            value={formData.otp} onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">New Password</label>
                        <input
                            name="new_password" type="password" required
                            className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.new_password} onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Confirm Password</label>
                        <input
                            name="confirm_password" type="password" required
                            className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.confirm_password} onChange={handleChange}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-on-primary bg-primary hover:brightness-110 active:brightness-95 shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;

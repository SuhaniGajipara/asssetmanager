import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

function Register() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        mobile_number: '',
        username: '',
        password: '',
        confirm_password: '',
        role: 'Warehouse Staff'
    });
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await signup(formData);
            // Redirect to verify-otp page with email as state
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (err) {
            console.error('Registration Error:', err.response?.data);
            const errorData = err.response?.data;
            
            if (err.response?.status === 500 || (typeof errorData === 'string' && errorData.includes('<html'))) {
                setError('Server configuration error (missing dependencies). Please try again in 1 minute.');
            } else if (errorData) {
                 const fields = Object.keys(errorData);
                 if (fields.length > 0) {
                     const firstError = errorData[fields[0]];
                     setError(Array.isArray(firstError) ? firstError[0] : firstError.toString());
                 } else {
                     setError('Registration failed. Please check your details.');
                 }
            } else {
                setError('Unable to connect to server. Ensure backend is running.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <div>
                    <div className="mx-auto h-12 w-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <CheckCircle2 className="text-white" size={24} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-500 font-medium">Join CoreInventory management system</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-shake">
                         <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                         {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    name="full_name" type="text" required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Enter Full Name"
                                    value={formData.full_name} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Username</label>
                                <input
                                    name="username" type="text" required
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Username"
                                    value={formData.username} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Mobile</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-300" />
                                    </div>
                                    <input
                                        name="mobile_number" type="text" required
                                        className="block w-full pl-9 pr-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                        placeholder="Mobile Number"
                                        value={formData.mobile_number} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-300" />
                                </div>
                                <input
                                    name="email" type="email" required
                                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Email Address"
                                    value={formData.email} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Password</label>
                                <input
                                    name="password" type="password" required
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Password"
                                    value={formData.password} onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-1 block">Confirm</label>
                                <input
                                    name="confirm_password" type="password" required
                                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                    placeholder="Confirm Password"
                                    value={formData.confirm_password} onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-on-primary bg-primary hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-xl shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500 font-medium">
                        Already have an account?{' '}
                        <button onClick={() => navigate('/login')} className="text-primary font-black hover:underline">
                            Log in
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;

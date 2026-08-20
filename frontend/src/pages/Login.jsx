import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-surface p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 font-black">CoreInventory Login</h2>
                {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-600 p-3 mb-6 rounded-xl text-sm font-bold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Email or Mobile Number</label>
                        <input 
                            className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-all outline-none"
                            type="text" 
                            placeholder="your@email.com or +12345678"
                            value={username} onChange={e => setUsername(e.target.value)} required 
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input 
                            className="bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-xl focus:ring-primary focus:border-primary block w-full p-3 transition-all outline-none"
                            type="password" 
                            placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} required 
                        />
                    </div>
                    <div className="pt-2">
                        <button className="bg-primary hover:brightness-110 active:brightness-95 text-on-primary font-black py-4 px-4 rounded-2xl shadow-md hover:shadow-lg focus:outline-none transition-all w-full flex items-center justify-center gap-2" type="submit">
                            Sign In
                        </button>
                    </div>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Don't have an account? <button onClick={() => navigate('/register')} className="text-primary font-black hover:underline">Create Account</button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;

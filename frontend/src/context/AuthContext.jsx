import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access');
            if (token) {
                try {
                    // Assuming there's a /me endpoint or we just use the stored user info
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        setUser({ token });
                    }
                } catch (err) {
                    console.error("Failed to restore session", err);
                    logout();
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (identifier, password) => {
        const res = await api.post('users/login/', { identifier, password });
        localStorage.setItem('access', res.data.token.access);
        localStorage.setItem('refresh', res.data.token.refresh);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
    };

    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
        setUser(null);
    };

    const signup = async (data) => {
        await api.post('users/signup/', data);
    };

    const verifyOTP = async (email, otp) => {
        await api.post('users/verify-otp/', { email, otp });
    };

    const resendOTP = async (email) => {
        await api.post('users/resend-otp/', { email });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, verifyOTP, resendOTP, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

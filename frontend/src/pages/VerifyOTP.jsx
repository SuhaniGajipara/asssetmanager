import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

function VerifyOTP() {
    const location = useLocation();
    const navigate = useNavigate();
    const { verifyOTP, resendOTP } = useContext(AuthContext);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(300); // 5 minutes
    const email = location.state?.email || '';

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [email, navigate]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.nextSibling && element.value !== '') {
            element.nextSibling.focus();
        }
    };

    const handleResend = async () => {
        setError('');
        setResendLoading(true);
        try {
            await resendOTP(email);
            setTimer(300);
            alert('New code sent successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to resend code');
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError('');
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(email, otpString);
            alert('Verification successful! Account created.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed. Invalid OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 text-center">
                <div>
                    <div className="mx-auto h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-black text-gray-900 tracking-tight">Verify Email</h2>
                    <p className="mt-2 text-center text-sm text-gray-500 font-medium">
                        We've sent a 6-digit code to <br />
                        <span className="text-gray-900 font-bold">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-3">
                         <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                         {error}
                    </div>
                )}

                <div className="mt-8">
                    <div className="flex justify-center gap-2 mb-8">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-12 h-14 bg-gray-50 border border-gray-200 text-gray-900 text-xl font-black rounded-xl text-center outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                value={data}
                                onChange={(e) => handleChange(e.target, index)}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>

                    <div className="mb-8">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Code expires in</p>
                        <p className={`text-xl font-black ${timer < 60 ? 'text-rose-500' : 'text-gray-900'}`}>
                            {formatTime(timer)}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || otp.join('').length !== 6}
                        onClick={handleSubmit}
                        className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-on-primary bg-primary hover:brightness-110 active:brightness-95 shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify Email'}
                        <ArrowRight size={18} />
                    </button>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <p className="text-sm text-gray-500 font-medium font-bold">Didn't receive code?</p>
                        <button 
                            onClick={handleResend}
                            disabled={resendLoading}
                            className="text-primary font-black text-sm flex items-center gap-1 hover:underline disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={resendLoading ? 'animate-spin' : ''} />
                            {resendLoading ? 'Sending...' : 'Resend Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VerifyOTP;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import ChatBot from '../components/ChatBot'; // Assuming ChatBot is a component that handles chat interactions

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { isLoading, forgotPassword, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
            toast.info("If an account with that email exists, a reset link has been sent.");
        } catch (err) {
            toast.error(error || "Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4">
            <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full"
            >
                <div className="gradient-card p-8 rounded-2xl shadow-2xl">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
                                <p className="text-gray-300">
                                    Enter your email to receive a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="spinner mr-2"></div>
                                            Sending Link...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className='text-center'>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className='w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4'
                            >
                                <Mail className='h-8 w-8 text-yellow-400' />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-white mb-2">Check your inbox</h3>
                            <p className='text-gray-300 mb-6'>
                                If an account exists for <span className="text-yellow-400 font-medium">{email}</span>, you will receive a password reset link shortly.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-sm text-yellow-400 hover:text-yellow-300 font-medium transition-colors flex items-center justify-center">
                            <ArrowLeft className='h-4 w-4 mr-2' />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
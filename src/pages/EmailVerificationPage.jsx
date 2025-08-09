import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { Shield, RefreshCw } from 'lucide-react';
import ChatBot from "../components/ChatBot";

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [timer, setTimer] = useState(60);
    const [resendLoading, setResendLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { error, isLoading, verifyEmail, user } = useAuthStore();

    // Timer for resend functionality
    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (index, value) => {
        const newCode = [...code];

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            pastedCode.forEach((char, i) => {
                newCode[i] = char;
            });
            setCode(newCode);
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex]?.focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            // Move focus to the next input field
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        if (verificationCode.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }
        try {
            const response = await verifyEmail(verificationCode);
            toast.success("Email verified successfully!");

            // Navigate to the next step based on user role
            if (response.user.role === 'student') {
                navigate('/subject-selection');
            } else {
                navigate('/domain-selection');
            }
        } catch (err) {
            toast.error(error || "Invalid or expired code. Please try again.");
        }
    };

    // Auto-submit when all fields are filled
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);

    const handleResend = async () => {
        if (timer > 0) return;
        setResendLoading(true);
        try {
            // TODO: Implement resend OTP logic in authStore
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('A new OTP has been sent!');
            setTimer(60);
        } catch (error) {
            toast.error('Failed to resend OTP.');
        } finally {
            setResendLoading(false);
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
                <div className="gradient-card p-8 rounded-2xl shadow-2xl text-center">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
                        <p className="text-gray-300">
                            We've sent a 6-digit code to your email.
                        </p>
                        {user?.email && <p className="text-yellow-400 font-medium">{user.email}</p>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-3">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-xl font-bold bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-colors"
                                />
                            ))}
                        </div>
                        
                        {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

                        <button
                            type="submit"
                            disabled={isLoading || code.join('').length !== 6}
                            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner mr-2"></div>
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center space-x-2">
                        <span className="text-gray-400">Didn't receive the code?</span>
                        {timer > 0 ? (
                            <span className="text-yellow-400 font-medium">
                                Resend in {timer}s
                            </span>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={resendLoading}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors flex items-center space-x-1"
                            >
                                {resendLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <span>Resend OTP</span>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;

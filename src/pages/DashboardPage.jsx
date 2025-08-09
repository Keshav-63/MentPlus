import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import ChatBot from "../components/ChatBot"; // Assuming ChatBot is a component that handles chat interactions

const DashboardPage = () => {
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4">
            <ChatBot /> {/* Assuming ChatBot is a component that handles chat interactions */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className='max-w-md w-full'
            >
                <div className="gradient-card p-8 rounded-2xl shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
                        <p className="text-gray-300">Welcome back, {user?.name || 'User'}</p>
                    </div>

                    <div className='space-y-6'>
                        <motion.div
                            className='glass p-6 rounded-xl'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className='text-xl font-semibold text-yellow-400 mb-3'>Profile Information</h3>
                            <p className='text-gray-300'>Name: {user.name}</p>
                            <p className='text-gray-300'>Email: {user.email}</p>
                        </motion.div>
                        <motion.div
                            className='glass p-6 rounded-xl'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className='text-xl font-semibold text-yellow-400 mb-3'>Account Activity</h3>
                            <p className='text-gray-300'>
                                <span className='font-medium'>Joined: </span>
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <p className='text-gray-300'>
                                <span className='font-medium'>Last Login: </span>
                                {formatDate(user.lastLogin)}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className='mt-8'
                    >
                        <button
                            onClick={handleLogout}
                            className='w-full btn-primary py-3 text-lg font-semibold'
                        >
                            Logout
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
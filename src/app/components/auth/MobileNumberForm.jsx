// src/app/components/auth/MobileNumberForm.jsx
'use client';

import { motion } from 'framer-motion';

// Define props interface (optional, but good practice)
// type MobileNumberFormProps = {
//     mobileNumber: string;
//     setMobileNumber: (value: string) => void;
//     handleSendOtp: (e: React.FormEvent) => Promise<void>;
//     loading: boolean;
//     error: string;
//     successMessage: string;
//     formVariants: any; // Framer Motion variants
// };

export default function MobileNumberForm({
    mobileNumber,
    setMobileNumber,
    handleSendOtp,
    loading,
    error,
    successMessage,
    formVariants, // Receive variants as prop
}) {
    return (
        <motion.form
            key="enter_number_form" // Unique key for AnimatePresence
            onSubmit={handleSendOtp}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Error and success messages */}
            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 text-sm text-red-400 text-center"
                >
                    {error}
                </motion.p>
            )}
            {successMessage && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 text-sm text-green-400 text-center"
                >
                    {successMessage}
                </motion.p>
            )}

            {/* Mobile Number Input */}
            <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-zinc-300 mb-2">
                    Mobile Number (with country code)
                </label>
                <input
                    type="text"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                    placeholder="e.g., +1234567890"
                />
                {/* Send OTP Button */}
                <button
                    type="submit"
                    disabled={loading || !/^\+\d{10,}$/.test(mobileNumber)} // Basic validation
                    className="mt-6 w-full px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Sending...' : 'Send OTP'}
                </button>
            </div>
        </motion.form>
    );
}
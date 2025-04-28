// src/app/components/auth/OtpVerificationForm.jsx
'use client';

import { motion } from 'framer-motion';

// Define props interface (optional)
// type OtpVerificationFormProps = {
//     mobileNumber: string;
//     otp: string;
//     setOtp: (value: string) => void;
//     name: string;
//     setName: (value: string) => void;
//     email: string;
//     setEmail: (value: string) => void;
//     handleVerifyOtp: (e: React.FormEvent) => Promise<void>;
//     onBackToMobileStep: () => void; // Handler to go back
//     loading: boolean;
//     error: string;
//     successMessage: string;
//     needsProfileCompletion: boolean; // To show/hide profile fields
//     formVariants: any; // Framer Motion variants
// };

export default function OtpVerificationForm({
    mobileNumber,
    otp,
    setOtp,
    name,
    setName,
    email,
    setEmail,
    handleVerifyOtp,
    onBackToMobileStep, // Receive handler from parent
    loading,
    error,
    successMessage,
    needsProfileCompletion,
    formVariants, // Receive variants as prop
}) {
    return (
        <motion.form
            key="enter_otp_form" // Unique key for AnimatePresence
            onSubmit={handleVerifyOtp}
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Error and success messages */}
             {error && (
                  <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
                )}
                 {successMessage && (
                  <p className="mb-4 text-sm text-green-400 text-center">{successMessage}</p>
                )}

            {/* Info text */}
            <p className="text-sm text-zinc-400 mb-4 text-center">
                Enter the OTP sent to <strong className="text-white">{mobileNumber}</strong>.
            </p>
            {needsProfileCompletion && (
                <p className="text-sm text-yellow-400 mb-4 text-center">
                    Please also provide your name and email to complete your profile.
                </p>
            )}

            {/* OTP Input */}
            <div className="mb-4">
                <label htmlFor="otp" className="block text-sm font-medium text-zinc-300 mb-2">
                    OTP Code
                </label>
                <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                    placeholder="e.g., 123456"
                />
            </div>

            {/* Conditionally rendered Fields for Name and Email */}
            {needsProfileCompletion && (
                <>
                    {/* Name Input */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                            What may we call you?
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required={needsProfileCompletion} // Make required only if showing
                            disabled={loading}
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading}
                            placeholder="your.email@example.com"
                        />
                    </div>
                </>
            )}

            {/* Verify & Sign In Button */}
            <button
                type="submit"
                // Adjusted validation based on needsProfileCompletion
                disabled={loading || otp.length < 4 || (needsProfileCompletion && name.trim().length < 2) || (email && !/\S+@\S+\.\S+/.test(email))}
                className="mt-4 w-full px-4 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
            </button>

            {/* Option to go back and resend */}
            <button
                type="button"
                onClick={onBackToMobileStep} // Use the passed handler
                disabled={loading}
                className="mt-3 w-full text-center text-sm text-zinc-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Resend OTP / Change Number
            </button>
        </motion.form>
    );
}
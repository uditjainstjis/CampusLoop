// src/app/signin/page.jsx
'use client';

import { useState, useEffect } from 'react'; // Import useEffect
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SigninPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  // Input states for name and email (user can type here)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // --- New states to store existing name/email from DB and control form fields ---
  const [existingName, setExistingName] = useState(''); // Stores name received from backend
  const [existingEmail, setExistingEmail] = useState(''); // Stores email received from backend
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false); // Flag to show/hide name/email fields
  // -----------------------------------------------------------------------------

  const [step, setStep] = useState('enter_number');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();

  const formVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // --- Effect to pre-fill name/email inputs and set needsProfileCompletion flag ---
  useEffect(() => {
      // If we have an existing name (meaning user profile exists with a name),
      // set the input states and indicate profile completion is not needed.
      if (existingName) {
          setName(existingName); // Pre-fill the name input
          setEmail(existingEmail || ''); // Pre-fill email input (use empty string if null)
          setNeedsProfileCompletion(false); // User doesn't need to complete profile (at least name exists)
      } else {
          // If no existing name, clear input states and indicate profile completion is needed.
          setName(''); // Ensure input is empty for new users
          setEmail('');
          setNeedsProfileCompletion(true); // User needs to provide name (and optional email)
      }
  }, [existingName, existingEmail]); // Depend on the received existingName/Email


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    // Clear previous existing profile info when sending new OTP
    setExistingName('');
    setExistingEmail('');


    const mobileRegex = /^\+\d{10,15}$/;
    if (!mobileRegex.test(mobileNumber)) {
         setError('Invalid mobile number format. Please include country code (e.g., +1234567890).');
         setLoading(false);
         return;
    }

    try {
      const response = await fetch('/api/user/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const responseBodyText = await response.text();

      if (response.ok) {
        try {
            const data = JSON.parse(responseBodyText);
            setStep('enter_otp');
            setSuccessMessage(data.message || 'OTP sent successfully! Check your WhatsApp.');
            // --- Capture and store existing name/email from the response ---
            setExistingName(data.name);
            setExistingEmail(data.email);
            // The useEffect will then run based on setExistingName
            // -------------------------------------------------------------

        } catch (jsonParseError) {
            console.error("Failed to parse success response as JSON:", jsonParseError, "Body:", responseBodyText);
            setError('Received unexpected success response from server.');
        }

      } else {
        let errorMessage = 'Failed to send OTP. Please try again.';
        try {
          const data = JSON.parse(responseBodyText);
          errorMessage = data.error || errorMessage;
        } catch (jsonParseError) {
          console.error("Failed to parse error response as JSON:", jsonParseError, "Body:", responseBodyText);
          errorMessage = responseBodyText || errorMessage;
        }
        setError(errorMessage);
      }

    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
     e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear success message

    // Validation logic:
    // OTP is always required.
    // Name is required ONLY if needsProfileCompletion is true.
    if (otp.length < 4) {
         setError('Please enter the OTP code.');
         setLoading(false);
         return;
    }
    if (needsProfileCompletion && name.trim().length < 2) {
        setError('Please enter your Name.');
        setLoading(false);
        return;
    }
     // Optional: Basic email format validation if email is entered
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
    }


    // Call Next-Auth's signIn with credentials
    // Always pass the current values from the input states
    const result = await signIn('credentials', {
      mobileNumber, // From step 1 state
      otp,          // From step 2 input
      name: name.trim(), // Pass the potentially new/updated name from input
      email: email.trim() || null, // Pass the potentially new/updated email from input
      redirect: false,
    });

    if (result?.ok) {
      router.push(result.url || '/');
    } else {
      setError(result?.error || 'Verification failed. Invalid OTP or details.');
    }

    setLoading(false);
  };


  // ... rest of the component code (JSX) ...
   return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.3 }}
         className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {step === 'enter_number' ? 'Sign In or Sign Up' : 'Verify and Sign In'} {/* Adjusted title */}
        </h1>

         <AnimatePresence mode="wait">
           {step === 'enter_number' && (
             <motion.form
                 key="enter_number_form"
                 onSubmit={handleSendOtp}
                 variants={formVariants}
                 initial="hidden"
                 animate="visible"
                 exit="exit"
             >
                {error && (
                  <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
                )}
                 {successMessage && (
                  <p className="mb-4 text-sm text-green-400 text-center">{successMessage}</p>
                )}
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
                 <button
                   type="submit"
                   disabled={loading || !/^\+\d{10,}$/.test(mobileNumber)}
                   className="mt-6 w-full px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? 'Sending...' : 'Send OTP'}
                 </button>
               </div>
             </motion.form>
           )}

           {step === 'enter_otp' && (
             <motion.form
                 key="enter_otp_form"
                 onSubmit={handleVerifyOtp}
                 variants={formVariants}
                 initial="hidden"
                 animate="visible"
                 exit="exit"
             >
                {error && (
                  <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
                )}
                 {successMessage && (
                  <p className="mb-4 text-sm text-green-400 text-center">{successMessage}</p>
                )}
                <p className="text-sm text-zinc-400 mb-4 text-center">
                  Enter the OTP sent to <strong className="text-white">{mobileNumber}</strong>.
                </p>
                 {/* Optional message indicating if name/email are needed */}
                {needsProfileCompletion && (
                    <p className="text-sm text-yellow-400 mb-4 text-center">
                        Please also provide your name and email to complete your profile.
                    </p>
                )}

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

                 {/* --- Conditionally rendered Fields for Name and Email --- */}
                {needsProfileCompletion && (
                    <>
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
                 {/* --- End Conditionally rendered Fields --- */}


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
                  onClick={() => {
                      setStep('enter_number');
                      setOtp('');
                      // Optionally clear name/email, keeping them might be better UX if they decide not to complete
                      // setName('');
                      // setEmail('');
                      setError('');
                      setSuccessMessage('');
                  }}
                  disabled={loading}
                  className="mt-3 w-full text-center text-sm text-zinc-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  Resend OTP / Change Number
               </button>
             </motion.form>
           )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
// src/app/signin/page.jsx
'use client';

import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// --- Import the new form components ---
import MobileNumberForm from '../components/auth/MobileNumberForm';
import OtpVerificationForm from '../components/auth/OtpVerificationForm';
// --------------------------------------

export default function SigninPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // --- State for the form data ---
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // -------------------------------

  // --- State for backend response data and form control ---
  const [existingName, setExistingName] = useState('');
  const [existingEmail, setExistingEmail] = useState('');
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState(false);
  const [step, setStep] = useState('enter_number'); // 'enter_number' or 'enter_otp'
  // --------------------------------------------------------

  // --- State for UI feedback ---
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // -----------------------------

  const formVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };

  // --- Effect to redirect if already authenticated ---
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/mentors'); // Redirect to /mentors if logged in
    }
  }, [status, router]);

  // --- Effect to pre-fill name/email inputs and set needsProfileCompletion flag ---
  useEffect(() => {
      if (existingName) {
          setName(existingName);
          setEmail(existingEmail || '');
          setNeedsProfileCompletion(false);
      } else {
          setName('');
          setEmail('');
          setNeedsProfileCompletion(true);
      }
  }, [existingName, existingEmail]);

  // --- Handlers (wrapped in useCallback as they will be passed as props) ---

  const handleSendOtp = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');
    setExistingName(''); // Clear existing info on new send attempt
    setExistingEmail('');


    const mobileRegex = /^\+\d{10,15}$/;
    if (!mobileRegex.test(mobileNumber)) {
         setError('Invalid mobile number format. Please include country code (e.g., +1234567890).');
         setLoading(false);
         return;
    }

    try {
      const response = await fetch('/api/user/send-otp', { // Corrected URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });

      const responseBodyText = await response.text();

      if (response.ok) {
        try {
            const data = JSON.parse(responseBodyText);
            setStep('enter_otp'); // Move to step 2
            setSuccessMessage(data.message || 'OTP sent successfully! Check your WhatsApp.');
            // Capture and store existing name/email from the response
            setExistingName(data.name);
            setExistingEmail(data.email);
            // useEffect will handle setting needsProfileCompletion and pre-filling inputs
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
  }, [loading, mobileNumber]); // Dependencies for useCallback

  const handleVerifyOtp = useCallback(async (e) => {
     e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccessMessage(''); // Clear success message

    // Validation logic:
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


    const result = await signIn('credentials', {
      mobileNumber,
      otp,
      name: name.trim(),
      email: email.trim() || null,
      redirect: false,
    });

    if (result?.ok) {
      router.push(result.url || '/mentors'); // Redirect to /mentors on successful login
    } else {
      setError(result?.error || 'Verification failed. Invalid OTP or details.');
    }

    setLoading(false);
  }, [loading, mobileNumber, otp, name, email, needsProfileCompletion, router]); // Dependencies for useCallback

  // Handler to go back from OTP step to Mobile Number step
  const handleBackToMobileStep = useCallback(() => {
    setStep('enter_number');
    setOtp(''); // Clear OTP when going back
    setError(''); // Clear errors
    setSuccessMessage(''); // Clear success
    // Decide if you want to clear name/email here, keeping might be better UX
    // setName('');
    // setEmail('');
  }, []); // No dependencies needed if not using external state

  // --- End Handlers ---


  // Render loading state or redirect if authenticated
  if (status === 'loading' || status === 'authenticated') {
      return (
           <div className="min-h-screen flex items-center justify-center bg-zinc-900">
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.5 }}
                   className="text-white text-xl"
                >
                   Checking authentication status...
                </motion.div>
            </div>
      );
  }

  // If status is 'unauthenticated', render the sign-in form container
   return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         exit={{ opacity: 0, scale: 0.95 }}
         transition={{ duration: 0.3 }}
         className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {step === 'enter_number' ? 'Sign In or Sign Up' : 'Verify and Sign In'}
        </h1>

         {/* AnimatePresence to animate transition between the two forms */}
         <AnimatePresence mode="wait">
           {/* Render the appropriate form component based on the current step */}
           {step === 'enter_number' && (
             <MobileNumberForm
                mobileNumber={mobileNumber}
                setMobileNumber={setMobileNumber}
                handleSendOtp={handleSendOtp}
                loading={loading}
                error={error}
                successMessage={successMessage}
                formVariants={formVariants}
             />
           )}

           {step === 'enter_otp' && (
             <OtpVerificationForm
                mobileNumber={mobileNumber} // Pass for display
                otp={otp}
                setOtp={setOtp}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                handleVerifyOtp={handleVerifyOtp}
                onBackToMobileStep={handleBackToMobileStep} // Pass the handler
                loading={loading}
                error={error}
                successMessage={successMessage}
                needsProfileCompletion={needsProfileCompletion}
                formVariants={formVariants}
             />
           )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
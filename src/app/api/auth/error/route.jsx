// src/app/auth/error/page.jsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error'); // Get the 'error' query parameter

  // Map Next-Auth error codes to user-friendly messages
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        // This error might happen if authorize throws a generic error,
        // or if the provider configuration is wrong.
        // We are throwing specific errors from `authorize`, so ideally
        // the message comes directly from the query param.
        return error || 'Authentication failed. Please check your details.'; // Fallback
      case 'SessionRequired':
        return 'Please sign in to access this page.';
      case 'OAuthSignin': // If you added other providers later
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
      case 'EmailSignin':
      case 'EmailCreateAccount':
      case 'CallbackRouteError':
      case 'Verification':
      case 'Default':
      default:
        // Use the error query param message first, then a generic fallback
        return error || 'An unexpected authentication error occurred.';
    }
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Authentication Error</h1>
        {/* Display the actual error message from the query param */}
        <p className="text-zinc-300 mb-6">{errorMessage}</p>
        <Link
          href="/signin" // Link back to your sign-in page
          className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          Try Sign In Again
        </Link>
      </div>
    </div>
  );
}
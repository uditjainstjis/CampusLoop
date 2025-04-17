"use client"
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { LogOut, CheckCircle } from "lucide-react";
import Image from 'next/image'

export default function SignInPage() {
  const { data: session, status } = useSession();
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSignIn = (e) => {
    e.preventDefault();
    
    if (agreed) {
      setIsLoading(true);
      signIn('google');
    } else {
      // Modern toast-like notification instead of alert
      const notification = document.getElementById('notification');
      notification.classList.remove('opacity-0', 'translate-y-2');
      notification.classList.add('opacity-100', 'translate-y-0');
      
      setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-y-2');
        notification.classList.remove('opacity-100', 'translate-y-0');
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div id="notification" className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg transition-all duration-300 transform opacity-0 translate-y-2">
        Please agree to the Privacy Policy to continue.
      </div>
      
      <div className="max-w-md w-full overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300">
        {/* Top wave decoration */}
        <div className="h-20  w-full relative">
          <div className="absolute -bottom-1 left-0 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-12">
              <path fill="#ffffff" fillOpacity="1" d="M0,128L48,117.3C96,107,192,85,288,90.7C384,96,480,128,576,133.3C672,139,768,117,864,101.3C960,85,1056,75,1152,80C1248,85,1344,107,1392,117.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </div>
        
        <div className="px-8 py-8">
          {/* Enhanced Logo Section */}
          <div className="flex justify-center -mt-16 mb-6 relative z-10">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="rounded-full bg-white p-3 shadow-xl border-4 border-white relative transform transition-all duration-300 group-hover:scale-105">
                <div className="overflow-hidden rounded-full h-28 w-28 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 ring-4 ring-blue-100">
                  <div className="relative w-20 h-20 transform group-hover:rotate-6 transition-all duration-500">
                    <Image 
                      className="object-contain"
                      alt="CampusLoop Logo" 
                      fill
                      sizes="(max-width: 768px) 80px, 80px"
                      src='/logo.png'
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Campus<span className="text-yellow-500">Loop</span>
          </h2>
          
          <p className="text-center text-gray-500 text-sm mb-8">
            {session ? `Signed in as ${session.user.email}` : "Connect with people facing similar challenges nearby."}
          </p>

          {!session && (
            <form onSubmit={handleSignIn} className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  agreed 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {/* Google Logo */}
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Sign in with Google
                  </>
                )}
              </button>

              <div className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="privacyCheckbox"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="privacyCheckbox" className="text-sm text-gray-500">
                    I agree to the{" "}
                    <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:text-blue-800 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </form>
          )}

          {session && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 py-2 px-4 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5" />
                <span>Successfully signed in!</span>
              </div>
              
              <button 
                onClick={() => signOut()} 
                className="w-full py-3 px-4 rounded-xl flex items-center justify-center bg-red-500 hover:bg-red-600 text-white transition-all duration-300 shadow-lg"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center text-xs text-gray-400 pb-6">
          © {new Date().getFullYear()} CampusLoop. All rights reserved.
        </div>
      </div>
    </div>
  );
}
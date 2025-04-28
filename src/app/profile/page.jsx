// src/app/profile/page.jsx
'use client'; // This page needs to be a client component to use useSession

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // For redirection
import { useEffect } from 'react'; // For managing side effects like redirection
import Link from 'next/link'; // If you add links later
import { motion } from 'framer-motion'; // Assuming you use framer-motion

export default function ProfilePage() {
    // Get session data and status
    const { data: session, status } = useSession();
    const router = useRouter();

    // Effect to handle redirection if user is not authenticated
    useEffect(() => {
        if (status === 'unauthenticated') {
            // Redirect to the sign-in page.
            // We can add a 'callbackUrl' so they are redirected back here after signing in.
            router.push('/signin?callbackUrl=/profile');
        }
    }, [status, router]); // Depend on status and router objects

    // Show a loading state while session is being fetched
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900">
                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 0.5 }}
                   className="text-white text-xl"
                >
                   Loading session...
                </motion.div>
            </div>
        );
    }

    // If authenticated, display the user's profile information
    // We also check for session?.user just to be safe, though status 'authenticated' implies it exists
    if (status === 'authenticated' && session?.user) {
        const user = session.user; // Access the user object from the session

        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-900 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-zinc-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white" // Use a dark background for content box
                >
                    <h1 className="text-2xl font-bold text-purple-400 mb-6 text-center"> {/* Example purple heading */}
                        Your Profile
                    </h1>

                    {/* Profile fields */}
                    <div className="space-y-4">
                        {/* Display Name */}
                        {user.name && ( // Only display if name exists
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Name:</p> {/* Muted label */}
                                <p className="text-lg font-semibold">{user.name}</p> {/* White text for value */}
                            </div>
                        )}

                         {/* Display Mobile Number - Should always be present in your flow */}
                        {user.mobileNumber && (
                             <div>
                                 <p className="text-sm font-medium text-zinc-400">Mobile Number:</p>
                                 <p className="text-lg font-semibold">{user.mobileNumber}</p>
                             </div>
                        )}

                         {/* Display Email - Optional, only show if available */}
                        {user.email && (
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Email:</p>
                                <p className="text-lg font-semibold">{user.email}</p>
                            </div>
                        )}

                        {/* Optional: Display Image if available from the session user object */}
                        {user.image && (
                            <div>
                                <p className="text-sm font-medium text-zinc-400">Profile Image:</p>
                                {/* You might use your Avatar component here if you have one */}
                                <img
                                  src={user.image}
                                  alt={user.name || 'Profile'}
                                  className="w-20 h-20 rounded-full mt-2 ring-2 ring-purple-400" // Example purple ring
                                />
                            </div>
                        )}

                        {/* Add other profile fields from session.user as needed */}

                    </div>

                     {/* Optional: Link to edit profile or other actions */}
                     {/* <div className="mt-8 text-center">
                         <Link href="/profile/edit" className="text-purple-400 hover:underline">
                             Edit Profile
                         </Link>
                     </div> */}
                </motion.div>
            </div>
        );
    }

    // If status is 'unauthenticated', the useEffect should redirect.
    // If status is 'authenticated' but session or session.user is unexpectedly null,
    // this fallback might render briefly.
     return null; // Or you could render a generic "Access Denied" message if preferred
}
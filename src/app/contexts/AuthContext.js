import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const isLoading = status === 'loading';

  // Update user state when session changes
  useEffect(() => {
    if (session?.user) {
      setUser({
        ...session.user,
        isLoggedIn: true,
        role: session.user.role || 'user',
      });
    } else {
      setUser({
        isLoggedIn: false,
        role: null,
      });
    }
  }, [session]);

  const login = async (provider = 'google', callbackUrl = '/') => {
    await signIn(provider, { callbackUrl });
  };

  const logout = async (callbackUrl = '/') => {
    await signOut({ callbackUrl });
  };

  const checkAuthAndRedirect = (requiredRole) => {
    if (isLoading) return false;

    if (!user?.isLoggedIn) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return false;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/unauthorized');
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        checkAuthAndRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
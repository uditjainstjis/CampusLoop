// /Users/uditjain/Desktop/menti/src/app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb'; // Ensure this path is correct
// import dbConnect from '../../../lib/mongodb'; // Mongoose connection might not be needed here anymore unless used elsewhere
import User from '../../../models/User'; // Still needed for JWT/Session callbacks if adding custom fields like role

// Define Auth Options Object
const authOptions = {
  adapter: MongoDBAdapter(clientPromise), // Use the adapter
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt', // Keep JWT strategy to customize token/session
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    // signIn callback is often not needed when using an adapter,
    // unless you want to implement specific logic like blocking certain users.
    // async signIn({ user, account, profile, email, credentials }) {
    //   const isAllowedToSignIn = true
    //   if (isAllowedToSignIn) {
    //     return true
    //   } else {
    //     // Return false to display a default error message
    //     return false
    //     // Or you can return a URL to redirect to:
    //     // return '/unauthorized'
    //   }
    // },

    async jwt({ token, user, account, profile }) {
      // The user object passed here on initial sign-in comes from the adapter.
      // It might already contain the user ID.
      if (user) {
        token.id = user.id; // The adapter usually provides user.id
        // Fetch custom fields like 'role' if they aren't added by the adapter
        // Note: This requires your adapter's user schema to align or your User model to be queryable
        try {
            // Use the user ID provided by the adapter/session user object
            const dbUser = await User.findById(user.id); 
            if (dbUser) {
                token.role = dbUser.role; // Add role from your custom User model
            } else {
                // Handle case where user exists in adapter DB but maybe not Mongoose model? (unlikely if using same DB)
                console.warn(`User ${user.id} not found in custom User collection for role lookup.`);
            }
        } catch (error) {
            console.error('Error retrieving user role for JWT:', error);
        }
      }
      return token;
    },

    async session({ session, token, user }) {
      // Add custom properties from the token to the session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      // The 'user' object here is the session user, potentially enriched by the adapter
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

// Export named handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


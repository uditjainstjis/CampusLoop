import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '../../../lib/mongodb';
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User';

// Connect to mongoose
dbConnect();

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
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
    async signIn({ user, account, profile }) {
      // Create or update the user in our custom model
      if (account.provider === 'google') {
        try {
          // First, try to find the user
          const existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // Update the user's information if they exist
            existingUser.name = user.name;
            existingUser.image = user.image;
            existingUser.provider = account.provider;
            existingUser.googleId = profile.sub;
            await existingUser.save();
          } else {
            // Create a new user if they don't exist
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: user.emailVerified,
              provider: account.provider,
              googleId: profile.sub,
            });
          }
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return true; // Still allow sign in even if our custom logic fails
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // Add role to the token right after sign in
      if (account && user) {
        try {
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role;
            token.id = dbUser._id.toString();
          }
        } catch (error) {
          console.error('Error retrieving user role:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add role and id to the session
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
});
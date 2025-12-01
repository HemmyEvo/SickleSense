// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

// Helper to get backend URL
const getBackendUrl = () => process.env.BACKEND_URL || "http://127.0.0.1:5000";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const backendUrl = getBackendUrl();
          console.log(`Connecting to Auth Backend: ${backendUrl}/api/auth/login`);

          const res = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          // If Flask returns an error or bad status
          if (!res.ok || !user) {
            console.error("Auth Failed:", user.error);
            // You can throw an error here to display a specific message to the client
            throw new Error(user.error || "Invalid credentials");
          }

          // Return the object that NextAuth will persist
          // Mapping Flask response to NextAuth User object
          return {
            id: user.user.id, // Ensure your Flask user dict has 'id'
            email: user.user.email,
            name: user.user.name,
            role: user.user.role,
            access_token: user.access_token, // The Flask JWT
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 1. JWT Callback: Called whenever a token is created or updated
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // This runs only on initial login
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.access_token as string;
      }
      
      // Handle session updates (e.g. changing name/profile)
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    // 2. Session Callback: Called whenever the client checks the session
    async session({ session, token }) {
      // Pass data from the token to the client session
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.accessToken = token.accessToken; // Now available on client
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },
});
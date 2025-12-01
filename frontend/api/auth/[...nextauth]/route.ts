import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ NextAuth: Missing credentials");
          return null;
        }

        try {
          console.log("🔄 NextAuth: Attempting login for", credentials.email);
          
          // Ensure this URL matches your Flask backend address
          const res = await fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          const data = await res.json();
          
          console.log("🔍 NextAuth: Backend Response Status:", res.status);
          console.log("🔍 NextAuth: Backend Data:", data);

          if (res.ok && data.access_token) {
            console.log("✅ NextAuth: Login successful");
            return {
              id: String(data.user.id),
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              access_token: data.access_token,
            };
          }

          console.log("⚠️ NextAuth: Login failed (Invalid response or status)");
          return null;
        } catch (e) {
          console.error("❌ NextAuth Error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.access_token;
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: '/login', // Optional: Redirect back to login page on error instead of generic error page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
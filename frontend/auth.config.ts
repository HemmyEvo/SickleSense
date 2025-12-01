import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', 
    newUser: '/signup',
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authorized({ auth, request: { nextUrl } }: { auth: any; request: any }) {
      const isLoggedIn = !!auth?.user;
      
      // Define paths that require authentication
      const protectedPaths = [
        /\/dashboard(\/.*)?/,
      ];

      const isProtected = protectedPaths.some((p) => p.test(nextUrl.pathname));

      if (isProtected && !isLoggedIn) {
        return false;
      }
      
      // If logged in and on login/signup page, redirect to dashboard
      if (isLoggedIn && (nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup'))) {
         return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers are configured in auth.ts
} satisfies NextAuthConfig;
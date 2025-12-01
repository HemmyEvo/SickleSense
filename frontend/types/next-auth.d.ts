// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      accessToken: string; // To store the Flask JWT
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    access_token?: string; // This comes from your Flask API response
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
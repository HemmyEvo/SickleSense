// app/layout.tsx
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/shared/Header";
import Footer from "@/components/shared/Footer";
import CheckInManager from "@/components/shared/CheckInManager";
import { getServerSession } from "next-auth";
import { Providers } from "@/components/shared/Provider";
import { authOptions } from "@/api/auth/[...nextauth]/route";
 // Import your auth config

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sickle Sense",
  description: "Sickle Sense is a modern digital platform built to empower sickle cell patients.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch the session on the server
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        {/* 2. Wrap everything in the Client-Side Providers */}
        <Providers session={session}>
          <CheckInManager />
          
       
          <Header user={session?.user} />
          
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
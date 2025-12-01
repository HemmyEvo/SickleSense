import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/shared/Header";
import Footer from "@/components/shared/Footer";
import CheckInManager from "@/components/shared/CheckInManager";
import { Providers } from "@/components/shared/Provider";

// 1. Import the 'auth' helper from your auth.ts file
// Adjust the path if auth.ts is in 'src/auth.ts' or just 'auth.ts'
import { auth } from "@/auth"; 

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
  // 2. Fetch the session using the new v5 auth() helper
  const session = await auth();

  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        {/* 3. Pass the session to your client-side providers */}
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
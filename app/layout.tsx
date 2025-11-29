import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "../components/shared/Header";
import Footer from "@/components/shared/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sickle Sense",
  description:
    "Sickle Sense is a modern digital platform built to empower sickle cell patients, caregivers, and healthcare professionals. It provides personalized health insights, crisis tracking tools, educational resources, and a supportive community environment to help users better understand, manage, and navigate daily life with sickle cell disease. Our mission is to make care easier, improve communication, and enhance the overall well-being of everyone affected by sickle cell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    role: "patient" as "patient" | "caregiver" | "healthcare",
  };

  return (
    <html lang="en" className="dark">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header user={user} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
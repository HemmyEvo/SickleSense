/* eslint-disable @typescript-eslint/no-explicit-any */
// components/layout/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '../ui/theme-button';





export default function Header({ user }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="bg-white dark:bg-black shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              
              <span className="text-xl font-extrabold ">
                SickleSense
              </span>
            </Link>
          </div>

          {/* Navigation based on auth state */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              // Authenticated user navigation
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith('/dashboard') 
                      ? 'text-[#8200CD] font-semibold' 
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/health-trends" 
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith('/health-trends') 
                      ? 'text-[#8200CD] font-semibold' 
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  Health Trends
                </Link>
                <Link 
                  href="/tips" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/tips' 
                      ? 'text-[#8200CD] font-semibold' 
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  Health Tips
                </Link>
              </>
            ) : (
              // Public navigation
              <>
                <Link 
                  href="/how-it-works" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/how-it-works' 
                      ? 'text-[#8200CD] font-semibold' 
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  How It Works
                </Link>
                <Link 
                  href="/tips" 
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/tips' 
                      ? 'text-[#8200CD] font-semibold' 
                      : 'text-primary hover:text-primary/80'
                  }`}
                >
                  Health Tips
                </Link>
              </>
            )}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {/* Emergency Button - Always Visible */}
            <Link 
              href="/emergency/help" 
              className="bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors flex items-center space-x-2 border border-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Emergency</span>
            </Link>

            {!user && (
              // Auth buttons for non-authenticated users
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/signup" 
                  className="bg-primary text-secondary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/80 transition-colors border border-white"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
                <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md cursor-pointer dark:text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-600"
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>
                </div>
                </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-4">
              {user ? (
                // Authenticated mobile menu
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/health-trends" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Health Trends
                  </Link>
                  <Link 
                    href="/tips" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Health Tips
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        // Handle logout
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-base font-medium text-primary hover:text-primary/80 py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                // Public mobile menu
                <>
                  <Link 
                    href="/how-it-works" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="/tips" 
                    className="text-base font-medium text-primary hover:text-primary/80 py-2 border-b border-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Health Tips
                  </Link>
                  <div className="pt-4 border-t border-gray-700 space-y-3">
                    <Link 
                      href="/login" 
                      className="block text-base font-medium text-primary hover:text-primary/80 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="block bg-white text-gray-900 px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 text-center border border-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
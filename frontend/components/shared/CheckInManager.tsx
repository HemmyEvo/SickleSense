/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CheckInManager() {
  const router = useRouter();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [countdown, setCountdown] = useState(120); // 2 minutes
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. Service Worker & Notification Logic ---

  useEffect(() => {
    // Register Service Worker on Mount
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(swReg) {
          console.log('Service Worker is registered', swReg);
        })
        .catch(function(error) {
          console.error('Service Worker Error', error);
        });

      // Listen for messages from SW (when notification is clicked)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'OPEN_CHECKIN_MODAL') {
          setShowCheckInModal(true);
          setCountdown(120);
        }
      });
    }
  }, []);

  const playAlertSound = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
      const audio = new Audio('/notification.mp3'); 
      audio.play().catch(() => {}); 
    } catch (e) {
      console.log('Audio play failed', e);
    }
  };

  const triggerCheckIn = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Visual / Audio triggers
    playAlertSound();
    setShowCheckInModal(true);
    setCountdown(120);

    // Trigger Service Worker Notification
    // This works better on Mobile/Background than new Notification()
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // We manually trigger the 'showNotification' method on the registration
        // This simulates a push if we don't have a backend server running
        registration.showNotification('👋 Sickle Sense Check-in', {
          body: 'How are you feeling right now? Tap to respond.',
          icon: '/icon.png',
          vibrate: [200, 100, 200],
          tag: 'check-in',
          requireInteraction: true,
          data: { url: window.location.href }
        } as any); // Cast to any to fix TS error regarding 'vibrate'
      } catch (e) {
        console.error("SW Notification failed", e);
      }
    }
  };

  const scheduleNextCheckIn = useCallback(() => {
    // Set for 2 minutes from now
    const twoMinutesFromNow = Date.now() + (2 * 60 * 1000);
    
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const diff = Math.ceil((twoMinutesFromNow - now) / 1000);

      if (diff <= 0) {
        triggerCheckIn();
      }
    }, 1000);
  }, []);

  // --- 2. Action Handlers ---

  const handlePermissionResponse = async (granted: boolean) => {
    setShowPermissionModal(false);
    
    if (granted) {
      sessionStorage.setItem('sickleSense_notif_permission', 'granted');
      
      // Request Browser Permission
      if ('Notification' in window) {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          // Optional: Here you would usually subscribe the user to your backend
          // const registration = await navigator.serviceWorker.ready;
          // const subscription = await registration.pushManager.subscribe(...)
        }
      }
      
      scheduleNextCheckIn();
    } else {
      sessionStorage.setItem('sickleSense_notif_permission', 'denied');
    }
  };

  const handleImOk = () => {
    setShowCheckInModal(false);
    // Restart the 2 minute timer
    scheduleNextCheckIn();
  };

  const handleNeedHelp = () => {
    setShowCheckInModal(false);
    router.push('/emergency/help?fromNotification=true');
  };

  // --- 3. Lifecycle Effects ---

  useEffect(() => {
    // Check Permission on Mount
    const storedPermission = sessionStorage.getItem('sickleSense_notif_permission');

    if (!storedPermission) {
      const timer = setTimeout(() => {
        setShowPermissionModal(true);
      }, 2000); 
      return () => clearTimeout(timer);
    } else if (storedPermission === 'granted') {
      scheduleNextCheckIn();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [scheduleNextCheckIn]);

  // Handle local countdown for the modal UI
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showCheckInModal && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showCheckInModal, countdown]);

  if (!showPermissionModal && !showCheckInModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" />
      
      {/* PERMISSION MODAL */}
      {showPermissionModal && (
        <div className="relative bg-gray-900 border border-gray-700 text-white p-6 rounded-2xl shadow-2xl max-w-sm w-[90%] pointer-events-auto animate-in fade-in zoom-in duration-300">
          <div className="flex items-start gap-4">
            <div className="bg-blue-600/20 p-3 rounded-full">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Enable Safety Check-ins?</h3>
              <p className="text-gray-300 text-sm mb-4">
                We&apos;d like to check in on you every 2 minutes while you use the app to ensure you&apos;re okay.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handlePermissionResponse(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Enable
                </button>
                <button 
                  onClick={() => handlePermissionResponse(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors"
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECK-IN MODAL */}
      {showCheckInModal && (
        <div className="relative bg-gray-900 border border-gray-700 text-white p-6 rounded-2xl shadow-2xl max-w-md w-[90%] pointer-events-auto animate-in fade-in zoom-in duration-300">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2">How are you feeling?</h2>
            <p className="text-gray-400 mb-6">
              Safety Check-in • Responding in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleImOk}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                I&apos;m OK
              </button>
              <button
                onClick={handleNeedHelp}
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                Need Help
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { 
  AlertTriangle, 
  Phone, 
  Users, 
  CheckCircle2,
  Shield,
  MapPin,
  MessageCircle,
  Bell
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

export default function EmergencyHelpPage() {
  const [countdown, setCountdown] = useState<number>(480); // 8 minutes in seconds
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [checkInCountdown, setCheckInCountdown] = useState<number>(600); // 10 minutes in seconds
  const [showCheckInPrompt, setShowCheckInPrompt] = useState<boolean>(false);
  
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const checkInRef = useRef<NodeJS.Timeout | null>(null);
  const notificationRef = useRef<Notification | null>(null);
  
  // FIX: Create a Ref to hold the recursive function to avoid "access before declaration" errors
  const scheduleNextCheckInRef = useRef<(seconds?: number) => void>(() => {});

  const emergencyChecklist = [
    { id: 1, task: "Move to a warm, comfortable area", description: "Find a warm space and use blankets if needed" },
    { id: 2, task: "Drink warm fluids immediately", description: "Hydrate with warm water or herbal tea" },
    { id: 3, task: "Take prescribed pain medication", description: "Use your emergency pain relief as directed" },
    { id: 4, task: "Assume comfortable resting position", description: "Lie down in a position that minimizes pain" },
    { id: 5, task: "Apply warm compresses if helpful", description: "Use warm packs on painful areas" }
  ];

  const emergencyContacts = [
    { name: "Dr. Sarah Johnson", relationship: "Primary Care", phone: "+1 (555) 123-4567", type: "medical" },
    { name: "Maria Rodriguez", relationship: "Mother", phone: "+1 (555) 987-6543", type: "family" },
    { name: "James Wilson", relationship: "Emergency Contact", phone: "+1 (555) 456-7890", type: "friend" }
  ];

  // --- 1. Basic State Helpers (No external dependencies) ---

  const saveEmergencyState = useCallback((active: boolean, remainingTime: number, tasks: Set<number>) => {
    try {
      const state = {
        isActive: active,
        endTime: active ? Date.now() + (remainingTime * 1000) : null,
        completedTasks: Array.from(tasks),
        lastUpdated: Date.now()
      };
      localStorage.setItem('sickleSense_emergencyState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving emergency state:', error);
    }
  }, []);

  const saveCheckInState = useCallback((nextCheckInTime: number) => {
    try {
      const state = {
        nextCheckIn: nextCheckInTime,
        lastCheckIn: Date.now()
      };
      localStorage.setItem('sickleSense_checkInState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving check-in state:', error);
    }
  }, []);

  const clearSavedState = useCallback(() => {
    try {
      localStorage.removeItem('sickleSense_emergencyState');
      localStorage.removeItem('sickleSense_checkInState');
    } catch (error) {
      console.error('Error clearing saved state:', error);
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // --- 2. Action Logic (Building up dependencies) ---

  const escalateToCaregivers = useCallback((reason: string) => {
    console.log(`Escalating to caregivers: ${reason}`);
    
    if (notificationPermission === 'granted') {
      new Notification('🚨 URGENT: Check-in Missed', {
        body: `Patient missed check-in: ${reason}. Please check on them immediately.`,
        icon: '/icon.png',
        tag: 'escalation',
        requireInteraction: true
      });
    }

    // In a real app, this would be an API call
    alert(`Emergency escalated! Caregivers have been notified because: ${reason}`);
  }, [notificationPermission]);

  const escalateEmergency = useCallback(() => {
    if (notificationPermission === 'granted') {
      new Notification('🚨 URGENT: Emergency Escalation', {
        body: 'Patient has not responded to emergency alert. Immediate check required!',
        icon: '/icon.png',
        tag: 'emergency-escalation',
        requireInteraction: true
      });
    }

    escalateToCaregivers('Patient did not respond to emergency protocol');
    clearSavedState();
  }, [notificationPermission, escalateToCaregivers, clearSavedState]);

  const stopPeriodicCheckIns = useCallback(() => {
    if (checkInRef.current) {
      clearInterval(checkInRef.current);
      checkInRef.current = null;
    }
    if (notificationRef.current) {
      notificationRef.current.close();
    }
    clearSavedState();
  }, [clearSavedState]);

  // --- 3. Complex Workflows (Dependent on Actions) ---

  const startEmergencyCountdown = useCallback((initialTime: number = 480) => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCountdown(initialTime);
    saveEmergencyState(true, initialTime, completedTasks);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        const newTime = prev - 1;
        saveEmergencyState(true, newTime, completedTasks);
        
        if (newTime <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
          }
          escalateEmergency();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [completedTasks, saveEmergencyState, escalateEmergency]);

  const startEmergency = useCallback(() => {
    if (!isEmergencyActive) {
      setIsEmergencyActive(true);
      setShowCheckInPrompt(false);
      stopPeriodicCheckIns();
      
      if (notificationPermission === 'granted') {
        new Notification('🚨 Sickle Sense Emergency Alert', {
          body: 'Emergency protocol activated. Caregivers will be notified in 8 minutes if no response.',
          icon: '/icon.png',
          tag: 'emergency-start'
        });
      }

      startEmergencyCountdown(480);
    }
  }, [isEmergencyActive, notificationPermission, stopPeriodicCheckIns, startEmergencyCountdown]);

  const handleNotificationClick = useCallback(() => {
    setShowCheckInPrompt(true);
    setCheckInCountdown(120); // 2 minutes to respond
    startEmergency(); 
  }, [startEmergency]);

  const sendCheckInNotification = useCallback(() => {
    if (notificationPermission === 'granted' && !isEmergencyActive) {
      if (notificationRef.current) {
        notificationRef.current.close();
      }

      notificationRef.current = new Notification('👋 Sickle Sense Check-in', {
        body: 'How are you feeling right now? Tap to respond.',
        icon: '/icon.png',
        tag: 'check-in',
        requireInteraction: true,
      });

      notificationRef.current.onclick = () => {
        handleNotificationClick();
        notificationRef.current?.close();
      };

      notificationRef.current.onclose = () => {
        setTimeout(() => {
          if (!isEmergencyActive && !showCheckInPrompt) {
            escalateToCaregivers('User did not respond to check-in notification');
          }
        }, 2 * 60 * 1000); // 2 minutes
      };

      setShowCheckInPrompt(true);
      setCheckInCountdown(120); 
    }
  }, [notificationPermission, isEmergencyActive, showCheckInPrompt, escalateToCaregivers, handleNotificationClick]);

  // FIX: Modified to use Ref for recursion
  const scheduleNextCheckIn = useCallback((seconds: number = 600) => {
    if (checkInRef.current) {
      clearInterval(checkInRef.current);
    }

    const nextCheckInTime = Date.now() + (seconds * 1000);
    saveCheckInState(nextCheckInTime);

    checkInRef.current = setTimeout(() => {
      sendCheckInNotification();
      // Call the Ref instead of the function directly to allow recursion
      scheduleNextCheckInRef.current(); 
    }, seconds * 1000);
  }, [sendCheckInNotification, saveCheckInState]);

  // FIX: Keep the Ref updated with the latest version of the function
  useEffect(() => {
    scheduleNextCheckInRef.current = scheduleNextCheckIn;
  }, [scheduleNextCheckIn]);

  const startPeriodicCheckIns = useCallback(() => {
    scheduleNextCheckIn(1); 
  }, [scheduleNextCheckIn]);

  // --- 4. Initialization Logic ---

  const loadSavedState = useCallback(() => {
    try {
      const savedEmergency = localStorage.getItem('sickleSense_emergencyState');
      const savedCheckIn = localStorage.getItem('sickleSense_checkInState');
      
      if (savedEmergency) {
        const emergencyState = JSON.parse(savedEmergency);
        if (emergencyState.isActive && emergencyState.endTime) {
          const now = Date.now();
          const endTime = emergencyState.endTime;
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
          
          if (remaining > 0) {
            setIsEmergencyActive(true);
            setCountdown(remaining);
            setCompletedTasks(new Set(emergencyState.completedTasks || []));
            startEmergencyCountdown(remaining);
          } else {
            escalateToCaregivers('Emergency timer expired while page was closed');
          }
        }
      }

      if (savedCheckIn) {
        const checkInState = JSON.parse(savedCheckIn);
        if (checkInState.nextCheckIn && checkInState.nextCheckIn > Date.now()) {
          const timeUntilNext = Math.floor((checkInState.nextCheckIn - Date.now()) / 1000);
          if (timeUntilNext > 0) {
            scheduleNextCheckIn(timeUntilNext);
          }
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
  }, [startEmergencyCountdown, escalateToCaregivers, scheduleNextCheckIn]);

  // --- 5. UI Event Handlers ---

  const handleImOkResponse = useCallback(() => {
    setShowCheckInPrompt(false);
    if (notificationRef.current) {
      notificationRef.current.close();
    }
    
    if (notificationPermission === 'granted') {
      new Notification('✅ Check-in Complete', {
        body: 'Thank you for confirming you\'re OK!',
        icon: '/icon.png',
        tag: 'check-in-ok'
      });
    }

    scheduleNextCheckIn();
  }, [notificationPermission, scheduleNextCheckIn]);

  const handleNeedHelpResponse = useCallback(() => {
    setShowCheckInPrompt(false);
    startEmergency();
    
    if (notificationPermission === 'granted') {
      new Notification('🚨 Help is on the way!', {
        body: 'Emergency protocol activated. Caregivers have been notified.',
        icon: '/icon.png',
        tag: 'check-in-help'
      });
    }
  }, [notificationPermission, startEmergency]);

  const cancelEmergency = useCallback(() => {
    setIsEmergencyActive(false);
    setCompletedTasks(new Set());
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    saveEmergencyState(false, 0, new Set());
    
    startPeriodicCheckIns();
    
    if (notificationPermission === 'granted') {
      new Notification('✅ Emergency Cancelled', {
        body: 'Emergency protocol has been safely cancelled.',
        icon: '/icon.png',
        tag: 'emergency-cancelled'
      });
    }
  }, [notificationPermission, startPeriodicCheckIns, saveEmergencyState]);

  const toggleTask = useCallback((taskId: number) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      saveEmergencyState(isEmergencyActive, countdown, newSet);
      return newSet;
    });
  }, [isEmergencyActive, countdown, saveEmergencyState]);

  // --- 6. Effects ---

  useEffect(() => {
    const initializeNotifications = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
          if (permission === 'granted') {
            startPeriodicCheckIns();
          }
        } else {
          setTimeout(() => {
            setNotificationPermission(Notification.permission);
            if (Notification.permission === 'granted') {
              startPeriodicCheckIns();
            }
          }, 0);
        }
      }
    };

    setTimeout(() => {
      loadSavedState();
    }, 0);
    initializeNotifications();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('fromNotification') === 'true') {
      setTimeout(() => {
        handleNotificationClick();
      }, 0);
    }

    return () => {
      stopPeriodicCheckIns();
    };
  }, [startPeriodicCheckIns, stopPeriodicCheckIns, handleNotificationClick, loadSavedState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
      stopPeriodicCheckIns();
    };
  }, [stopPeriodicCheckIns]);

  // Check-in countdown effect
  useEffect(() => {
    if (showCheckInPrompt && checkInCountdown > 0) {
      const timer = setInterval(() => {
        setCheckInCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (!isEmergencyActive) {
              escalateToCaregivers('User did not respond to check-in prompt');
            }
            setShowCheckInPrompt(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showCheckInPrompt, checkInCountdown, isEmergencyActive, escalateToCaregivers]);

  return (
    <div className="min-h-screen bg-background">
      {/* Check-in Prompt Overlay */}
      {showCheckInPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 border border-border max-w-md w-full">
            <div className="text-center mb-6">
              <Bell className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">How are you feeling?</h2>
              <p className="text-muted-foreground mb-4">
                Please let us know you&apos;re OK. Responding in {formatTime(checkInCountdown)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleImOkResponse}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                I&apos;m OK
              </button>
              <button
                onClick={handleNeedHelpResponse}
                className="bg-destructive text-destructive-foreground py-3 rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
              >
                Need Help
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Header */}
      <div className="bg-destructive text-destructive-foreground py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">Emergency Assistance</h1>
          <p className="text-xl opacity-90">
            {isEmergencyActive 
              ? "Follow the steps below. Help will be notified automatically." 
              : "Activate emergency protocol if you need immediate assistance"
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Status Card */}
        <div className="bg-card rounded-2xl p-6 border border-destructive/20 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Emergency Status</h2>
              <p className="text-muted-foreground">
                {isEmergencyActive 
                  ? "Emergency protocol active. Complete the checklist below."
                  : "Ready to activate emergency assistance when needed."
                }
              </p>
            </div>
            
            {isEmergencyActive ? (
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-1">
                  {formatTime(countdown)}
                </div>
                <div className="text-sm text-muted-foreground">Time remaining</div>
              </div>
            ) : (
              <button
                onClick={startEmergency}
                className="bg-destructive text-destructive-foreground px-8 py-4 rounded-lg font-bold text-lg hover:bg-destructive/90 transition-colors"
              >
                Activate Emergency
              </button>
            )}
          </div>

          {isEmergencyActive && (
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-destructive" />
                <div>
                  <div className="font-semibold">Caregiver Notification</div>
                  <div className="text-sm text-muted-foreground">
                    Your emergency contacts will be notified in {formatTime(countdown)} if you don&apos;t cancel
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isEmergencyActive && (
          <>
            {/* Emergency Checklist */}
            <div className="bg-card rounded-2xl p-6 border border-border mb-8">
              <h2 className="text-2xl font-bold mb-6">Emergency Checklist</h2>
              <p className="text-muted-foreground mb-6">
                Complete these steps to help manage the crisis. Check off each item as you complete it.
              </p>
              
              <div className="space-y-4">
                {emergencyChecklist.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      completedTasks.has(item.id)
                        ? 'bg-green-50 border-green-500 dark:bg-green-950'
                        : 'bg-muted border-border hover:border-primary'
                    }`}
                    onClick={() => toggleTask(item.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 shrink-0 ${
                        completedTasks.has(item.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-muted-foreground'
                      }`}>
                        {completedTasks.has(item.id) && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          completedTasks.has(item.id) ? 'text-green-700 dark:text-green-300' : ''
                        }`}>
                          {item.task}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button
                  onClick={cancelEmergency}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  ✅ I&apos;m Safe - Cancel Emergency
                </button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6">Emergency Contacts</h2>
              <p className="text-muted-foreground mb-6">
                Your emergency contacts will be notified if the countdown completes.
              </p>
              
              <div className="space-y-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <div className="font-semibold">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${contact.phone}`}
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`sms:${contact.phone}`}
                        className="border border-border px-4 py-2 rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Text
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {!isEmergencyActive && (
          /* Quick Actions when not in emergency */
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contact Caregivers</h3>
              <p className="text-muted-foreground mb-4">
                Reach out to your support network directly
              </p>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Message Caregivers
              </button>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border">
              <MapPin className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Find Help Nearby</h3>
              <p className="text-muted-foreground mb-4">
                Locate nearby hospitals and urgent care centers
              </p>
              <button className="w-full border border-primary text-primary py-3 rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                View Nearby Facilities
              </button>
            </div>
          </div>
        )}

        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                  Enable Notifications
                </h3>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                  To receive check-in reminders and emergency alerts, please enable browser notifications for this site.
                </p>
                <button
                  onClick={() => Notification.requestPermission().then(setNotificationPermission)}
                  className="mt-3 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-700 transition-colors"
                >
                  Enable Notifications
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
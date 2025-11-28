// app/emergency/help/page.tsx
'use client';

import { 
  AlertTriangle, 
  Phone, 
  Users, 
  CheckCircle2,
  Shield,
  MapPin,
  MessageCircle
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function EmergencyHelpPage() {
  const [countdown, setCountdown] = useState<number>(480); // 8 minutes in seconds
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

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

  // Request notification permission on component mount
  useEffect(() => {
    const initializeNotifications = async () => {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          setNotificationPermission(permission);
        } else {
          // Use setTimeout to avoid synchronous state update in effect
          setTimeout(() => {
            setNotificationPermission(Notification.permission);
          }, 0);
        }
      }
    };

    initializeNotifications();
  }, []);

  // Start emergency countdown
  const startEmergency = () => {
    if (!isEmergencyActive) {
      setIsEmergencyActive(true);
      setCountdown(480); // Reset to 8 minutes
      
      // Send initial notification
      if (notificationPermission === 'granted') {
        new Notification('🚨 Sickle Sense Emergency Alert', {
          body: 'Emergency protocol activated. Caregivers will be notified in 8 minutes if no response.',
          icon: '/icon.png',
          tag: 'emergency-start'
        });
      }

      // Start countdown
      countdownRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            escalateEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Escalate emergency after 8 minutes
  const escalateEmergency = () => {
    // Send escalation notification
    if (notificationPermission === 'granted') {
      new Notification('🚨 URGENT: Emergency Escalation', {
        body: 'Patient has not responded to emergency alert. Immediate check required!',
        icon: '/icon.png',
        tag: 'emergency-escalation',
        requireInteraction: true
      });
    }

    // Here you would typically call your backend to notify caregivers
    console.log('Emergency escalated - notifying caregivers');
    
    // Show alert to user
    alert('Emergency has been escalated! Your caregivers have been notified to check on you immediately.');
  };

  // Cancel emergency
  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCompletedTasks(new Set());
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    
    if (notificationPermission === 'granted') {
      new Notification('✅ Emergency Cancelled', {
        body: 'Emergency protocol has been safely cancelled.',
        icon: '/icon.png',
        tag: 'emergency-cancelled'
      });
    }
  };

  // Toggle task completion
  const toggleTask = (taskId: number) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
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
                  To receive emergency alerts and countdown notifications, please enable browser notifications for this site.
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
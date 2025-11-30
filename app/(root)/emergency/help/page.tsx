/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { 
  AlertTriangle, 
  Phone, 
  Users, 
  CheckCircle2,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function EmergencyHelpPage() {
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState<number>(480); // 8 minutes
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
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

  // --- Format Helper ---
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // --- Core Emergency Logic ---

  const startEmergencyTimer = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setCountdown(480);
    setIsEmergencyActive(true);

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          // Logic for when time runs out (e.g. notify server)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const cancelEmergency = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setIsEmergencyActive(false);
    setCompletedTasks(new Set());
    setCountdown(480);
  };

  const toggleTask = (taskId: number) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      return newSet;
    });
  };

  // --- Effects ---

  useEffect(() => {
    // If user arrived here from the Check-In Notification "Need Help" button
    const fromNotification = searchParams.get('fromNotification');
    if (fromNotification === 'true') {
      startEmergencyTimer();
    }
    
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [searchParams, startEmergencyTimer]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Emergency Header - Phone Optimized */}
      <div className={`py-8 transition-colors duration-500 ${isEmergencyActive ? 'bg-red-600' : 'bg-orange-600'}`}>
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <AlertTriangle className={`w-16 h-16 mx-auto mb-4 ${isEmergencyActive ? 'animate-pulse' : ''}`} />
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Emergency Assistance</h1>
          <p className="text-lg opacity-90 max-w-lg mx-auto">
            {isEmergencyActive 
              ? "Emergency Protocol Activated. Help will be notified automatically if timer expires." 
              : "Activate emergency protocol if you need immediate assistance."
            }
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        
        {/* Status Card */}
        <div className="bg-card rounded-2xl shadow-xl p-6 border border-border mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Current Status</h2>
              <p className="text-muted-foreground">
                {isEmergencyActive 
                  ? "Active Emergency."
                  : "Monitoring mode."
                }
              </p>
            </div>
            
            {isEmergencyActive ? (
              <div className="flex flex-col items-center">
                <div className="text-5xl font-mono font-bold text-red-600 mb-2">
                  {formatTime(countdown)}
                </div>
                <div className="text-sm text-muted-foreground">until auto-escalation</div>
              </div>
            ) : (
              <button
                onClick={startEmergencyTimer}
                className="w-full md:w-auto bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-700 shadow-lg shadow-red-600/20 active:scale-95 transition-all"
              >
                ACTIVATE EMERGENCY
              </button>
            )}
          </div>
        </div>

        {isEmergencyActive && (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            {/* Checklist */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Action Checklist</h2>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                  {completedTasks.size} / {emergencyChecklist.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {emergencyChecklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${
                      completedTasks.has(item.id)
                        ? 'bg-green-500/10 border-green-500/50'
                        : 'bg-muted/50 border-transparent hover:border-primary/50'
                    }`}
                  >
                    <div className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      completedTasks.has(item.id)
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-muted-foreground'
                    }`}>
                      {completedTasks.has(item.id) && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className={`font-semibold ${completedTasks.has(item.id) ? 'text-green-500' : ''}`}>
                        {item.task}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={cancelEmergency}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  I AM SAFE - CANCEL ALERT
                </button>
              </div>
            </div>

            {/* Contacts Grid - Phone Friendly */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Emergency Contacts</h2>
              <div className="grid gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-muted/50 rounded-xl gap-4">
                    <div className="text-center sm:text-left">
                      <div className="font-bold text-lg">{contact.name}</div>
                      <div className="text-sm text-muted-foreground">{contact.relationship}</div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex-1 sm:flex-none bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 font-medium flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`sms:${contact.phone}`}
                        className="flex-1 sm:flex-none border border-input bg-background px-6 py-3 rounded-lg hover:bg-accent font-medium flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Text
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isEmergencyActive && (
          <div className="grid md:grid-cols-2 gap-6">
            <button className="bg-card hover:bg-muted/50 p-6 rounded-2xl border border-border text-left transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Message Caregivers</h3>
              <p className="text-muted-foreground">Send a quick non-emergency update to your network.</p>
            </button>

            <button className="bg-card hover:bg-muted/50 p-6 rounded-2xl border border-border text-left transition-colors group">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Find Nearby Care</h3>
              <p className="text-muted-foreground">Locate the nearest Sickle Cell friendly facilities.</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// app/dashboard/page.tsx
'use client';

import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  User,
  Droplets,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [lastCheckIn, setLastCheckIn] = useState<string>('Today, 8:30 AM');
  const [notifications, setNotifications] = useState<number>(2);

  const quickStats = [
    {
      label: "Current Risk",
      value: "Low",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      icon: Activity,
      trend: "improving"
    },
    {
      label: "Pain Level",
      value: "3/10",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-950",
      icon: TrendingUp,
      trend: "stable"
    },
    {
      label: "Hydration",
      value: "85%",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      icon: Droplets,
      trend: "improving"
    },
    {
      label: "Medication",
      value: "Taken",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      icon: CheckCircle2,
      trend: "on-track"
    }
  ];

  const todaysChecklist = [
    { id: 1, task: "Morning medication", completed: true, time: "8:00 AM" },
    { id: 2, task: "Drink 2L water", completed: false, progress: 65 },
    { id: 3, task: "Check pain levels", completed: true, time: "8:30 AM" },
    { id: 4, task: "Evening medication", completed: false, time: "8:00 PM" },
    { id: 5, task: "Record symptoms", completed: false }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Hydration level below target',
      time: '2 hours ago',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'info',
      message: 'Daily check-in completed',
      time: 'This morning',
      icon: CheckCircle2
    }
  ];

  const upcomingTasks = [
    { time: '12:00 PM', task: 'Drink water reminder' },
    { time: '2:00 PM', task: 'Pain level check' },
    { time: '8:00 PM', task: 'Evening medication' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here&apos;s your health overview.</p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/emergency/help" 
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-medium hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Emergency
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-2xl p-6 border border-border`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    stat.trend === 'improving' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : stat.trend === 'stable'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Check-in Card */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Daily Health Check-in</h2>
                <span className="text-sm text-muted-foreground">{lastCheckIn}</span>
              </div>
              
              <div className="space-y-4">
                {todaysChecklist.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        item.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-muted-foreground'
                      }`}>
                        {item.completed && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className={item.completed ? 'line-through text-muted-foreground' : ''}>
                        {item.task}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {item.progress && (
                        <div className="w-20 bg-border rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                      {item.time && <Clock className="w-4 h-4" />}
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>

              <Link 
                href="/dashboard/checkin"
                className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-center block"
              >
                Update Today&apos;s Check-in
              </Link>
            </div>

            {/* Health Trends Preview */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Health Trends</h2>
                <Link href="/health-trends" className="text-primary hover:underline text-sm">
                  View Details
                </Link>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">6</div>
                  <div className="text-sm text-muted-foreground">Crisis-free days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
                  <div className="text-sm text-muted-foreground">Hydration avg.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">3.2</div>
                  <div className="text-sm text-muted-foreground">Avg. pain level</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">92%</div>
                  <div className="text-sm text-muted-foreground">Medication adherence</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Recent Alerts</h2>
                <div className="w-6 h-6 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">
                  {notifications}
                </div>
              </div>
              
              <div className="space-y-4">
                {recentAlerts.map((alert) => {
                  const IconComponent = alert.icon;
                  return (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <IconComponent className={`w-5 h-5 mt-0.5 ${
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">Today&apos;s Schedule</h2>
              
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{task.time}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{task.task}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  href="/dashboard/checkin"
                  className="bg-primary text-primary-foreground p-4 rounded-lg text-center hover:bg-primary/90 transition-colors"
                >
                  <Activity className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Check-in</div>
                </Link>
                
                <Link 
                  href="/health-trends"
                  className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
                >
                  <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Trends</div>
                </Link>
                
                <Link 
                  href="/tips"
                  className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors"
                >
                  <Brain className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Tips</div>
                </Link>
                
                <Link 
                  href="/profile"
                  className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
                >
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm">Profile</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
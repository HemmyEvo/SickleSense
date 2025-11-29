// app/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Search, 
  BarChart3, 
  Bell, 
  Lightbulb,
  TrendingUp,
  Smartphone,
  Users,
  Stethoscope,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Early Crisis Detection",
      description: "Our AI predicts pain crises before they happen, giving you time to take preventive action.",
      icon: Search
    },
    {
      title: "Daily Health Tracking",
      description: "Simple daily check-ins to monitor your symptoms, hydration, and triggers.",
      icon: BarChart3
    },
    {
      title: "Emergency Alerts",
      description: "Automatic alerts to caregivers when you need immediate assistance.",
      icon: Bell
    },
    {
      title: "Personalized Insights",
      description: "Learn your unique patterns and triggers to better manage your health.",
      icon: Lightbulb
    }
  ];

  const stats = [
    { number: "85%", label: "Crisis Prediction Accuracy" },
    { number: "6h", label: "Early Warning Lead Time" },
    { number: "60%", label: "Crises Prevented" },
    { number: "24/7", label: "Emergency Support" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl grid md:grid-cols-2 gap-2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            
            <p className="text-2xl max-w-prose text-muted-foreground mb-8 mx-auto">
              Monitor, Predict & Stay Ahead of Pain Crises
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Take control of your health with personalized insights, emergency alerts, and proactive crisis prevention.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-center">
              <Link 
                href="/signup" 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                href="/how-it-works" 
                className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
          <div className="w-full h-full justify-center items-center">
           <div className="w-[150px] h-[150px] rounded-full bg-[#F8EBFF]"/>
         </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-prose mb-16">
            <h2 className="text-xl font-bold mb-4">How Sickle Sense Helps You</h2>
            <p className="text-md text-muted-foreground max-w-3xl mx-auto">
              From early detection to emergency support, we&apos;re with you every step of the way
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-lg cursor-pointer transition-all border ${
                      activeFeature === index
                        ? 'bg-primary text-primary-foreground shadow-lg transform scale-105 border-primary'
                        : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-border'
                    }`}
                    onMouseEnter={() => setActiveFeature(index)}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        activeFeature === index 
                          ? 'bg-primary-foreground text-primary' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className={activeFeature === index ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Visualization */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              {activeFeature === 0 && (
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">Smart Prediction</h3>
                  <p className="text-muted-foreground mb-6">
                    Our system analyzes your daily symptoms and patterns to predict crises 
                    6+ hours before they become severe.
                  </p>
                  <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Low risk detected
                    </div>
                    <div className="flex items-center text-yellow-600 text-sm">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Moderate risk - drink more water
                    </div>
                    <div className="flex items-center text-red-600 text-sm">
                      <Bell className="w-4 h-4 mr-2" />
                      High risk - take immediate action
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 1 && (
                <div className="text-center">
                  <Smartphone className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">Simple Daily Check-in</h3>
                  <p className="text-muted-foreground mb-6">
                    Just 5 quick questions each day to track your health status.
                  </p>
                  <div className="bg-muted rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pain Level</span>
                      <span className="text-green-600 text-sm font-medium">Low</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hydration</span>
                      <span className="text-yellow-600 text-sm font-medium">Need more</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Medication</span>
                      <span className="text-green-600 text-sm font-medium">Taken</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFeature === 2 && (
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">Caregiver Alerts</h3>
                  <p className="text-muted-foreground mb-6">
                    When crisis risk is high, your caregivers get instant notifications.
                  </p>
                  <div className="bg-destructive/10 rounded-lg p-4 text-left border border-destructive/20">
                    <div className="text-destructive font-semibold mb-2 flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      EMERGENCY ALERT
                    </div>
                    <div className="text-sm text-muted-foreground">
                      John is at high crisis risk. Please check on them immediately.
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">2 minutes ago</div>
                  </div>
                </div>
              )}

              {activeFeature === 3 && (
                <div className="text-center">
                  <Lightbulb className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h3 className="text-2xl font-bold mb-4">Personalized Insights</h3>
                  <p className="text-muted-foreground mb-6">
                    Discover your unique triggers and patterns over time.
                  </p>
                  <div className="bg-muted rounded-lg p-4 text-left">
                    <div className="font-semibold mb-2">Your Patterns</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                        Crises often follow cold exposure
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                        Good hydration reduces pain by 40%
                      </div>
                      <div className="flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-2 text-green-600" />
                        Stress is a major trigger for you
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple & Effective</h2>
            <p className="text-xl text-muted-foreground">Three easy steps to better health management</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Sign Up & Set Up</h3>
              <p className="text-muted-foreground">
                Create your account and tell us about your health history, triggers, and emergency contacts.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Daily Check-ins</h3>
              <p className="text-muted-foreground">
                Spend 2 minutes each day logging your symptoms, hydration, and how you&apos;re feeling.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Alerts & Insights</h3>
              <p className="text-muted-foreground">
                Receive early warnings and personalized recommendations to prevent crises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Everyone Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Everyone</h2>
            <p className="text-xl text-muted-foreground">Patients, caregivers, and healthcare providers</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Patients */}
            <div className="bg-card rounded-2xl p-8 text-center border border-border">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">For Patients</h3>
              <ul className="text-muted-foreground space-y-3 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Early crisis detection
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Personalized health insights
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Emergency caregiver alerts
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Simple daily tracking
                </li>
              </ul>
            </div>

            {/* Caregivers */}
            <div className="bg-card rounded-2xl p-8 text-center border border-border">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">For Caregivers</h3>
              <ul className="text-muted-foreground space-y-3 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Real-time risk alerts
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Patient progress monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Emergency contact coordination
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Peace of mind
                </li>
              </ul>
            </div>

            {/* Healthcare Providers */}
            <div className="bg-card rounded-2xl p-8 text-center border border-border">
              <Stethoscope className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">For Healthcare Providers</h3>
              <ul className="text-muted-foreground space-y-3 text-left">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Patient trend analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Crisis pattern insights
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Treatment effectiveness tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Better patient outcomes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-muted to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients and caregivers using Sickle Sense to prevent crises and improve quality of life.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup" 
              className="bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              Start Your Free Account
            </Link>
            <Link 
              href="/how-it-works" 
              className="border-2 border-primary text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Learn More
            </Link>
          </div>
          
          <p className="text-muted-foreground mt-6 text-sm">
            No credit card required • Free forever for basic features
          </p>
        </div>
      </section>
    </div>
  );
}
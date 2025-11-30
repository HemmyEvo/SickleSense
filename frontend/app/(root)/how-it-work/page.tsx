// app/how-it-works/page.tsx
'use client';

import Link from 'next/link';
import { 
  UserPlus, 
  ClipboardList, 
  Bell, 
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Smartphone,
  Mail
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Sign Up & Profile Setup",
      description: "Create your account and provide basic health information, emergency contacts, and your sickle cell history.",
      icon: UserPlus,
      features: [
        "Medical history and triggers",
        "Emergency contact details",
        "Personal health baseline"
      ]
    },
    {
      number: 2,
      title: "Daily Health Check-ins",
      description: "Spend just 2 minutes each day answering simple questions about your symptoms and well-being.",
      icon: ClipboardList,
      features: [
        "Pain level tracking",
        "Hydration status",
        "Medication adherence",
        "Trigger exposure"
      ]
    },
    {
      number: 3,
      title: "AI Risk Analysis",
      description: "Our machine learning algorithms analyze your data to detect patterns and predict crisis risks.",
      icon: TrendingUp,
      features: [
        "Real-time risk scoring",
        "Pattern recognition",
        "Personalized thresholds"
      ]
    },
    {
      number: 4,
      title: "Smart Alerts & Actions",
      description: "Receive early warnings and personalized recommendations to prevent crises before they escalate.",
      icon: Bell,
      features: [
        "Early warning notifications",
        "Preventive action plans",
        "Caregiver alerts"
      ]
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Proactive Prevention",
      description: "Shift from reactive crisis management to proactive prevention with early detection."
    },
    {
      icon: Users,
      title: "Caregiver Network",
      description: "Keep your support system informed and coordinated during emergencies."
    },
    {
      icon: BarChart3,
      title: "Health Insights",
      description: "Understand your personal triggers and patterns through detailed analytics."
    },
    {
      icon: Smartphone,
      title: "Easy to Use",
      description: "Simple interface designed for all ages and technical skill levels."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Sickle Sense Works</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transforming sickle cell care from reactive crisis management to proactive prevention
          </p>
          <Link 
            href="/signup" 
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The 4-Step Process</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, effective, and designed to fit into your daily routine
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.number} className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold relative">
                      {step.number}
                      <div className="absolute -inset-2 bg-primary/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <IconComponent className="w-6 h-6 text-primary" />
                      <h3 className="text-2xl font-semibold">{step.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 text-lg">
                      {step.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why It Works</h2>
            <p className="text-lg text-muted-foreground">
              Built on proven principles of preventive healthcare and modern technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Protocol Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <Bell className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">Emergency Response Protocol</h2>
              <p className="text-lg text-muted-foreground">
                When every second counts, Sickle Sense ensures help arrives quickly
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">For Patients</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    Immediate crisis checklist with step-by-step guidance
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    One-tap emergency contact notification
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    Automatic escalation if no response within 8 minutes
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">For Caregivers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    Real-time risk level notifications
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    Patient location and status updates
                  </li>
                  <li className="flex items-start">
                    <span className="text-destructive mr-2">•</span>
                    Coordinated response with other caregivers
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-muted to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the growing community of patients and caregivers using Sickle Sense to transform sickle cell care.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Create Your Account
            </Link>
            <Link 
              href="/contact" 
              className="border border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
// app/tips/page.tsx
'use client';

import { 
  Droplets, 
  Thermometer, 
  Heart, 
  Utensils,
  Moon,
  Activity,
  Shield,
  Users,
  BookOpen,
  Video
} from 'lucide-react';

export default function HealthTipsPage() {
  const tipCategories = [
    {
      icon: Droplets,
      title: "Hydration",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      tips: [
        "Drink at least 8-10 glasses of water daily",
        "Carry a water bottle with you everywhere",
        "Avoid caffeine and alcohol as they can dehydrate",
        "Set hydration reminders on your phone",
        "Include water-rich foods like watermelon and cucumber"
      ]
    },
    {
      icon: Thermometer,
      title: "Temperature Management",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      tips: [
        "Dress in layers to easily adjust to temperature changes",
        "Avoid sudden temperature changes",
        "Keep your home at a comfortable, consistent temperature",
        "Use blankets and warm clothing in air-conditioned spaces",
        "Avoid swimming in cold water"
      ]
    },
    {
      icon: Heart,
      title: "Stress Management",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      tips: [
        "Practice deep breathing exercises daily",
        "Try meditation or mindfulness apps",
        "Maintain a consistent sleep schedule",
        "Engage in gentle physical activity like walking",
        "Listen to calming music or nature sounds"
      ]
    },
    {
      icon: Utensils,
      title: "Nutrition",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      tips: [
        "Eat balanced meals with plenty of fruits and vegetables",
        "Include iron-rich foods like spinach and lean meats",
        "Stay away from processed foods high in salt",
        "Eat smaller, more frequent meals",
        "Consider folic acid supplements as recommended by your doctor"
      ]
    },
    {
      icon: Moon,
      title: "Sleep & Rest",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      tips: [
        "Aim for 7-9 hours of quality sleep each night",
        "Establish a relaxing bedtime routine",
        "Keep your bedroom cool, dark, and quiet",
        "Avoid screens at least an hour before bed",
        "Listen to your body and rest when tired"
      ]
    },
    {
      icon: Activity,
      title: "Physical Activity",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      tips: [
        "Engage in gentle, regular exercise",
        "Avoid strenuous activities that cause exhaustion",
        "Try swimming, walking, or gentle yoga",
        "Listen to your body and stop if you feel pain",
        "Stay active but know your limits"
      ]
    }
  ];

  const emergencyTips = [
    {
      title: "Recognize Early Signs",
      description: "Know your body's warning signals like increased pain, fatigue, or fever"
    },
    {
      title: "Have a Crisis Plan",
      description: "Keep emergency contacts, medications, and doctor information easily accessible"
    },
    {
      title: "Stay Calm",
      description: "Practice relaxation techniques during early crisis stages"
    },
    {
      title: "Communicate",
      description: "Let your caregivers know immediately when you feel a crisis coming"
    }
  ];

  const resources = [
    {
      icon: BookOpen,
      title: "Educational Materials",
      description: "Downloadable guides and brochures about sickle cell management"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step videos on crisis prevention techniques"
    },
    {
      icon: Users,
      title: "Support Groups",
      description: "Connect with others living with sickle cell disease"
    },
    {
      icon: Shield,
      title: "Emergency Preparedness",
      description: "Checklists and plans for emergency situations"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Health Tips & Resources</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Practical advice and proven strategies to help manage sickle cell disease and prevent crises
          </p>
        </div>
      </section>

      {/* Tips Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Daily Management Tips</h2>
            <p className="text-lg text-muted-foreground">
              Simple changes that can make a big difference in your quality of life
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tipCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <div key={index} className={`${category.bgColor} rounded-2xl p-6 border border-border`}>
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${category.bgColor}`}>
                      <IconComponent className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold ml-3">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-muted-foreground">
                        <span className={`w-2 h-2 rounded-full ${category.color} mt-2 mr-3 flex-shrink-0`}></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Preparedness */}
      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Emergency Preparedness</h2>
            <p className="text-lg text-muted-foreground">
              Be ready to act quickly when crisis warning signs appear
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {emergencyTips.map((tip, index) => (
              <div key={index} className="bg-background rounded-2xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-3 text-destructive">{tip.title}</h3>
                <p className="text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Emergency Checklist</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Keep emergency contacts updated
                </div>
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Have pain medications readily available
                </div>
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Know your nearest hospital location
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Prepare a hospital go-bag
                </div>
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Share your crisis plan with caregivers
                </div>
                <div className="flex items-center text-sm">
                  <input type="checkbox" className="mr-3" />
                  Keep insurance information accessible
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
            <p className="text-lg text-muted-foreground">
              Tools and support to help you on your health journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <div key={index} className="bg-card rounded-2xl p-6 border border-border text-center">
                  <IconComponent className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{resource.title}</h3>
                  <p className="text-muted-foreground">{resource.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
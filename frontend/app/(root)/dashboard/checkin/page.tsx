/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/checkin/page.tsx
'use client';

import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Brain,
  Pill,
  Zap,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CheckInData {
  painLevel: number;
  painLocations: string[];
  fatigueLevel: number;
  temperatureFeeling: 'cold' | 'normal' | 'hot';
  waterIntake: number;
  thirstFeeling: 'not-thirsty' | 'somewhat-thirsty' | 'very-thirsty';
  medicationTaken: boolean;
  coldExposure: boolean;
  stressLevel: 'calm' | 'stressed' | 'very-stressed';
  mood: 'sad' | 'okay' | 'happy';
  sleepQuality: 'poor' | 'fair' | 'good';
  activityLevel: 'low' | 'normal' | 'high';
  additionalNotes: string;
}

export default function CheckInPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CheckInData>({
    painLevel: 0,
    painLocations: [],
    fatigueLevel: 0,
    temperatureFeeling: 'normal',
    waterIntake: 0,
    thirstFeeling: 'not-thirsty',
    medicationTaken: false,
    coldExposure: false,
    stressLevel: 'calm',
    mood: 'okay',
    sleepQuality: 'fair',
    activityLevel: 'normal',
    additionalNotes: ''
  });

  const painLocations = [
    'Chest', 'Back', 'Arms', 'Legs', 'Abdomen', 'Joints', 'Head'
  ];

  // Load last check-in time
  useEffect(() => {
    const lastCheckInTime = localStorage.getItem('sickleSense_lastCheckIn');
    if (lastCheckInTime) {
      Promise.resolve().then(() => {
        setLastCheckIn(new Date(lastCheckInTime).toLocaleString());
      });
    }
  }, []);

  const updateFormData = (field: keyof CheckInData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePainLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      painLocations: prev.painLocations.includes(location)
        ? prev.painLocations.filter(l => l !== location)
        : [...prev.painLocations, location]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Save to localStorage for demo
      const checkInHistory = JSON.parse(localStorage.getItem('sickleSense_checkInHistory') || '[]');
      const newCheckIn = {
        ...formData,
        timestamp: new Date().toISOString(),
        riskScore: calculateRiskScore()
      };
      
      checkInHistory.unshift(newCheckIn);
      localStorage.setItem('sickleSense_checkInHistory', JSON.stringify(checkInHistory));
      localStorage.setItem('sickleSense_lastCheckIn', new Date().toISOString());

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard with success message
      router.push('/dashboard?checkin=success');
    } catch (error) {
      console.error('Error submitting check-in:', error);
      setIsSubmitting(false);
    }
  };

  const calculateRiskScore = (): number => {
    let score = 0;
    
    // Pain level contributes significantly
    score += formData.painLevel * 8;
    
    // Fatigue level
    score += formData.fatigueLevel * 5;
    
    // Temperature feeling
    if (formData.temperatureFeeling === 'cold') score += 15;
    if (formData.temperatureFeeling === 'hot') score += 10;
    
    // Hydration factors
    if (formData.waterIntake < 4) score += 10;
    if (formData.thirstFeeling === 'very-thirsty') score += 15;
    
    // Medication adherence
    if (!formData.medicationTaken) score += 20;
    
    // Cold exposure
    if (formData.coldExposure) score += 15;
    
    // Stress level
    if (formData.stressLevel === 'stressed') score += 10;
    if (formData.stressLevel === 'very-stressed') score += 20;
    
    // Sleep quality
    if (formData.sleepQuality === 'poor') score += 10;
    
    return Math.min(100, score);
  };

  const getRiskLevel = (score: number): { level: string; color: string; message: string } => {
    if (score <= 30) return { 
      level: 'Low', 
      color: 'text-green-600', 
      message: 'You\'re doing great! Keep up the good habits.' 
    };
    if (score <= 60) return { 
      level: 'Medium', 
      color: 'text-yellow-600', 
      message: 'Be mindful of your symptoms. Consider taking preventive measures.' 
    };
    return { 
      level: 'High', 
      color: 'text-red-600', 
      message: 'High risk detected. Please follow your emergency plan and contact your caregiver if needed.' 
    };
  };

  const riskScore = calculateRiskScore();
  const riskInfo = getRiskLevel(riskScore);

  const steps = [
    {
      number: 1,
      title: "Pain & Symptoms",
      icon: Activity,
      description: "How are you feeling physically?"
    },
    {
      number: 2,
      title: "Hydration & Environment",
      icon: Droplets,
      description: "Track your hydration and surroundings"
    },
    {
      number: 3,
      title: "Medication & Stress",
      icon: Pill,
      description: "Medication adherence and mental state"
    },
    {
      number: 4,
      title: "Review & Submit",
      icon: CheckCircle2,
      description: "Review your entries and submit"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Daily Health Check-in</h1>
              <p className="text-muted-foreground">
                Complete your daily health assessment to track your well-being
              </p>
              {lastCheckIn && (
                <p className="text-sm text-muted-foreground mt-1">
                  Last check-in: {lastCheckIn}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${riskInfo.color}`}>
                {riskScore}%
              </div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 
                      ${isCompleted ? 'bg-primary border-primary text-primary-foreground' : 
                        isCurrent ? 'bg-primary border-primary text-primary-foreground' : 
                        'border-muted-foreground text-muted-foreground'}
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        flex-1 h-0.5 mx-2
                        ${isCompleted ? 'bg-primary' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                  <div className="text-center mt-2">
                    <div className={`text-sm font-medium ${
                      isCurrent || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Indicator */}
        {currentStep > 1 && (
          <div className={`mb-6 p-4 rounded-lg border ${
            riskScore <= 30 ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' :
            riskScore <= 60 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800' :
            'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                riskScore <= 30 ? 'bg-green-100 dark:bg-green-900' :
                riskScore <= 60 ? 'bg-yellow-100 dark:bg-yellow-900' :
                'bg-red-100 dark:bg-red-900'
              }`}>
                <Activity className={`w-4 h-4 ${
                  riskScore <= 30 ? 'text-green-600' :
                  riskScore <= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div>
                <div className={`font-semibold ${riskInfo.color}`}>
                  {riskInfo.level} Risk Level
                </div>
                <div className="text-sm text-muted-foreground">
                  {riskInfo.message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          {/* Step 1: Pain & Symptoms */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Pain Assessment</h2>
                <p className="text-muted-foreground">
                  How much pain are you experiencing today?
                </p>
              </div>

              {/* Pain Level */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-4">
                  Pain Level: {formData.painLevel}/10
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={formData.painLevel}
                    onChange={(e) => updateFormData('painLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>No Pain</span>
                    <span>Moderate</span>
                    <span>Severe Pain</span>
                  </div>
                </div>
              </div>

              {/* Pain Locations */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Where do you feel pain?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {painLocations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => togglePainLocation(location)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.painLocations.includes(location)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fatigue Level */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-4">
                  Fatigue Level: {formData.fatigueLevel}/3
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="3"
                    value={formData.fatigueLevel}
                    onChange={(e) => updateFormData('fatigueLevel', parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Normal</span>
                    <span>Tired</span>
                    <span>Very Tired</span>
                    <span>Exhausted</span>
                  </div>
                </div>
              </div>

              {/* Temperature Feeling */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How do you feel temperature-wise?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'cold', label: 'Cold', icon: Thermometer },
                    { value: 'normal', label: 'Normal', icon: Activity },
                    { value: 'hot', label: 'Hot', icon: Zap }
                  ].map((temp) => {
                    const IconComponent = temp.icon;
                    return (
                      <button
                        key={temp.value}
                        type="button"
                        onClick={() => updateFormData('temperatureFeeling', temp.value)}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          formData.temperatureFeeling === temp.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{temp.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Hydration & Environment */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Hydration & Environment</h2>
                <p className="text-muted-foreground">
                  Track your water intake and environmental factors
                </p>
              </div>

              {/* Water Intake */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How many cups of water have you had today?
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => updateFormData('waterIntake', Math.max(0, formData.waterIntake - 1))}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  >
                    -
                  </button>
                  <div className="text-2xl font-bold w-12 text-center">
                    {formData.waterIntake}
                  </div>
                  <button
                    type="button"
                    onClick={() => updateFormData('waterIntake', formData.waterIntake + 1)}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted"
                  >
                    +
                  </button>
                  <span className="text-muted-foreground ml-2">cups</span>
                </div>
              </div>

              {/* Thirst Feeling */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How thirsty do you feel?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'not-thirsty', label: 'Not Thirsty' },
                    { value: 'somewhat-thirsty', label: 'Somewhat Thirsty' },
                    { value: 'very-thirsty', label: 'Very Thirsty' }
                  ].map((thirst) => (
                    <button
                      key={thirst.value}
                      type="button"
                      onClick={() => updateFormData('thirstFeeling', thirst.value)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.thirstFeeling === thirst.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {thirst.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cold Exposure */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Have you been exposed to cold temperatures today?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => updateFormData('coldExposure', option.value)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.coldExposure === option.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Medication & Stress */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Medication & Mental Health</h2>
                <p className="text-muted-foreground">
                  Track medication adherence and emotional well-being
                </p>
              </div>

              {/* Medication Taken */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  Have you taken your prescribed medication today?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => updateFormData('medicationTaken', option.value)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.medicationTaken === option.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stress Level */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How stressed do you feel today?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'calm', label: 'Calm', icon: Brain },
                    { value: 'stressed', label: 'Stressed', icon: Activity },
                    { value: 'very-stressed', label: 'Very Stressed', icon: Zap }
                  ].map((stress) => {
                    const IconComponent = stress.icon;
                    return (
                      <button
                        key={stress.value}
                        type="button"
                        onClick={() => updateFormData('stressLevel', stress.value)}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          formData.stressLevel === stress.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{stress.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How is your mood today?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'sad', label: 'Sad', emoji: '😔' },
                    { value: 'okay', label: 'Okay', emoji: '😊' },
                    { value: 'happy', label: 'Happy', emoji: '😄' }
                  ].map((mood) => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => updateFormData('mood', mood.value)}
                      className={`p-4 rounded-lg border text-center transition-colors ${
                        formData.mood === mood.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      <div className="text-2xl mb-2">{mood.emoji}</div>
                      <div className="text-sm font-medium">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep Quality */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How was your sleep last night?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'poor', label: 'Poor', icon: Clock },
                    { value: 'fair', label: 'Fair', icon: Activity },
                    { value: 'good', label: 'Good', icon: CheckCircle2 }
                  ].map((sleep) => {
                    const IconComponent = sleep.icon;
                    return (
                      <button
                        key={sleep.value}
                        type="button"
                        onClick={() => updateFormData('sleepQuality', sleep.value)}
                        className={`p-4 rounded-lg border text-center transition-colors ${
                          formData.sleepQuality === sleep.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{sleep.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  How active have you been today?
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' }
                  ].map((activity) => (
                    <button
                      key={activity.value}
                      type="button"
                      onClick={() => updateFormData('activityLevel', activity.value)}
                      className={`p-3 rounded-lg border text-sm transition-colors ${
                        formData.activityLevel === activity.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      {activity.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Review Your Check-in</h2>
                <p className="text-muted-foreground">
                  Please review your entries before submitting
                </p>
              </div>

              {/* Risk Summary */}
              <div className={`p-4 rounded-lg border ${
                riskScore <= 30 ? 'bg-green-50 border-green-200 dark:bg-green-950' :
                riskScore <= 60 ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950' :
                'bg-red-50 border-red-200 dark:bg-red-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-lg font-bold ${riskInfo.color}`}>
                      {riskInfo.level} Risk Level ({riskScore}%)
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {riskInfo.message}
                    </div>
                  </div>
                  <TrendingUp className={`w-8 h-8 ${riskInfo.color}`} />
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <div className="font-semibold">Symptoms</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Pain: {formData.painLevel}/10</div>
                    <div>Fatigue: {formData.fatigueLevel}/3</div>
                    <div>Pain Areas: {formData.painLocations.join(', ') || 'None'}</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <div className="font-semibold">Hydration</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Water: {formData.waterIntake} cups</div>
                    <div>Thirst: {formData.thirstFeeling.replace('-', ' ')}</div>
                    <div>Cold Exposure: {formData.coldExposure ? 'Yes' : 'No'}</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-green-600" />
                    <div className="font-semibold">Medication</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Medication Taken: {formData.medicationTaken ? 'Yes' : 'No'}</div>
                    <div>Stress: {formData.stressLevel}</div>
                    <div>Mood: {formData.mood}</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-purple-600" />
                    <div className="font-semibold">Well-being</div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Sleep: {formData.sleepQuality}</div>
                    <div>Activity: {formData.activityLevel}</div>
                    <div>Temperature: {formData.temperatureFeeling}</div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.additionalNotes}
                  onChange={(e) => updateFormData('additionalNotes', e.target.value)}
                  placeholder="Any other symptoms, concerns, or notes about how you're feeling..."
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-8 border-t border-border">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </div>
                ) : (
                  'Submit Check-in'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
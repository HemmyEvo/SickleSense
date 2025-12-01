/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

// Components - Assumes these exist in your project structure
import SignupForm from '@/components/shared/signup/SignupForm';
import PatientDetailsForm from '@/components/shared/signup/PatientDetailsForm';
import ProgressStepper from '@/components/shared/signup/ProgressStepper';
import EmergencyContactsForm from '@/components/shared/signup/EmergencyContactsForm';
import MedicalHistoryForm from '@/components/shared/signup/MedicalHistoryForm';
import CaregiverDetailsForm from '@/components/shared/signup/CaregiverDetailsForm';

export type UserType = 'patient' | 'caregiver' | 'healthcare';

export interface SignupData {
  // Step 1: Account Info
  email: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  
  // Step 2: Personal Info
  personalInfo?: {
    fullName: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    country: string;
    language: string;
  };
  
  // Step 3: Medical History (Patients only)
  medicalHistory?: {
    sickleCellType: string;
    diagnosisDate: string;
    commonCrisisLocations: string[];
    crisisFrequency: string;
    knownTriggers: string[];
    regularMedications: string[];
    usesHydroxyurea: boolean;
    painManagementMethods: string[];
  };
  
  // Step 4: Emergency Contacts
  emergencyContacts?: {
    primary: {
      name: string;
      relationship: string;
      phone: string;
      email: string;
    };
    secondary: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  
  // Step 5: Healthcare Providers
  healthcareProviders?: {
    primaryDoctor: {
      name: string;
      facility: string;
      phone: string;
    };
  };
  
  // Caregiver specific
  caregiverInfo?: {
    relationship: string;
    patients: Array<{
      name: string;
      relationship: string;
      patientCode?: string;
      accessLevel: 'full' | 'limited';
    }>;
  };
}

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });

  const totalSteps = formData.userType === 'patient' ? 5 : 3;

  const updateFormData = (newData: Partial<SignupData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
    // Clear errors when user modifies data
    if (error) setError(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Register the user in Flask Backend via Proxy
      // Ensure you have an API route at app/api/auth/signup/route.ts or equivalent
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to create account');
      }

      console.log('✅ Account created successfully, attempting auto-login...');

      // 2. Automatically log the user in using NextAuth
      // redirect: false prevents NextAuth from trying to change the page automatically
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, 
      });

      if (signInResult?.error) {
        throw new Error('Account created, but auto-login failed. Please sign in manually.');
      }

      // 3. Refresh and Redirect
      // router.refresh() is CRITICAL here. It ensures the root layout re-fetches the session
      // before we push to the dashboard.
      router.refresh(); 
      router.push('/');
      
    } catch (err: any) {
      console.error('Signup Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      
      // Optional: If the account was created but login failed, you might want to redirect to login
      if (err.message.includes('auto-login failed')) {
          setTimeout(() => router.push('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-gray-400 mt-2">Join Sickle Sense to track your health and prevent crises</p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          userType={formData.userType}
        />

        {/* Error Message Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-secondary-foreground rounded-lg p-6 mt-6">
          {currentStep === 1 && (
            <SignupForm 
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <>
              {formData.userType === 'patient' ? (
                <PatientDetailsForm
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              ) : (
                <CaregiverDetailsForm
                  formData={formData}
                  updateFormData={updateFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
            </>
          )}
          
          {currentStep === 3 && formData.userType === 'patient' && (
            <MedicalHistoryForm
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === 4 && formData.userType === 'patient' && (
            <EmergencyContactsForm
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          )}
          
          {currentStep === totalSteps && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Review Your Information</h2>
                <p className="text-gray-400 mt-2">Please review your details before submitting</p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap text-gray-300">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-70 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
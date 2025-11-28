// app/signup/page.tsx
'use client';

import { useState } from 'react';

import Link from 'next/link';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });

  const totalSteps = formData.userType === 'patient' ? 5 : 3;

  const updateFormData = (newData: Partial<SignupData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    // Submit form data to backend
    console.log('Submitting form data:', formData);
    // Add your API call here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-xl font-bold mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-900 font-bold text-sm">SS</span>
            </div>
            <span>Sickle Sense</span>
          </Link>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-gray-400 mt-2">Join Sickle Sense to track your health and prevent crises</p>
        </div>

        {/* Progress Stepper */}
        <ProgressStepper 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          userType={formData.userType}
        />

        {/* Form Steps */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
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
              
              <div className="bg-gray-700 rounded-lg p-4">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-between pt-6">
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

// Components
import SignupForm from '@/components/shared/signup/SignupForm';
import PatientDetailsForm from '@/components/shared/signup/PatientDetailsForm';
import EmergencyContactsForm from '@/components/shared/signup/EmergencyContactsForm';
import MedicalHistoryForm from '@/components/shared/signup/MedicalHistoryForm';
import CaregiverDetailsForm from '@/components/shared/signup/CaregiverDetailsForm';

// Shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronLeft, CheckCircle2, User, Shield, BriefcaseMedical, PhoneCall, Users } from 'lucide-react';

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
  
  // Ref for the main container to scroll to
  const mainContainerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'patient'
  });

  const totalSteps = formData.userType === 'patient' ? 5 : 3;

  // Scroll to top when step changes
  useEffect(() => {
    if (mainContainerRef.current) {
      // Scroll to top of the main container
      mainContainerRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Also scroll window to top as a fallback
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  const updateFormData = (newData: Partial<SignupData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
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
      // 1. Register the user in Flask Backend via your Proxy Route
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
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false, 
      });

      if (signInResult?.error) {
        throw new Error('Account created, but auto-login failed. Please sign in manually.');
      }

      // 3. Refresh and Redirect
      router.refresh(); 
      router.push('/');
      
    } catch (err) {
      console.error('Signup Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      
      setError(errorMessage);
      
      if (errorMessage.includes('auto-login failed')) {
          setTimeout(() => router.push('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format month/year for diagnosis date
  const formatMonthYear = (dateString: string) => {
    if (!dateString) return 'Not provided';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  // Review section components
  const renderReviewSection = () => {
    const userTypeLabel = formData.userType === 'patient' ? 'Patient' : 'Caregiver';

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Review Your Information
            </CardTitle>
            <CardDescription>
              Please review your details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Account Info */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="secondary" className="font-normal">
                    {userTypeLabel}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Personal Info */}
            {formData.personalInfo && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{formData.personalInfo.fullName}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">{formatDate(formData.personalInfo.dateOfBirth)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{formData.personalInfo.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{formData.personalInfo.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{formData.personalInfo.country}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-medium">{formData.personalInfo.language}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Medical History - Patients only */}
            {formData.userType === 'patient' && formData.medicalHistory && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BriefcaseMedical className="h-5 w-5 text-primary" />
                    Medical History
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Sickle Cell Type</p>
                      <p className="font-medium">{formData.medicalHistory.sickleCellType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Diagnosis Date</p>
                      <p className="font-medium">{formatMonthYear(formData.medicalHistory.diagnosisDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Crisis Frequency</p>
                      <p className="font-medium">{formData.medicalHistory.crisisFrequency}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Hydroxyurea Usage</p>
                      <p className="font-medium">
                        {formData.medicalHistory.usesHydroxyurea ? 'Yes' : 'No'}
                      </p>
                    </div>
                    {formData.medicalHistory.commonCrisisLocations?.length > 0 && (
                      <div className="md:col-span-2 space-y-1">
                        <p className="text-sm text-muted-foreground">Common Crisis Locations</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.medicalHistory.commonCrisisLocations.map((location, index) => (
                            <Badge key={index} variant="outline">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.medicalHistory.regularMedications?.length > 0 && (
                      <div className="md:col-span-2 space-y-1">
                        <p className="text-sm text-muted-foreground">Regular Medications</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.medicalHistory.regularMedications.map((medication, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                              {medication}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Emergency Contacts - Patients only */}
            {formData.userType === 'patient' && formData.emergencyContacts && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <PhoneCall className="h-5 w-5 text-primary" />
                    Emergency Contacts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Primary Contact</p>
                      <p className="font-medium">{formData.emergencyContacts.primary.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.emergencyContacts.primary.relationship} • {formData.emergencyContacts.primary.phone}
                      </p>
                    </div>
                    {formData.emergencyContacts.secondary.name && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Secondary Contact</p>
                        <p className="font-medium">{formData.emergencyContacts.secondary.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formData.emergencyContacts.secondary.relationship} • {formData.emergencyContacts.secondary.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Caregiver Info */}
            {formData.userType === 'caregiver' && formData.caregiverInfo && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Caregiver Information
                  </h3>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Relationship to Patient</p>
                    <p className="font-medium">{formData.caregiverInfo.relationship}</p>
                  </div>
                  {formData.caregiverInfo.patients?.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Patients You Care For</p>
                      <div className="space-y-3">
                        {formData.caregiverInfo.patients.map((patient, index) => (
                          <Card key={index} className="border">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="font-medium">{patient.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Relationship: {patient.relationship}
                                  </p>
                                  {patient.patientCode && (
                                    <p className="text-sm text-muted-foreground">
                                      Patient Code: {patient.patientCode}
                                    </p>
                                  )}
                                </div>
                                <Badge variant={
                                  patient.accessLevel === 'full' ? 'default' : 'outline'
                                }>
                                  {patient.accessLevel} Access
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            onClick={prevStep}
            disabled={isLoading}
            variant="outline"
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div ref={mainContainerRef} className="min-h-screen py-8 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">
            Join Sickle Sense to track your health and prevent crises
          </p>
        </div>

        {/* Progress Stepper with Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">
                  Step {currentStep} of {totalSteps}
                </p>
                <Badge variant="outline">
                  {formData.userType === 'patient' ? 'Patient' : 'Caregiver'} Registration
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Account</span>
                <span>Personal Info</span>
                {formData.userType === 'patient' && <span>Medical History</span>}
                {formData.userType === 'patient' && <span>Emergency Contacts</span>}
                <span>Review</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Steps */}
        <div className="">
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
          
          {currentStep === totalSteps && renderReviewSection()}
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/EmergencyContactsForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, PhoneCall, Stethoscope, ChevronLeft, ChevronRight, Users, User, Building } from 'lucide-react';


interface EmergencyContactsFormProps {
  formData: any;
  updateFormData: (data: Partial<any>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function EmergencyContactsForm({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep 
}: EmergencyContactsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const updateEmergencyContact = (level: 'primary' | 'secondary', field: string, value: string) => {
    updateFormData({
      emergencyContacts: {
        ...formData.emergencyContacts,
        [level]: {
          ...formData.emergencyContacts?.[level],
          [field]: value
        }
      }
    });
  };

  const updateHealthcareProvider = (field: string, value: string) => {
    updateFormData({
      healthcareProviders: {
        ...formData.healthcareProviders,
        primaryDoctor: {
          ...formData.healthcareProviders?.primaryDoctor,
          [field]: value
        }
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Emergency Contacts & Healthcare</CardTitle>
            <CardDescription className="text-lg">
              Who should we contact in case of emergency?
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Emergency Contact */}
              <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <PhoneCall className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <CardTitle className="text-md">Primary Emergency Contact</CardTitle>
                      <CardDescription>Your primary contact in emergencies</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="primary-name" className="text-sm">
                          Name
                        </Label>
                        <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="primary-name"
                          required
                          value={formData.emergencyContacts?.primary?.name || ''}
                          onChange={(e) => updateEmergencyContact('primary', 'name', e.target.value)}
                          placeholder="Full name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="primary-relationship" className="text-sm">
                          Relationship
                        </Label>
                        <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="primary-relationship"
                          required
                          value={formData.emergencyContacts?.primary?.relationship || ''}
                          onChange={(e) => updateEmergencyContact('primary', 'relationship', e.target.value)}
                          placeholder="e.g., Parent, Spouse"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="primary-phone" className="text-sm">
                          Phone Number
                        </Label>
                        <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="primary-phone"
                          type="tel"
                          required
                          value={formData.emergencyContacts?.primary?.phone || ''}
                          onChange={(e) => updateEmergencyContact('primary', 'phone', e.target.value)}
                          placeholder="Phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                      <Label htmlFor="primary-email" className="text-sm">
                        Email
                      </Label>
                      <span className="text-destructive text-xs">*</span>
                      </div>
                      <Input
                        id="primary-email"
                        type="email"
                        value={formData.emergencyContacts?.primary?.email || ''}
                        onChange={(e) => updateEmergencyContact('primary', 'email', e.target.value)}
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secondary Emergency Contact */}
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <CardTitle className="text-md">Secondary Emergency Contact</CardTitle>
                      <CardDescription>Alternate contact person</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                      <Label htmlFor="secondary-name" className="text-sm">
                        Name
                      </Label>
                      <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="secondary-name"
                         required value={formData.emergencyContacts?.secondary?.name || ''}
                          onChange={(e) => updateEmergencyContact('secondary', 'name', e.target.value)}
                          placeholder="Full name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                      <Label htmlFor="secondary-relationship" className="text-sm">
                        Relationship
                      </Label>
                      <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="secondary-relationship"
                         required value={formData.emergencyContacts?.secondary?.relationship || ''}
                          onChange={(e) => updateEmergencyContact('secondary', 'relationship', e.target.value)}
                          placeholder="e.g., Sibling, Friend"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center gap-2">
                      <Label htmlFor="secondary-phone" className="text-sm">
                        Phone Number
                      </Label>
                      <span className="text-destructive text-xs">*</span>
                      </div>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="secondary-phone"
                          type="tel"
                         required value={formData.emergencyContacts?.secondary?.phone || ''}
                          onChange={(e) => updateEmergencyContact('secondary', 'phone', e.target.value)}
                          placeholder="Phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Healthcare Provider */}
              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-md">Primary Healthcare Provider</CardTitle>
                      <CardDescription>Your main doctor or clinic</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctor-name" className="text-sm">
                        Doctor&apos;s Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="doctor-name"
                          value={formData.healthcareProviders?.primaryDoctor?.name || ''}
                          onChange={(e) => updateHealthcareProvider('name', e.target.value)}
                          placeholder="Doctor's name"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facility" className="text-sm">
                        Clinic/Hospital
                      </Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="facility"
                          value={formData.healthcareProviders?.primaryDoctor?.facility || ''}
                          onChange={(e) => updateHealthcareProvider('facility', e.target.value)}
                          placeholder="Medical facility"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="doctor-phone" className="text-sm">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="doctor-phone"
                          type="tel"
                          value={formData.healthcareProviders?.primaryDoctor?.phone || ''}
                          onChange={(e) => updateHealthcareProvider('phone', e.target.value)}
                          placeholder="Clinic phone number"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                
                <Button
                  type="submit"
                  size="lg"
                  className="gap-2"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
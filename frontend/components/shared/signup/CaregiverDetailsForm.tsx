/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/CaregiverDetailsForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, User, Phone, Trash2, ChevronLeft, ChevronRight, Shield, UserPlus } from 'lucide-react';

interface CaregiverDetailsFormProps {
  formData: any;
  updateFormData: (data: Partial<any>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function CaregiverDetailsForm({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep 
}: CaregiverDetailsFormProps) {
  const [patients, setPatients] = useState<Array<{
    name: string;
    relationship: string;
    patientCode?: string;
    accessLevel: 'full' | 'limited';
  }>>(formData.caregiverInfo?.patients || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      caregiverInfo: {
        ...formData.caregiverInfo,
        patients
      }
    });
    nextStep();
  };

  const addPatient = () => {
    setPatients(prev => [...prev, { name: '', relationship: '', accessLevel: 'full' }]);
  };

  const updatePatient = (index: number, field: string, value: string) => {
    setPatients(prev => prev.map((patient, i) => 
      i === index ? { ...patient, [field]: value } : patient
    ));
  };

  const removePatient = (index: number) => {
    setPatients(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Caregiver Information</CardTitle>
            <CardDescription className="text-lg">
              Tell us about your caregiving role
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fullName" className="text-base">
                      Your Full Name
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="fullName"
                      required
                      value={formData.personalInfo?.fullName || ''}
                      onChange={(e) => updateFormData({
                        personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                      })}
                      placeholder="Enter your full name"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="phone" className="text-base">
                      Phone Number
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.personalInfo?.phone || ''}
                      onChange={(e) => updateFormData({
                        personalInfo: { ...formData.personalInfo, phone: e.target.value }
                      })}
                      placeholder="Enter your phone number"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Relationship to Patient */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base">
                    Your Relationship to Patient
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <RadioGroup
                  value={formData.caregiverInfo?.relationship || ''}
                  onValueChange={(value) => updateFormData({
                    caregiverInfo: { ...formData.caregiverInfo, relationship: value }
                  })}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {[
                    { value: 'Parent', icon: '👪' },
                    { value: 'Sibling', icon: '👨‍👧‍👦' },
                    { value: 'Spouse/Partner', icon: '💑' },
                    { value: 'Child', icon: '👶' },
                    { value: 'Other Family', icon: '👨‍👩‍👧‍👦' },
                    { value: 'Professional Caregiver', icon: '👩‍⚕️' },
                    { value: 'Friend', icon: '👫' },
                    { value: 'Other', icon: '❓' }
                  ].map((relationship) => (
                    <div key={relationship.value}>
                      <RadioGroupItem
                        value={relationship.value}
                        id={`relationship-${relationship.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`relationship-${relationship.value}`}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                      >
                        <span className="text-2xl mb-1">{relationship.icon}</span>
                        <span className="text-xs font-medium text-center">{relationship.value}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Patients Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div>
                    <h3 className="text-xl font-bold">Patients You Care For</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add details about each patient</p>
                  </div>
                  <Button 
                    type="button" 
                    onClick={addPatient} 
                    size="lg"
                    className="gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Patient
                  </Button>
                </div>

                {patients.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Users className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h4 className="text-lg font-medium">No patients added yet</h4>
                      <p className="text-muted-foreground mt-1">Click &quot;Add Patient&quot; to get started</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {patients.map((patient, index) => (
                      <Card key={index} className="border-purple-200 bg-purple-50 dark:bg-purple-950/20 dark:border-purple-800/30">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <CardTitle className="text-md">Patient {index + 1}</CardTitle>
                                <CardDescription>Care recipient details</CardDescription>
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={() => removePatient(index)}
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient Name */}
                            <div className="space-y-2">
                              <Label htmlFor={`patient-name-${index}`} className="text-sm">
                                Patient Name
                              </Label>
                              <Input
                                id={`patient-name-${index}`}
                                value={patient.name}
                                onChange={(e) => updatePatient(index, 'name', e.target.value)}
                                placeholder="Patient name"
                              />
                            </div>

                            {/* Relationship */}
                            <div className="space-y-2">
                              <Label htmlFor={`patient-relationship-${index}`} className="text-sm">
                                Relationship
                              </Label>
                              <Input
                                id={`patient-relationship-${index}`}
                                value={patient.relationship}
                                onChange={(e) => updatePatient(index, 'relationship', e.target.value)}
                                placeholder="e.g., Son, Daughter"
                              />
                            </div>

                            {/* Patient Code */}
                            <div className="space-y-2">
                              <Label htmlFor={`patient-code-${index}`} className="text-sm">
                                Patient Code (Optional)
                              </Label>
                              <Input
                                id={`patient-code-${index}`}
                                value={patient.patientCode || ''}
                                onChange={(e) => updatePatient(index, 'patientCode', e.target.value)}
                                placeholder="If they have an account"
                              />
                            </div>

                            {/* Access Level */}
                            <div className="space-y-2">
                              <Label htmlFor={`access-level-${index}`} className="text-sm">
                                Access Level
                              </Label>
                              <Select
                                value={patient.accessLevel}
                                onValueChange={(value) => updatePatient(index, 'accessLevel', value)}
                              >
                                <SelectTrigger id={`access-level-${index}`}>
                                  <Shield className="h-4 w-4 mr-2" />
                                  <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      Full Access
                                      <Badge variant="outline" className="ml-2">All features</Badge>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="limited">
                                    <div className="flex items-center gap-2">
                                      <Shield className="h-4 w-4" />
                                      Limited Access
                                      <Badge variant="outline" className="ml-2">Basic features</Badge>
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

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
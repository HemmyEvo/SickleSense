/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/MedicalHistoryForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Pill, Plus, X, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicalHistoryFormProps {
  formData: any;
  updateFormData: (data: Partial<any>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function MedicalHistoryForm({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep 
}: MedicalHistoryFormProps) {
  const [medications, setMedications] = useState<string[]>(
    formData.medicalHistory?.regularMedications || []
  );
  const [newMedication, setNewMedication] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({
      medicalHistory: {
        ...formData.medicalHistory,
        regularMedications: medications
      }
    });
    nextStep();
  };

  const addMedication = () => {
    if (newMedication.trim() && !medications.includes(newMedication.trim())) {
      setMedications(prev => [...prev, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index));
  };

  const toggleArrayValue = (array: string[], value: string, field: string) => {
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
    
    updateFormData({
      medicalHistory: { ...formData.medicalHistory, [field]: newArray }
    });
  };

  // Convert diagnosisDate string to Date object for calendar
  const diagnosisDate = formData.medicalHistory?.diagnosisDate 
    ? new Date(formData.medicalHistory.diagnosisDate + '-01')
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      updateFormData({
        medicalHistory: { ...formData.medicalHistory, diagnosisDate: `${year}-${month}` }
      });
    } else {
      updateFormData({
        medicalHistory: { ...formData.medicalHistory, diagnosisDate: '' }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Medical History</CardTitle>
            <CardDescription className="text-lg">
              Help us understand your sickle cell journey
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sickle Cell Type */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="sickleCellType" className="text-base">
                    Sickle Cell Type
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <RadioGroup
                  value={formData.medicalHistory?.sickleCellType || ''}
                  onValueChange={(value) => updateFormData({
                    medicalHistory: { ...formData.medicalHistory, sickleCellType: value }
                  })}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {[
                    { value: 'HbSS (Most Common)', icon: '🩸' },
                    { value: 'HbSC', icon: '🩺' },
                    { value: 'HbS Beta Thalassemia', icon: '🧬' },
                    { value: 'Other', icon: '❓' },
                    { value: 'Not Sure', icon: '🤔' }
                  ].map((type) => (
                    <div key={type.value}>
                      <RadioGroupItem
                        value={type.value}
                        id={`type-${type.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`type-${type.value}`}
                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 [&:has([data-state=checked])]:border-primary"
                      >
                        <span className="text-2xl mb-2">{type.icon}</span>
                        <span className="text-sm font-medium">{type.value}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Diagnosis Date */}
              <div className="space-y-4">
                <Label htmlFor="diagnosisDate">Diagnosis Date (Month/Year)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !diagnosisDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {diagnosisDate ? format(diagnosisDate, "MMMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={diagnosisDate}
                      onSelect={handleDateSelect}
                      initialFocus
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      className="p-3 pointer-events-auto"
                      
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Crisis Frequency */}
              <div className="space-y-4">
                <Label>Typical Crisis Frequency</Label>
                <RadioGroup
                  value={formData.medicalHistory?.crisisFrequency || ''}
                  onValueChange={(value) => updateFormData({
                    medicalHistory: { ...formData.medicalHistory, crisisFrequency: value }
                  })}
                  className="grid grid-cols-2 gap-3"
                >
                  {[
                    { value: 'Rare (few times per year)', icon: '🌤️' },
                    { value: 'Monthly', icon: '📅' },
                    { value: 'Weekly', icon: '🔄' },
                    { value: 'Very Frequent (multiple times per week)', icon: '⚡' }
                  ].map((frequency) => (
                    <div key={frequency.value}>
                      <RadioGroupItem
                        value={frequency.value}
                        id={`freq-${frequency.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`freq-${frequency.value}`}
                        className="flex items-center justify-center gap-2 rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                      >
                        <span>{frequency.icon}</span>
                        <span className="text-sm">{frequency.value}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Hydroxyurea Usage */}
              <div className="space-y-4">
                <Label>Do you use Hydroxyurea?</Label>
                <RadioGroup
                  value={formData.medicalHistory?.usesHydroxyurea ? 'Yes' : 'No'}
                  onValueChange={(value) => updateFormData({
                    medicalHistory: { 
                      ...formData.medicalHistory, 
                      usesHydroxyurea: value === 'Yes'
                    }
                  })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="hydroxyurea-yes" />
                    <Label htmlFor="hydroxyurea-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="hydroxyurea-no" />
                    <Label htmlFor="hydroxyurea-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Crisis Locations */}
              <div className="space-y-4">
                <Label>Common Crisis Locations</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Chest', 'Back', 'Arms', 'Legs', 'Abdomen', 'Joints'].map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={formData.medicalHistory?.commonCrisisLocations?.includes(location) || false}
                        onCheckedChange={() => toggleArrayValue(
                          formData.medicalHistory?.commonCrisisLocations || [],
                          location,
                          'commonCrisisLocations'
                        )}
                      />
                      <Label 
                        htmlFor={`location-${location}`} 
                        className="cursor-pointer text-sm font-normal"
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Triggers */}
              <div className="space-y-4">
                <Label>Common Triggers</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Cold weather',
                    'Dehydration',
                    'Stress',
                    'Infection',
                    'Physical exertion',
                    'Missing medication',
                    'Not sure'
                  ].map((trigger) => (
                    <div key={trigger} className="flex items-center space-x-2">
                      <Checkbox
                        id={`trigger-${trigger}`}
                        checked={formData.medicalHistory?.knownTriggers?.includes(trigger) || false}
                        onCheckedChange={() => toggleArrayValue(
                          formData.medicalHistory?.knownTriggers || [],
                          trigger,
                          'knownTriggers'
                        )}
                      />
                      <Label 
                        htmlFor={`trigger-${trigger}`} 
                        className="cursor-pointer text-sm font-normal"
                      >
                        {trigger}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pain Management */}
              <div className="space-y-4">
                <Label>Pain Management Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    'Over-the-counter meds',
                    'Prescription painkillers',
                    'Other treatments'
                  ].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Checkbox
                        id={`method-${method}`}
                        checked={formData.medicalHistory?.painManagementMethods?.includes(method) || false}
                        onCheckedChange={() => toggleArrayValue(
                          formData.medicalHistory?.painManagementMethods || [],
                          method,
                          'painManagementMethods'
                        )}
                      />
                      <Label 
                        htmlFor={`method-${method}`} 
                        className="cursor-pointer text-sm font-normal"
                      >
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regular Medications */}
              <div className="space-y-4">
                <Label>Regular Medications</Label>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Add a medication (e.g., Hydroxyurea 500mg)"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={addMedication} 
                      size="lg"
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  
                  {/* Medication List */}
                  <div className="flex flex-wrap gap-2">
                    {medications.map((med, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1.5 gap-2">
                        <Pill className="h-3 w-3" />
                        {med}
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="ml-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
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
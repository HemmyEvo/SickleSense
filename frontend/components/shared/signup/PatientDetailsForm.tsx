/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/PatientDetailsForm.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, User, Phone, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientDetailsFormProps {
  formData: any;
  updateFormData: (data: Partial<any>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function PatientDetailsForm({ 
  formData, 
  updateFormData, 
  nextStep, 
  prevStep 
}: PatientDetailsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  // Convert date string to Date object for calendar
  const dateOfBirth = formData.personalInfo?.dateOfBirth 
    ? new Date(formData.personalInfo.dateOfBirth)
    : undefined;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      updateFormData({
        personalInfo: { ...formData.personalInfo, dateOfBirth: formattedDate }
      });
    } else {
      updateFormData({
        personalInfo: { ...formData.personalInfo, dateOfBirth: '' }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-4xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Personal Information</CardTitle>
            <CardDescription className="text-lg">
              Tell us about yourself to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fullName" className="text-base">
                      Full Name
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="fullName"
                      required
                      value={formData.personalInfo?.fullName || ''}
                      onChange={(e) => updateFormData({
                        personalInfo: { ...formData.personalInfo, fullName: e.target.value }
                      })}
                      placeholder="John Doe"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="dateOfBirth" className="text-base">
                      Date of Birth
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12",
                          !dateOfBirth && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateOfBirth}
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

                {/* Gender - Full width */}
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base">
                      Gender
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <RadioGroup
                    value={formData.personalInfo?.gender || ''}
                    onValueChange={(value) => updateFormData({
                      personalInfo: { ...formData.personalInfo, gender: value }
                    })}
                    className="grid grid-cols-3 gap-3"
                  >
                    {['Male', 'Female', 'Prefer not to say'].map((gender) => (
                      <div key={gender}>
                        <RadioGroupItem
                          value={gender}
                          id={`gender-${gender}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`gender-${gender}`}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                        >
                          <span className="font-medium">{gender}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                      placeholder="+1 (555) 123-4567"
                      className="h-12 text-base pl-10"
                    />
                  </div>
                </div>

                {/* Country/Region */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="country" className="text-base">
                      Country/Region
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Select
                    value={formData.personalInfo?.country || ''}
                    onValueChange={(value) => updateFormData({
                      personalInfo: { ...formData.personalInfo, country: value }
                    })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <Globe className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                      <SelectItem value="IN">India</SelectItem>
                      <SelectItem value="ZA">South Africa</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="GH">Ghana</SelectItem>
                      <SelectItem value="KE">Kenya</SelectItem>
                      <SelectItem value="BR">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Language Preference - Full width */}
                <div className="space-y-3 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="language" className="text-base">
                      Language Preference
                    </Label>
                    <span className="text-destructive">*</span>
                  </div>
                  <Select
                    value={formData.personalInfo?.language || ''}
                    onValueChange={(value) => updateFormData({
                      personalInfo: { ...formData.personalInfo, language: value }
                    })}
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select your language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                    </SelectContent>
                  </Select>
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
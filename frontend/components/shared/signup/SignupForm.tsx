/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/SignupForm.tsx
import { SignupData } from "@/app/(auth)/signup/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Mail, Lock, BriefcaseMedical, Users, ChevronRight, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface SignupFormProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
}

export default function SignupForm({ formData, updateFormData, nextStep }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  const isPasswordValid = formData.password && formData.password.length >= 8;
  const doPasswordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.email && isPasswordValid && doPasswordsMatch && formData.userType;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-2xl">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Create Your Account</CardTitle>
            <CardDescription className="text-lg">
              Choose your role to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-base">
                    I am a:
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <RadioGroup
                  value={formData.userType || ''}
                  onValueChange={(value) => updateFormData({ userType: value as any })}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {[
                    { value: 'patient', label: 'Patient', description: 'Living with sickle cell disease', icon: <BriefcaseMedical /> },
                    { value: 'caregiver', label: 'Caregiver', description: 'Caring for someone with SCD', icon: <Users /> },
                  ].map((type) => (
                    <div key={type.value}>
                      <RadioGroupItem
                        value={type.value}
                        id={`userType-${type.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`userType-${type.value}`}
                        className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer"
                      >
                        <div className="flex-shrink-0 text-2xl text-primary">
                          {type.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{type.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">{type.description}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Separator />

              {/* Email */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder="Enter your email"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="password" className="text-base">
                    Password
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => updateFormData({ password: e.target.value })}
                    placeholder="Create a password"
                    minLength={8}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.password && !isPasswordValid && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Password must be at least 8 characters
                  </div>
                )}
                {formData.password && isPasswordValid && (
                  <div className="text-sm text-green-600 dark:text-green-500">
                    ✓ Password is strong enough
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="confirmPassword" className="text-base">
                    Confirm Password
                  </Label>
                  <span className="text-destructive">*</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && !doPasswordsMatch && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Passwords do not match
                  </div>
                )}
                {formData.confirmPassword && doPasswordsMatch && (
                  <div className="text-sm text-green-600 dark:text-green-500">
                    ✓ Passwords match
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!isFormValid}
                size="lg"
                className="w-full gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Additional Info */}
              <div className="text-center pt-4">
                <p className="text-sm text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-primary underline hover:opacity-80 transition-opacity">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary underline hover:opacity-80 transition-opacity">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
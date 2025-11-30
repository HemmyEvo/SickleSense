/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/SignupForm.tsx

import { SignupData } from "@/app/(auth)/signup/page";


interface SignupFormProps {
  formData: SignupData;
  updateFormData: (data: Partial<SignupData>) => void;
  nextStep: () => void;
}

export default function SignupForm({ formData, updateFormData, nextStep }: SignupFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-secondary font-bold">Create Your Account</h2>
        <p className="text-gray-400 mt-2">Choose your role to get started</p>
      </div>

      {/* User Type Selection */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-3">
          I am a:
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            { value: 'patient', label: 'Patient', description: 'Living with sickle cell disease' },
            { value: 'caregiver', label: 'Caregiver', description: 'Caring for someone with SCD' },
          ].map((type) => (
            <label
              key={type.value}
              className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.userType === type.value
                  ? 'border-secondary dark:bg-black bg-white'
                  : 'border-primary text-primary-foreground hover:border-secondary/70'
              }`}
            >
              <input
                type="radio"
                name="userType"
                value={type.value}
                checked={formData.userType === type.value}
                onChange={(e) => updateFormData({ userType: e.target.value as any })}
                className="mt-1  focus:ring-secondary focus:ring-offset-gray-800"
              />
              <div className="ml-3">
                <div className="font-medium ">{type.label}</div>
                <div className="text-sm ">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-primary-foreground mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className="w-full px-4 py-3  border border-primary-foreground rounded-lg text-primary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          placeholder="Enter your email"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-primary-foreground mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          required
          value={formData.password}
          onChange={(e) => updateFormData({ password: e.target.value })}
          className="w-full px-4 py-3  border border-primary-foreground rounded-lg text-primary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          placeholder="Create a password"
          minLength={8}
        />
        <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters long</p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-foreground mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          required
          value={formData.confirmPassword}
          onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
          className="w-full px-4 py-3  border border-primary-foreground rounded-lg text-primary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
          placeholder="Confirm your password"
        />
        {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
          <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!formData.email || !formData.password || formData.password !== formData.confirmPassword}
        className="w-full py-3 bg-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </form>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/PatientDetailsForm.tsx

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-gray-400 mt-2">Tell us about yourself</p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={formData.personalInfo?.fullName || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, fullName: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-2">
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          required
          value={formData.personalInfo?.dateOfBirth || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, dateOfBirth: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Gender
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Male', 'Female', 'Prefer not to say'].map((gender) => (
            <label
              key={gender}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.personalInfo?.gender === gender
                  ? 'border-white bg-gray-700'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={formData.personalInfo?.gender === gender}
                onChange={(e) => updateFormData({
                  personalInfo: { ...formData.personalInfo, gender: e.target.value }
                })}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.personalInfo?.phone || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, phone: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Country/Region */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
          Country/Region
        </label>
        <select
          id="country"
          required
          value={formData.personalInfo?.country || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, country: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        >
          <option value="">Select your country</option>
          <option value="US">United States</option>
          <option value="NG">Nigeria</option>
          <option value="GB">United Kingdom</option>
          <option value="IN">India</option>
          <option value="ZA">South Africa</option>
          {/* Add more countries as needed */}
        </select>
      </div>

      {/* Language Preference */}
      <div>
        <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
          Language Preference
        </label>
        <select
          id="language"
          required
          value={formData.personalInfo?.language || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, language: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        >
          <option value="">Select your language</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="pt">Portuguese</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
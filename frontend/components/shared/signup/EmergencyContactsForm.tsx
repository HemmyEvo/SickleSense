/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/EmergencyContactsForm.tsx
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Emergency Contacts & Healthcare</h2>
        <p className="text-gray-400 mt-2">Who should we contact in case of emergency?</p>
      </div>

      {/* Primary Caregiver/Guardian */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Primary Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              required
              value={formData.emergencyContacts?.primary?.name || ''}
              onChange={(e) => updateEmergencyContact('primary', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
            <input
              type="text"
              required
              value={formData.emergencyContacts?.primary?.relationship || ''}
              onChange={(e) => updateEmergencyContact('primary', 'relationship', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="e.g., Parent, Spouse"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.emergencyContacts?.primary?.phone || ''}
              onChange={(e) => updateEmergencyContact('primary', 'phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={formData.emergencyContacts?.primary?.email || ''}
              onChange={(e) => updateEmergencyContact('primary', 'email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Email address"
            />
          </div>
        </div>
      </div>

      {/* Secondary Emergency Contact */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Secondary Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.emergencyContacts?.secondary?.name || ''}
              onChange={(e) => updateEmergencyContact('secondary', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Relationship</label>
            <input
              type="text"
              value={formData.emergencyContacts?.secondary?.relationship || ''}
              onChange={(e) => updateEmergencyContact('secondary', 'relationship', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="e.g., Sibling, Friend"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.emergencyContacts?.secondary?.phone || ''}
              onChange={(e) => updateEmergencyContact('secondary', 'phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Phone number"
            />
          </div>
        </div>
      </div>

      {/* Healthcare Provider */}
      <div className="bg-gray-700 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Primary Healthcare Provider</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Doctor&apos;s Name</label>
            <input
              type="text"
              value={formData.healthcareProviders?.primaryDoctor?.name || ''}
              onChange={(e) => updateHealthcareProvider('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Doctor's name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Clinic/Hospital</label>
            <input
              type="text"
              value={formData.healthcareProviders?.primaryDoctor?.facility || ''}
              onChange={(e) => updateHealthcareProvider('facility', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Medical facility"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={formData.healthcareProviders?.primaryDoctor?.phone || ''}
              onChange={(e) => updateHealthcareProvider('phone', e.target.value)}
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Clinic phone number"
            />
          </div>
        </div>
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
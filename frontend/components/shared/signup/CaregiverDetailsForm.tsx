/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/CaregiverDetailsForm.tsx

import { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl text-primary-foreground font-bold">Caregiver Information</h2>
        <p className="text-gray-400 mt-2">Tell us about your caregiving role</p>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-primary-foreground mb-2">
          Your Full Name
        </label>
        <input
          type="text"
          id="fullName"
          required
          value={formData.personalInfo?.fullName || ''}
          onChange={(e) => updateFormData({
            personalInfo: { ...formData.personalInfo, fullName: e.target.value }
          })}
          className="w-full px-4 py-3 bg-primary-foreground border border-primary-foreground rounded-lg text-primary-forebg-primary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-forebg-primary-foreground focus:border-transparent"
          placeholder="Enter your full name"
        />
      </div>

      {/* Relationship to Patient */}
      <div>
        <label className="block text-sm font-medium text-primary-foreground mb-3">
          Your Relationship to Patient
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Parent', 'Sibling', 'Spouse/Partner', 'Child', 
            'Other Family', 'Professional Caregiver', 'Other'
          ].map((relationship) => (
            <label
              key={relationship}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.caregiverInfo?.relationship === relationship
                ? 'border-secondary dark:bg-black bg-white'
                  : 'border-primary text-primary-foreground hover:border-secondary/70'
              }`}
            >
              <input
                type="radio"
                name="relationship"
                value={relationship}
                checked={formData.caregiverInfo?.relationship === relationship}
                onChange={(e) => updateFormData({
                  caregiverInfo: { ...formData.caregiverInfo, relationship: e.target.value }
                })}
                className="text-primary-forebg-primary-foreground focus:ring-primary-forebg-primary-foreground focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-primary-forebg-primary-foreground text-sm">{relationship}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-primary-foreground mb-2">
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
          className="w-full px-4 py-3 bg-primary-foreground border border-primary-foreground rounded-lg text-primary-forebg-primary-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-forebg-primary-foreground focus:border-transparent"
          placeholder="Enter your phone number"
        />
      </div>

      {/* Patients Section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-primary-foreground">
            Patients You Care For
          </label>
          <button
            type="button"
            onClick={addPatient}
            className="text-sm bg-primary-foreground  px-3 py-1 rounded hover:bg-secondary/60 transition-colors"
          >
            + Add Patient
          </button>
        </div>

        {patients.map((patient, index) => (
          <div key={index} className="bg-primary-foreground p-4 rounded-lg mb-3 space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="text-primary-forebg-primary-foreground font-medium">Patient {index + 1}</h4>
              <button
                type="button"
                onClick={() => removePatient(index)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={patient.name}
                  onChange={(e) => updatePatient(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-primary-forebg-primary-foreground text-sm"
                  placeholder="Patient name"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Relationship</label>
                <input
                  type="text"
                  value={patient.relationship}
                  onChange={(e) => updatePatient(index, 'relationship', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-primary-forebg-primary-foreground text-sm"
                  placeholder="e.g., Son, Daughter"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Patient Code (Optional)</label>
                <input
                  type="text"
                  value={patient.patientCode || ''}
                  onChange={(e) => updatePatient(index, 'patientCode', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-primary-forebg-primary-foreground text-sm"
                  placeholder="If they have an account"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Access Level</label>
                <select
                  value={patient.accessLevel}
                  onChange={(e) => updatePatient(index, 'accessLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-primary-forebg-primary-foreground text-sm"
                >
                  <option value="full">Full Access</option>
                  <option value="limited">Limited Access</option>
                </select>
              </div>
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <div className="text-center py-8 text-gray-400 border-2 border-dashed border-primary-foreground rounded-lg">
            <p>No patients added yet</p>
            <p className="text-sm mt-1">Click &quot;Add Patient&quot; to get started</p>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 border border-primary-foreground rounded-lg text-primary-foreground hover:bg-primary-foreground transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-foreground  rounded-lg font-medium hover:bg-secondary/60 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/signup/MedicalHistoryForm.tsx
import { useState } from 'react';

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Medical History</h2>
        <p className="text-gray-400 mt-2">Help us understand your sickle cell journey</p>
      </div>

      {/* Sickle Cell Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Sickle Cell Type
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            'HbSS (Most Common)',
            'HbSC',
            'HbS Beta Thalassemia', 
            'Other',
            'Not Sure'
          ].map((type) => (
            <label
              key={type}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.medicalHistory?.sickleCellType === type
                  ? 'border-white bg-gray-700'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="sickleCellType"
                value={type}
                checked={formData.medicalHistory?.sickleCellType === type}
                onChange={(e) => updateFormData({
                  medicalHistory: { ...formData.medicalHistory, sickleCellType: e.target.value }
                })}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Diagnosis Date */}
      <div>
        <label htmlFor="diagnosisDate" className="block text-sm font-medium text-gray-300 mb-2">
          Diagnosis Date (Month/Year)
        </label>
        <input
          type="month"
          id="diagnosisDate"
          value={formData.medicalHistory?.diagnosisDate || ''}
          onChange={(e) => updateFormData({
            medicalHistory: { ...formData.medicalHistory, diagnosisDate: e.target.value }
          })}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
        />
      </div>

      {/* Common Crisis Locations */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Common Crisis Locations
        </label>
        <div className="grid grid-cols-2 gap-3">
          {['Chest', 'Back', 'Arms', 'Legs', 'Abdomen', 'Joints'].map((location) => (
            <label
              key={location}
              className="flex items-center p-3 border-2 border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.medicalHistory?.commonCrisisLocations?.includes(location) || false}
                onChange={() => toggleArrayValue(
                  formData.medicalHistory?.commonCrisisLocations || [],
                  location,
                  'commonCrisisLocations'
                )}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Crisis Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Typical Crisis Frequency
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Rare (few times per year)',
            'Monthly', 
            'Weekly',
            'Very Frequent (multiple times per week)'
          ].map((frequency) => (
            <label
              key={frequency}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.medicalHistory?.crisisFrequency === frequency
                  ? 'border-white bg-gray-700'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="crisisFrequency"
                value={frequency}
                checked={formData.medicalHistory?.crisisFrequency === frequency}
                onChange={(e) => updateFormData({
                  medicalHistory: { ...formData.medicalHistory, crisisFrequency: e.target.value }
                })}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white text-sm">{frequency}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Common Triggers */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Common Triggers
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            'Cold weather',
            'Dehydration',
            'Stress',
            'Infection',
            'Physical exertion',
            'Missing medication',
            'Not sure'
          ].map((trigger) => (
            <label
              key={trigger}
              className="flex items-center p-3 border-2 border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.medicalHistory?.knownTriggers?.includes(trigger) || false}
                onChange={() => toggleArrayValue(
                  formData.medicalHistory?.knownTriggers || [],
                  trigger,
                  'knownTriggers'
                )}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white text-sm">{trigger}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Regular Medications */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Regular Medications
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Add a medication"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
          />
          <button
            type="button"
            onClick={addMedication}
            className="px-4 py-2 bg-white text-gray-900 rounded hover:bg-gray-100 transition-colors"
          >
            Add
          </button>
        </div>
        
        <div className="space-y-2">
          {medications.map((med, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded">
              <span className="text-white">{med}</span>
              <button
                type="button"
                onClick={() => removeMedication(index)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hydroxyurea Usage */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Do you use Hydroxyurea?
        </label>
        <div className="flex gap-4">
          {['Yes', 'No'].map((option) => (
            <label
              key={option}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.medicalHistory?.usesHydroxyurea === (option === 'Yes')
                  ? 'border-white bg-gray-700'
                  : 'border-gray-600 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="hydroxyurea"
                value={option}
                checked={formData.medicalHistory?.usesHydroxyurea === (option === 'Yes')}
                onChange={(e) => updateFormData({
                  medicalHistory: { 
                    ...formData.medicalHistory, 
                    usesHydroxyurea: e.target.value === 'Yes' 
                  }
                })}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pain Management */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Pain Management Methods
        </label>
        <div className="grid grid-cols-1 gap-3">
          {[
            'Over-the-counter meds',
            'Prescription painkillers',
            'Other treatments'
          ].map((method) => (
            <label
              key={method}
              className="flex items-center p-3 border-2 border-gray-600 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.medicalHistory?.painManagementMethods?.includes(method) || false}
                onChange={() => toggleArrayValue(
                  formData.medicalHistory?.painManagementMethods || [],
                  method,
                  'painManagementMethods'
                )}
                className="text-white focus:ring-white focus:ring-offset-gray-800"
              />
              <span className="ml-2 text-white">{method}</span>
            </label>
          ))}
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
// components/signup/ProgressStepper.tsx
interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  userType: 'patient' | 'caregiver' | 'healthcare';
}

export default function ProgressStepper({ currentStep, userType }: ProgressStepperProps) {
  const patientSteps = [
    'Account Info',
    'Personal Details',
    'Medical History',
    'Emergency Contacts',
    'Review'
  ];
  
  const caregiverSteps = [
    'Account Info',
    'Caregiver Details',
    'Review'
  ];

  const steps = userType === 'patient' ? patientSteps : caregiverSteps;

  return (
    <div className="flex justify-between items-center mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <div key={step} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Step circle */}
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${isCompleted ? 'bg-primary border-primary text-secondary' : 
                  isCurrent ? 'bg-primary border-primary text-secondary' : 
                  'border-gray-600 text-gray-400'}
              `}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={`
                  flex-1 h-0.5 mx-2
                  ${isCompleted ? 'bg-black dark:bg-white' : 'bg-gray-600'}
                `} />
              )}
            </div>
            
            {/* Step label */}
            <span className={`
              text-xs mt-2 text-center
              ${isCurrent || isCompleted ? 'text-black dark:text-white' : 'text-gray-400'}
            `}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}
import React from 'react';

interface Step {
  label: string;
  labelEn?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  locale?: 'ja' | 'en';
}

export default function Stepper({ steps, currentStep, locale = 'ja' }: StepperProps) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <li key={index} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isCompleted ? 'bg-primary-600 text-white' : ''}
                    ${isCurrent ? 'bg-primary-600 text-white ring-4 ring-primary-100' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-neutral-200 text-neutral-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`
                    mt-2 text-xs sm:text-sm font-medium text-center
                    ${isCurrent ? 'text-primary-600' : 'text-neutral-600'}
                  `}
                >
                  {locale === 'ja' ? step.label : (step.labelEn || step.label)}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`
                    absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5
                    ${isCompleted ? 'bg-primary-600' : 'bg-neutral-200'}
                  `}
                  style={{ transform: 'translateY(-50%)' }}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

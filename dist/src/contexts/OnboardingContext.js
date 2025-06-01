import React, { createContext, useContext, useState } from 'react';
const defaultResponses = {
    mood: '',
    goals: [],
    supportNeeded: '',
    sleepQuality: '',
    stressLevel: 0,
};
const OnboardingContext = createContext(undefined);
export function OnboardingProvider({ children }) {
    const [responses, setResponses] = useState(defaultResponses);
    const [isOnboardingComplete, setOnboardingComplete] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    return (<OnboardingContext.Provider value={{
            responses,
            setResponses,
            isOnboardingComplete,
            setOnboardingComplete,
            currentStep,
            setCurrentStep,
        }}>
			{children}
		</OnboardingContext.Provider>);
}
export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}

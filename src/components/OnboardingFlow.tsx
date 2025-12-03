'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import RoleSelection from '@/components/RoleSelection';
import { TravelInterestsSelector } from '@/app/pages/Interests';
import ServiceProviderOnboarding from '@/components/ServiceProviderOnboarding';

type OnboardingStep = 'role' | 'interests' | 'service-details' | 'complete';

export default function OnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('role');
  const [selectedRole, setSelectedRole] = useState<'regular_user' | 'service_provider' | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  // Check if user has completed onboarding or has a role already set
  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  const checkOnboardingStatus = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('role, onboarding_completed')
      .eq('id', user.id)
      .single();

    if (data?.onboarding_completed) {
      // User already completed onboarding, redirect to appropriate home
      if (data.role === 'regular_user') {
        router.push('/user-home');
      } else {
        router.push('/');
      }
      return;
    }

    // If user has a role but hasn't completed onboarding, resume from where they left off
    if (data?.role) {
      setSelectedRole(data.role);
      if (data.role === 'regular_user') {
        setStep('interests');
      } else {
        setStep('service-details');
      }
    }
  };

  const handleRoleSelected = async (role: 'regular_user' | 'service_provider') => {
    setSelectedRole(role);
    
    // Save role to database
    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
          role: role,
          onboarding_completed: false,
        });
    }

    // Move to next step based on role
    if (role === 'regular_user') {
      setStep('interests');
    } else {
      setStep('service-details');
    }
  };

  const handleInterestsSelected = async (interests: string[]) => {
    setLoading(true);
    
    if (user) {
      await supabase
        .from('profiles')
        .update({
          interests: interests,
          onboarding_completed: true,
        })
        .eq('id', user.id);
    }

    setLoading(false);
    
    // Redirect to UserHome immediately
    router.replace('/user-home');
  };

  const handleServiceDetailsCompleted = async () => {
    // Service provider onboarding handles its own DB updates
    // Just redirect to home/dashboard
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up your account...</p>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Set!</h1>
          <p className="text-gray-600 text-lg">Redirecting you to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {step === 'role' && <RoleSelection onRoleSelected={handleRoleSelected} />}
      {step === 'interests' && <TravelInterestsSelector onContinue={handleInterestsSelected} />}
      {step === 'service-details' && <ServiceProviderOnboarding onComplete={handleServiceDetailsCompleted} />}
    </>
  );
}

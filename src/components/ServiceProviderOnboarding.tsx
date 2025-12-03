'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Header from './Header';
import WelcomeScreen from './ServiceProviderOnboarding/WelcomeScreen';
import BasicDetailsStep from './ServiceProviderOnboarding/BasicDetailsStep';
import PricingStep from './ServiceProviderOnboarding/PricingStep';
import AvailabilityStep from './ServiceProviderOnboarding/AvailabilityStep';
import MediaUploadStep from './ServiceProviderOnboarding/MediaUploadStep';
import ReviewStep from './ServiceProviderOnboarding/ReviewStep';
import { ChevronLeft, ChevronRight, Check, FileText, DollarSign, Calendar, Image, ClipboardCheck } from 'lucide-react';

interface ServiceProviderOnboardingProps {
  onComplete: () => void;
}

interface ServiceData {
  serviceName: string;
  description: string;
  category: string;
  province: string;
  city: string;
  district: string;
  basePrice: string;
  adultPrice: string;
  childPrice: string;
  maxGroupSize: string;
  duration: string;
  durationType: 'hours' | 'days';
  availableDates: string[];
  timeSlots: { start: string; end: string }[];
  blockedDates: string[];
  images: Array<{ file?: File; url: string; preview: string }>;
}

export default function ServiceProviderOnboarding({ onComplete }: ServiceProviderOnboardingProps) {
  const { user } = useAuth();
  const supabase = createClient();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ServiceData>({
    serviceName: '',
    description: '',
    category: '',
    province: '',
    city: '',
    district: '',
    basePrice: '',
    adultPrice: '',
    childPrice: '',
    maxGroupSize: '',
    duration: '',
    durationType: 'hours',
    availableDates: [],
    timeSlots: [],
    blockedDates: [],
    images: [],
  });

  const totalSteps = 5;

  const steps = [
    { number: 1, title: 'Basic Details', icon: FileText },
    { number: 2, title: 'Pricing', icon: DollarSign },
    { number: 3, title: 'Availability', icon: Calendar },
    { number: 4, title: 'Images', icon: Image },
    { number: 5, title: 'Review', icon: ClipboardCheck },
  ];

  const updateFormData = (data: Partial<ServiceData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // First, ensure user has service_provider role
      const { error: roleError } = await supabase
        .from('profiles')
        .update({ role: 'service_provider' })
        .eq('id', user.id);

      if (roleError) {
        console.error('Error setting role:', roleError);
        alert('Failed to update user role. Please try again.');
        return;
      }

      // Upload images to Supabase Storage
      const imageUrls: string[] = [];
      
      for (const img of formData.images) {
        if (img.file) {
          // Generate unique filename
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('service-images')
            .upload(fileName, img.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('Error uploading image:', uploadError);
            // Use placeholder if upload fails
            imageUrls.push('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80');
          } else {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('service-images')
              .getPublicUrl(fileName);
            imageUrls.push(publicUrl);
          }
        }
      }

      // If no images were uploaded successfully, use a placeholder
      if (imageUrls.length === 0) {
        imageUrls.push('https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80');
      }

      // Create service record (will fail if table doesn't exist - needs migration)
      const { error: serviceError } = await supabase.from('services').insert({
        provider_id: user.id,
        title: formData.serviceName,
        description: formData.description,
        category: formData.category,
        province: formData.province,
        city: formData.city,
        district: formData.district,
        base_price: parseFloat(formData.basePrice),
        adult_price: parseFloat(formData.adultPrice),
        child_price: formData.childPrice ? parseFloat(formData.childPrice) : null,
        max_group_size: parseInt(formData.maxGroupSize),
        duration: parseFloat(formData.duration),
        duration_type: formData.durationType,
        images: imageUrls,
        available_dates: formData.availableDates,
        time_slots: formData.timeSlots,
        blocked_dates: formData.blockedDates,
        status: 'active',
      });

      if (serviceError) {
        console.error('Error creating service:', serviceError);
        alert(`Failed to create service: ${serviceError.message}`);
        return;
      }

      // Mark onboarding as complete
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      onComplete();
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.serviceName.trim() !== '' &&
          formData.description.trim().length >= 50 &&
          formData.category !== '' &&
          formData.province !== '' &&
          formData.city !== '' &&
          formData.district !== ''
        );
      case 2:
        return (
          formData.basePrice !== '' &&
          parseFloat(formData.basePrice) > 0 &&
          formData.adultPrice !== '' &&
          parseFloat(formData.adultPrice) > 0 &&
          formData.maxGroupSize !== '' &&
          parseInt(formData.maxGroupSize) > 0 &&
          formData.duration !== '' &&
          parseFloat(formData.duration) > 0
        );
      case 3:
        return formData.availableDates.length > 0 && formData.timeSlots.length > 0;
      case 4:
        return formData.images.length >= 3;
      case 5:
        return true;
      default:
        return false;
    }
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        onStart={() => setShowWelcome(false)}
        userName={user?.user_metadata?.full_name || user?.user_metadata?.name}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                return (
                <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                      currentStep > step.number
                        ? 'bg-orange-600 text-white'
                        : currentStep === step.number
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <p className="text-xs mt-2 text-center font-medium text-gray-700">
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      currentStep > step.number ? 'bg-orange-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            )})}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {currentStep === 1 && (
            <BasicDetailsStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 2 && (
            <PricingStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 3 && (
            <AvailabilityStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 4 && (
            <MediaUploadStep data={formData} onChange={updateFormData} />
          )}
          {currentStep === 5 && (
            <ReviewStep
              data={formData}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

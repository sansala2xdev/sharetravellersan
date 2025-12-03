'use client';

import React, { useState } from 'react';
import { Mountain, Building2, Camera, Users, Umbrella, Compass } from 'lucide-react';
import Header from '@/components/Header';

interface TravelInterestsSelectorProps {
  onContinue: (interests: string[]) => void;
}

const TravelInterestsSelector: React.FC<TravelInterestsSelectorProps> = ({ onContinue }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { id: 'adventure', label: 'Adventure', icon: Mountain },
    { id: 'cultural', label: 'Cultural Tours', icon: Building2 },
    { id: 'photography', label: 'Photography', icon: Camera },
    { id: 'group', label: 'Group Tours', icon: Users },
    { id: 'beach', label: 'Beach & Relax', icon: Umbrella },
    { id: 'nature', label: 'Nature & Wildlife', icon: Compass }
  ];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedInterests);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="flex items-center justify-center p-6 pt-24">
      <div className="bg-white max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            What interests you?
          </h1>
          <p className="text-gray-500 text-lg">
            Select your travel interests to get personalized recommendations
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {interests.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => toggleInterest(id)}
              className={`
                p-8 rounded-xl border transition-all duration-200
                flex flex-col items-center gap-4
                ${selectedInterests.includes(id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <Icon 
                className={`w-14 h-14 ${
                  selectedInterests.includes(id) 
                    ? 'text-blue-500' 
                    : 'text-gray-400'
                }`}
                strokeWidth={1.5}
              />
              <span className="font-medium text-gray-900 text-base">
                {label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium text-lg transition-all duration-200"
        >
          Continue
        </button>
      </div>
      </div>
    </div>
  );
};

// Example usage component
export default function InterestsPage() {
  const [showInterests, setShowInterests] = useState(true);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  const handleInterestsSelected = (interests: string[]) => {
    setUserInterests(interests);
    setShowInterests(false);
    console.log('Selected interests:', interests);
    // Here you would typically save to state management or backend
  };

  if (showInterests) {
    return <TravelInterestsSelector onContinue={handleInterestsSelected} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to Your Travel Hub!</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-3">Your Selected Interests:</h2>
          <div className="flex flex-wrap gap-2">
            {userInterests.map(interest => (
              <span 
                key={interest}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowInterests(true)}
            className="mt-6 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Change Interests
          </button>
        </div>
      </div>
    </div>
  );
}

export { TravelInterestsSelector };
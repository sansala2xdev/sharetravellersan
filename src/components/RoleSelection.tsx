'use client';

import { useState } from 'react';
import { Users, Briefcase } from 'lucide-react';
import Header from './Header';

interface RoleSelectionProps {
  onRoleSelected: (role: 'regular_user' | 'service_provider') => void;
}

export default function RoleSelection({ onRoleSelected }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'regular_user' | 'service_provider' | null>(null);

  const roles = [
    {
      id: 'regular_user' as const,
      title: 'Regular User',
      description: 'Discover and book amazing travel experiences',
      icon: Users,
      features: ['Browse destinations', 'Book tours & activities', 'Save favorites', 'Read reviews']
    },
    {
      id: 'service_provider' as const,
      title: 'Service Provider',
      description: 'Share your tours and services with travelers',
      icon: Briefcase,
      features: ['List your services', 'Manage bookings', 'Connect with customers', 'Grow your business']
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelected(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      <div className="flex items-center justify-center p-6 pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full p-8 md:p-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to ShareTraveller!
          </h1>
          <p className="text-gray-600 text-lg">
            Let's get started by selecting your role
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`
                  p-8 rounded-xl border-2 transition-all duration-200 text-left
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }
                `}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`
                    p-3 rounded-lg 
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
                  `}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {role.title}
                    </h3>
                    <p className="text-gray-600">
                      {role.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            Continue
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

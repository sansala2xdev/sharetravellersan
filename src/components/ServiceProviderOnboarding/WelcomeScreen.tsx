'use client';

import { Briefcase, ArrowRight, LayoutDashboard } from 'lucide-react';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

interface WelcomeScreenProps {
  onStart: () => void;
  userName?: string;
}

export default function WelcomeScreen({ onStart, userName }: WelcomeScreenProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center p-6 pt-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-9 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-100 rounded-full mb-4">
            <Briefcase className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome{userName ? `, ${userName}` : ''}! 
          </h1>
          <p className="text-md text-gray-600 mb-1">
            You're now a Service Provider on ShareTraveller
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Let's get your business set up
          </h2>
          <p className="text-gray-700 mb-4">
            We'll help you create your first tour or service listing in just a few steps:
          </p>
          <ul className="text-left space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm mr-3 mt-0.5">1</span>
              <span>Basic service details and location</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm mr-3 mt-0.5">2</span>
              <span>Pricing and capacity information</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm mr-3 mt-0.5">3</span>
              <span>Set your availability schedule</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm mr-3 mt-0.5">4</span>
              <span>Upload beautiful images</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-500 text-white rounded-full text-sm mr-3 mt-0.5">5</span>
              <span>Review and publish your listing</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.push('/provider/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-4 bg-gray-600 hover:bg-gray-700 text-white text-lg font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            <LayoutDashboard className="w-5 h-5" />
            Go to Dashboard
          </button>
          
          <button
            onClick={onStart}
            className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
          >
            Start Setup
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          This should take about 10-15 minutes to complete
        </p>
      </div>
      </div>
    </div>
  );
}

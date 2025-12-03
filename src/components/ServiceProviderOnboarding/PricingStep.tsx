'use client';

import { DollarSign, Users, Clock, ChevronDown } from 'lucide-react';

interface PricingStepProps {
  data: {
    basePrice: string;
    adultPrice: string;
    childPrice: string;
    maxGroupSize: string;
    duration: string;
    durationType: 'hours' | 'days';
  };
  onChange: (data: any) => void;
}

export default function PricingStep({ data, onChange }: PricingStepProps) {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing & Capacity</h2>
        <p className="text-gray-600">Set your pricing and group size limits</p>
      </div>

      {/* Pricing Section */}
      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <DollarSign className="w-5 h-5" />
          Pricing
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Base Price (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.basePrice}
                onChange={(e) => handleChange('basePrice', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Starting price per person</p>
          </div>

          {/* Adult Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Adult Price (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.adultPrice}
                onChange={(e) => handleChange('adultPrice', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Price per adult</p>
          </div>

          {/* Child Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Child Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={data.childPrice}
                onChange={(e) => handleChange('childPrice', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Price per child (optional)</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">Pricing Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Research competitor pricing in your area</li>
            <li>• Consider seasonal pricing variations</li>
            <li>• Child pricing is typically 50-70% of adult price</li>
            <li>• Base price is what appears in listings</li>
          </ul>
        </div>
      </div>

      {/* Capacity Section */}
      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Users className="w-5 h-5" />
          Group Capacity
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Maximum Group Size *
          </label>
          <input
            type="number"
            value={data.maxGroupSize}
            onChange={(e) => handleChange('maxGroupSize', e.target.value)}
            placeholder="e.g., 8"
            min="1"
            className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Maximum number of people per booking
          </p>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">Capacity Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Consider comfort and safety of your guests</li>
            <li>• Smaller groups often provide better experiences</li>
            <li>• Private tours typically have 1-6 guests</li>
            <li>• Group tours can accommodate 10-20+ people</li>
          </ul>
        </div>
      </div>

      {/* Duration Section */}
      <div className="bg-orange-50 rounded-xl p-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <Clock className="w-5 h-5" />
          Duration
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Duration *
            </label>
            <input
              type="number"
              value={data.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              placeholder="e.g., 8"
              min="0.5"
              step="0.5"
              className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Duration Type *
            </label>
            <div className="relative">
              <select
                value={data.durationType}
                onChange={(e) => handleChange('durationType', e.target.value)}
                className="w-full px-4 py-3 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                required
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          Total duration: {data.duration} {data.durationType}
        </p>

        <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
          <h4 className="font-semibold text-gray-900 mb-2">Duration Examples</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Half-day tour: 4-5 hours</li>
            <li>• Full-day tour: 8-10 hours</li>
            <li>• Multi-day trek: 2-7 days</li>
            <li>• Short activity: 1-3 hours</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

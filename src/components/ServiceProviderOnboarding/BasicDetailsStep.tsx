'use client';

import { useState, useEffect } from 'react';
import { MapPin, Tag, FileText, ChevronDown } from 'lucide-react';

interface BasicDetailsStepProps {
  data: {
    serviceName: string;
    description: string;
    category: string;
    province: string;
    city: string;
    district: string;
  };
  onChange: (data: any) => void;
}

const CATEGORIES = [
  'Adventure',
  'Wildlife',
  'Hiking',
  'City Tour',
  'Water Sports',
  'Cultural',
  'Beach & Relaxation',
  'Photography',
  'Food & Culinary',
  'Wellness & Spa',
  'Historical Sites',
  'Nature & Eco',
];

const PROVINCES = [
  'Western Province',
  'Central Province',
  'Southern Province',
  'Northern Province',
  'Eastern Province',
  'North Western Province',
  'North Central Province',
  'Uva Province',
  'Sabaragamuwa Province',
];

const CITIES_BY_PROVINCE: Record<string, string[]> = {
  'Western Province': ['Colombo', 'Gampaha', 'Kalutara', 'Negombo', 'Mount Lavinia'],
  'Central Province': ['Kandy', 'Matale', 'Nuwara Eliya', 'Dambulla'],
  'Southern Province': ['Galle', 'Matara', 'Hambantota', 'Mirissa', 'Tangalle'],
  'Northern Province': ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya'],
  'Eastern Province': ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western Province': ['Kurunegala', 'Puttalam', 'Chilaw'],
  'North Central Province': ['Anuradhapura', 'Polonnaruwa'],
  'Uva Province': ['Badulla', 'Monaragala', 'Ella', 'Bandarawela'],
  'Sabaragamuwa Province': ['Ratnapura', 'Kegalle'],
};

export default function BasicDetailsStep({ data, onChange }: BasicDetailsStepProps) {
  const [districts, setDistricts] = useState<string[]>([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  const cities = data.province ? CITIES_BY_PROVINCE[data.province] || [] : [];

  // Fetch districts using Google Places API when city changes
  useEffect(() => {
    if (data.city) {
      fetchDistricts(data.city);
    }
  }, [data.city]);

  const fetchDistricts = async (city: string) => {
    setLoadingDistricts(true);
    try {
      // For now, using mock data. You'll need to implement Google Places API
      // TODO: Implement actual Google Places API call
      const mockDistricts = [
        `${city} Central`,
        `${city} North`,
        `${city} South`,
        `${city} East`,
        `${city} West`,
      ];
      setDistricts(mockDistricts);
    } catch (error) {
      console.error('Error fetching districts:', error);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    const updates: any = { [field]: value };
    
    // Reset dependent fields
    if (field === 'province') {
      updates.city = '';
      updates.district = '';
      setDistricts([]);
    }
    if (field === 'city') {
      updates.district = '';
    }

    onChange({ ...data, ...updates });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Details</h2>
        <p className="text-gray-600">Tell us about your tour or service</p>
      </div>

      {/* Service Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
          <Tag className="w-4 h-4" />
          Service Name *
        </label>
        <input
          type="text"
          value={data.serviceName}
          onChange={(e) => handleChange('serviceName', e.target.value)}
          placeholder="e.g., Sigiriya Rock Fortress Adventure"
          className="w-full px-4 py-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
          <FileText className="w-4 h-4" />
          Description *
        </label>
        <textarea
          value={data.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe your service, what makes it special, and what guests can expect..."
          rows={5}
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          required
        />
        <p className="text-sm text-gray-500 mt-1">
          {data.description.length} characters (minimum 100 recommended)
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Category *
        </label>
        <div className="relative">
          <select
            value={data.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-3 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Location Section */}
      <div className="border-t pt-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
          <MapPin className="w-5 h-5" />
          Location
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Province *
            </label>
            <div className="relative">
              <select
                value={data.province}
                onChange={(e) => handleChange('province', e.target.value)}
                className="w-full px-4 py-3 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
                required
              >
                <option value="">Select province</option>
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              City *
            </label>
            <div className="relative">
              <select
                value={data.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="w-full px-4 py-3 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!data.province}
                required
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* District */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              District/Area *
            </label>
            <div className="relative">
              <select
                value={data.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full px-4 py-3 pr-10 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none disabled:bg-gray-50 disabled:text-gray-500"
                disabled={!data.city || loadingDistricts}
                required
              >
                <option value="">
                  {loadingDistricts ? 'Loading districts...' : 'Select district/area'}
                </option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Select the specific area where your service is located
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

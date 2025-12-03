'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Users, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import TourDetails from './TourDetails';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  province: string;
  city: string;
  base_price: number;
  adult_price: number;
  max_group_size: number;
  duration: number;
  duration_type: string;
  images: string[];
  status: string;
  created_at: string;
  provider_id: string;
}

interface AllServicesProps {
  onBack?: () => void;
}

const AllServices: React.FC<AllServicesProps> = ({ onBack }) => {
  const supabase = createClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter services
  const getFilteredServices = () => {
    let filtered = services;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by province
    if (selectedProvince !== 'all') {
      filtered = filtered.filter(service =>
        service.province.includes(selectedProvince)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service =>
        service.category === selectedCategory
      );
    }

    return filtered;
  };

  const filteredServices = getFilteredServices();

  // If a tour is selected, show the details page
  if (selectedTourId !== null) {
    return <TourDetails tourId={selectedTourId} onBack={() => setSelectedTourId(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Sri Lanka</h1>
          <p className="text-gray-600 text-lg">Discover amazing experiences across the island</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tours, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            />
          </div>
          <div className="relative md:w-48">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-black"
            >
              <option value="all">All Provinces</option>
              <option value="Western">Western</option>
              <option value="Central">Central</option>
              <option value="Southern">Southern</option>
              <option value="Northern">Northern</option>
              <option value="Eastern">Eastern</option>
              <option value="North Western">North Western</option>
              <option value="North Central">North Central</option>
              <option value="Uva">Uva</option>
              <option value="Sabaragamuwa">Sabaragamuwa</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative md:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-black"
            >
              <option value="all">All Categories</option>
              <option value="Adventure">Adventure</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Hiking">Hiking</option>
              <option value="City Tour">City Tour</option>
              <option value="Water Sports">Water Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Beach & Relaxation">Beach & Relaxation</option>
              <option value="Photography">Photography</option>
              <option value="Food & Culinary">Food & Culinary</option>
              <option value="Wellness & Spa">Wellness & Spa</option>
              <option value="Historical Sites">Historical Sites</option>
              <option value="Nature & Eco">Nature & Eco</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-4">{filteredServices.length} services found</p>
            {/* Tours Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  {service.images && service.images.length > 0 ? (
                    <img 
                      src={service.images[0]} 
                      alt={service.title} 
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                      <p className="text-orange-600 font-medium">No image</p>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-1 text-gray-900">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm mb-3 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{service.city}, {service.province}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} {service.duration_type}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>Max {service.max_group_size}</span>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                        {service.category}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-3xl font-bold text-gray-900">${service.adult_price}</p>
                        <p className="text-xs text-gray-500">per adult</p>
                      </div>
                      <button 
                        onClick={() => setSelectedTourId(service.id)}
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllServices;

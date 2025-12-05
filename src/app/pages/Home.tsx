'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';

export default function ShareTraveller() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const sriLankaCities = [
    {
      name: 'Colombo',
      image: '/images/colombo.jpg',
      city: 'colombo'
    },
    {
      name: 'Kandy',
      image: '/images/kandy.jpg',
      city: 'kandy'
    },
    {
      name: 'Galle',
      image: '/images/galle.jpg',
      city: 'galle'
    },
    {
      name: 'Dambulla',
      image: '/images/dambulla.jpeg',
      city: 'dambulla'
    },
    {
      name: 'Ella',
      image: '/images/ella.jpg',
      city: 'ella'
    },
    {
      name: 'Mirissa',
      image: '/images/mirissa.jpeg',
      city: 'mirissa'
    },
  ];

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setAttractions(data || []);
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div 
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&h=900&fit=crop)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-blue-900/60" />
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
            Discover & book things to do
          </h1>
          
          {/* Search Bar */}
          <div className="w-full max-w-3xl flex items-center bg-white rounded-full shadow-lg overflow-hidden">
            <input
              type="text"
              placeholder="Find places and things to do"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  router.push(`/all-services?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="flex-1 px-6 py-4 text-gray-700 outline-none"
            />
            <button 
              onClick={() => {
                if (searchQuery.trim()) {
                  router.push(`/all-services?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 font-semibold transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cities Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Explore Sri Lanka's Beautiful Cities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {sriLankaCities.map((city, idx) => (
              <div 
                key={idx}
                onClick={() => router.push(`/all-services?city=${city.city}`)}
                className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img 
                  src={city.image} 
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">{city.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attractions Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Attractions you can't miss
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {attractions.map((attraction) => (
                <div 
                  key={attraction.id}
                  onClick={() => router.push(`/user-home?serviceId=${attraction.id}`)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
                >
                  <div className="relative h-48">
                    <img 
                      src={
                        attraction.images && attraction.images.length > 0 
                          ? attraction.images[0] 
                          : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'
                      } 
                      alt={attraction.title}
                      className="w-full h-full object-cover"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality
                      }}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
                    >
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {attraction.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {attraction.city}, {attraction.province}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-semibold">
                          {attraction.rating || '4.5'}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${attraction.base_price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2025 Share Traveller. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { Heart, Search, X } from 'lucide-react';
import Header from '@/components/Header';

export default function ShareTraveller() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const destinations = [
    {
      name: 'Rome',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
    },
    {
      name: 'Paris',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    },
    {
      name: 'Amsterdam',
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400&h=300&fit=crop',
    },
    {
      name: 'New York City',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    },
    {
      name: 'Boston',
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop',
    },
    {
      name: 'Chicago',
      image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=300&fit=crop',
    },
  ];

  const attractions = [
    {
      name: 'Colosseum Tours',
      location: 'Rome, Italy',
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop',
      rating: 4.8,
      price: 45,
    },
    {
      name: 'Eiffel Tower Experience',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400&h=300&fit=crop',
      rating: 4.9,
      price: 35,
    },
    {
      name: 'Canal Cruise',
      location: 'Amsterdam, Netherlands',
      image: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=400&h=300&fit=crop',
      rating: 4.7,
      price: 28,
    },
    {
      name: 'Statue of Liberty Tour',
      location: 'New York, USA',
      image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&h=300&fit=crop',
      rating: 4.8,
      price: 52,
    },
  ];

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
              className="flex-1 px-6 py-4 text-gray-700 outline-none"
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 font-semibold transition">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Destinations Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Things to do wherever you're going
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {destinations.map((dest, idx) => (
              <div 
                key={idx}
                className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-bold">{dest.name}</h3>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {attractions.map((attraction, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
              >
                <div className="relative h-48">
                  <img 
                    src={attraction.image} 
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                  />
                  <button className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {attraction.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{attraction.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-sm font-semibold">{attraction.rating}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${attraction.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
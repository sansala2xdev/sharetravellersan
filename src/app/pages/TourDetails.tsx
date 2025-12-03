'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Check, Calendar, ChevronDown, Minus, Plus, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TourDetailsProps {
  tourId: string;
  onBack?: () => void;
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  province: string;
  city: string;
  district: string;
  base_price: number;
  adult_price: number;
  child_price: number | null;
  max_group_size: number;
  duration: number;
  duration_type: string;
  images: string[];
  available_dates: string[];
  time_slots: { start: string; end: string }[];
  status: string;
  created_at: string;
  provider_id: string;
}

// Mock tour data - you can replace this with actual data fetching
const tourData: any = {
  1: {
    id: 1,
    title: 'Sigiriya Rock Fortress Adventure',
    provider: 'Ceylon Explorers',
    location: 'Central Province, Dambulla',
    rating: 4.8,
    reviewCount: 124,
    duration: '1 day',
    maxGuests: 8,
    price: 75,
    images: [
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80',
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
    ],
    description: 'Experience the breathtaking climb to the ancient Sigiriya Rock Fortress, a UNESCO World Heritage site. Marvel at the ancient frescoes, water gardens, and panoramic views from the summit.',
    included: [
      'Professional guide',
      'Entry tickets',
      'Refreshments',
      'Transportation'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Morning Departure',
        description: 'Pick up from hotel at 6:00 AM',
        time: '6:00 AM'
      },
      {
        day: 'Day 1',
        title: 'Sigiriya Climb',
        description: 'Guided tour and climb to the summit',
        time: '9:00 AM'
      },
      {
        day: 'Day 1',
        title: 'Return Journey',
        description: 'Return to hotel by 2:00 PM',
        time: '2:00 PM'
      }
    ],
    reviews: [
      {
        name: 'Emily Chen',
        rating: 5,
        comment: 'Absolutely incredible experience! Our guide was knowledgeable and the views from the top were breathtaking. Highly recommend!',
        date: '2024-11-10'
      },
      {
        name: 'Michael Brown',
        rating: 4,
        comment: 'Great tour overall. The climb was challenging but worth it. Would have liked more time at the summit.',
        date: '2024-11-05'
      },
      {
        name: 'Sophie Anderson',
        rating: 5,
        comment: 'Perfect day trip! Well organized and our guide made the history come alive. A must-do in Sri Lanka!',
        date: '2024-10-28'
      }
    ]
  },
  2: {
    id: 2,
    title: 'Kandy Cultural Heritage Tour',
    provider: 'Heritage Tours Lanka',
    location: 'Central Province, Kandy',
    rating: 4.9,
    reviewCount: 98,
    duration: '1 day',
    maxGuests: 12,
    price: 60,
    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80'
    ],
    description: 'Discover the rich cultural heritage of Kandy with visits to the Temple of the Tooth, Royal Botanical Gardens, and traditional craft villages.',
    included: [
      'Professional guide',
      'Entry tickets',
      'Lunch',
      'Transportation'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Morning Start',
        description: 'Hotel pickup and journey to Kandy',
        time: '7:00 AM'
      },
      {
        day: 'Day 1',
        title: 'Cultural Tour',
        description: 'Temple of the Tooth and city exploration',
        time: '10:00 AM'
      },
      {
        day: 'Day 1',
        title: 'Return',
        description: 'Return to hotel',
        time: '5:00 PM'
      }
    ],
    reviews: []
  },
  3: {
    id: 3,
    title: 'Mirissa Whale Watching',
    provider: 'Ocean Adventures',
    location: 'Southern Province, Mirissa',
    rating: 4.7,
    reviewCount: 156,
    duration: 'Half day',
    maxGuests: 20,
    price: 45,
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80'
    ],
    description: 'Join us for an unforgettable whale watching experience off the coast of Mirissa. Spot blue whales, dolphins, and other marine life.',
    included: [
      'Professional guide',
      'Boat ride',
      'Breakfast',
      'Life jackets'
    ],
    itinerary: [
      {
        day: 'Day 1',
        title: 'Early Start',
        description: 'Meet at harbor',
        time: '6:00 AM'
      },
      {
        day: 'Day 1',
        title: 'Whale Watching',
        description: 'Ocean expedition',
        time: '6:30 AM'
      },
      {
        day: 'Day 1',
        title: 'Return',
        description: 'Back to harbor',
        time: '11:00 AM'
      }
    ],
    reviews: []
  }
};

const TourDetails: React.FC<TourDetailsProps> = ({ tourId, onBack }) => {
  const supabase = createClient();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [privateGuide, setPrivateGuide] = useState(false);
  const [professionalPhoto, setProfessionalPhoto] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    fetchService();
  }, [tourId]);

  const fetchService = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', tourId)
        .single();

      if (error) {
        console.error('Error fetching service:', error);
      } else {
        console.log('Fetched service data:', data);
        console.log('Service images:', data?.images);
        setService(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service not found</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    let total = service.adult_price * adults;
    if (service.child_price && children > 0) {
      total += service.child_price * children;
    }
    if (privateGuide) total += 50;
    if (professionalPhoto) total += 30;
    return total.toFixed(2);
  };

  const handleBooking = async () => {
    if (!user) {
      alert('Please login to make a booking');
      return;
    }

    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (!service) return;

    setIsBooking(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          service_id: service.id,
          user_id: user.id,
          provider_id: service.provider_id,
          booking_date: selectedDate,
          time_slot: selectedTimeSlot || null,
          adults: adults,
          children: children,
          total_amount: parseFloat(calculateTotal()),
          private_guide: privateGuide,
          professional_photo: professionalPhoto,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        alert('Failed to create booking. Please try again.');
      } else {
        setBookingId(data.id);
        setShowBookingConfirmation(true);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-4">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to tours</span>
          </button>
        )}

        {/* Hero Image */}
        <div className="mb-8">
          {service.images && service.images.length > 0 ? (
            <img 
              src={service.images[0]} 
              alt={service.title}
              className="w-full h-96 object-cover rounded-lg"
              onError={(e) => {
                console.error('Image failed to load:', service.images[0]);
                e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
              }}
            />
          ) : (
            <div className="w-full h-96 bg-linear-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-orange-400 mx-auto mb-2" />
                <p className="text-orange-600 font-medium">No image available</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2">
            {/* Title and Basic Info */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{service.title}</h1>
              <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full mb-4">
                {service.category}
              </span>
              
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{service.city}, {service.province}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">{service.duration} {service.duration_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Max {service.max_group_size} guests</span>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this experience</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
            </div>

            {/* What's Included */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Details</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-900">{service.district}, {service.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Province</p>
                    <p className="font-semibold text-gray-900">{service.province}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{service.duration} {service.duration_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Group Size</p>
                    <p className="font-semibold text-gray-900">Up to {service.max_group_size} people</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Time Slots */}
            {service.time_slots && service.time_slots.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Time Slots</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {service.time_slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTimeSlot(`${slot.start} - ${slot.end}`)}
                      className={`px-4 py-3 rounded-lg border-2 transition ${
                        selectedTimeSlot === `${slot.start} - ${slot.end}`
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-500 hover:border-gray-600 text-gray-700'
                      }`}
                    >
                      {slot.start} - {slot.end}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Image Gallery */}
            {service.images && service.images.length > 1 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${service.title} ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Gallery image failed to load:', image);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews - Coming Soon */}
            {/* TODO: Implement reviews table and fetch reviews
            {service.reviews && service.reviews.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
                <div className="space-y-6">
                  {service.reviews.map((review: any, index: number) => (
                    <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{review.name}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            */}
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">${service.adult_price}</span>
                  <span className="text-gray-600">per adult</span>
                </div>
                {service.child_price && service.child_price > 0 && (
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-semibold text-gray-700">${service.child_price}</span>
                    <span className="text-gray-500 text-sm">per child</span>
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={service.available_dates?.[0] || new Date().toISOString().split('T')[0]}
                    max={service.available_dates?.[service.available_dates.length - 1] || ''}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Adults</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      value={adults}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        setAdults(Math.max(1, Math.min(service.max_group_size - children, value)));
                      }}
                      min="1"
                      max={service.max_group_size - children}
                      className="flex-1 text-center border-0 focus:outline-none text-black"
                    />
                    <button 
                      onClick={() => setAdults(Math.min(service.max_group_size - children, adults + 1))}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Children</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input 
                      type="number" 
                      value={children}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 0;
                        setChildren(Math.max(0, Math.min(service.max_group_size - adults, value)));
                      }}
                      min="0"
                      max={service.max_group_size - adults}
                      className="flex-1 text-center border-0 focus:outline-none text-black"
                    />
                    <button 
                      onClick={() => setChildren(Math.min(service.max_group_size - adults, children + 1))}
                      className="p-2 hover:bg-gray-50 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Group Size Info */}
              <div className="mb-4 text-sm text-gray-600 bg-orange-50 p-3 rounded-lg">
                <p>Maximum group size: {service.max_group_size} people</p>
                <p className="mt-1">Current selection: {adults + children} people</p>
              </div>

              {/* Add-ons - Optional, can be removed or customized */}
              <div className="mb-6 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Private guide (+$50)</span>
                  <input
                    type="checkbox"
                    checked={privateGuide}
                    onChange={(e) => setPrivateGuide(e.target.checked)}
                    className="w-5 h-5 text-orange-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700">Professional photography (+$30)</span>
                  <input
                    type="checkbox"
                    checked={professionalPhoto}
                    onChange={(e) => setProfessionalPhoto(e.target.checked)}
                    className="w-5 h-5 text-orange-500"
                  />
                </label>
              </div>

              {/* Total */}
              <div className="mb-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-orange-600">${calculateTotal()}</span>
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={handleBooking}
                disabled={isBooking || !selectedDate}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold text-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isBooking ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingConfirmation && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowBookingConfirmation(false);
                if (onBack) onBack();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your booking has been successfully confirmed</p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-semibold text-gray-900">{bookingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Service</p>
                    <p className="font-semibold text-gray-900">{service?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  {selectedTimeSlot && (
                    <div>
                      <p className="text-sm text-gray-600">Time Slot</p>
                      <p className="font-semibold text-gray-900">{selectedTimeSlot}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Guests</p>
                    <p className="font-semibold text-gray-900">{adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-orange-600 text-xl">${calculateTotal()}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowBookingConfirmation(false);
                  if (onBack) onBack();
                }}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetails;

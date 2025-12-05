'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Check, Calendar, ChevronDown, Minus, Plus, ArrowLeft, Image as ImageIcon, X, Heart, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

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
  const { addToCart } = useCart();
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
  const [showBookingOptions, setShowBookingOptions] = useState(false);

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

  const handleAddToCart = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    if (!selectedTimeSlot) {
      alert('Please select a time slot');
      return;
    }

    if (!service) return;

    const cartItem = {
      id: `${service.id}-${Date.now()}`,
      serviceId: service.id,
      serviceTitle: service.title,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      adults,
      children,
      adultPrice: service.adult_price,
      childPrice: service.child_price || 0,
      total: parseFloat(calculateTotal()),
      image: service.images && service.images.length > 0 ? service.images[0] : undefined,
    };

    addToCart(cartItem);
    alert('Added to cart successfully!');
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
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to tours</span>
          </button>
        )}

        {/* Title and Rating - Before Images */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{service.title}</h1>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 bg-blue-900 text-white text-xs font-semibold rounded">
                  Top rated
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-gray-900 text-gray-900" />
                  ))}
                  <span className="font-semibold text-gray-900 ml-1">4.9</span>
                </div>
                <a href="#reviews" className="text-gray-700 underline hover:text-gray-900">125 reviews</a>
              </div>
            </div>

            {/* Wishlist and Share buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Heart className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Add to wishlist</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <Share2 className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Share</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <span>•</span>
            <span>Activity provider: {service.provider_id || 'Local Guide'}</span>
          </div>
        </div>

        {/* Main Content Grid - Images/Content on Left, Booking Card on Right */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image Grid */}
            {service.images && service.images.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 h-[400px]">
                {/* Main large image */}
                <div className="col-span-3 row-span-2 relative">
                  <img 
                    src={service.images[0]} 
                    alt={service.title}
                    className="w-full h-full object-cover rounded-l-lg cursor-pointer hover:opacity-90 transition"
                    onError={(e) => {
                      console.error('Image failed to load:', service.images[0]);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                    }}
                  />
                </div>
                
                {/* Small images on the right */}
                {service.images.slice(1, 3).map((image, index) => (
                  <div key={index} className={`col-span-1 relative ${index === 1 ? 'rounded-tr-lg overflow-hidden' : ''}`}>
                    <img 
                      src={image} 
                      alt={`${service.title} ${index + 2}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                      }}
                    />
                  </div>
                ))}
                
                {/* View all photos button overlay */}
                <div className="col-span-1 relative rounded-br-lg overflow-hidden">
                  {service.images[3] ? (
                    <img 
                      src={service.images[3]} 
                      alt={`${service.title} 4`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200"></div>
                  )}
                  <button className="absolute inset-0 bg-black/50 hover:bg-black/60 transition flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-semibold">View all</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-orange-400 mx-auto mb-2" />
                  <p className="text-orange-600 font-medium">No image available</p>
                </div>
              </div>
            )}

            {/* Booking Options - Appears when date is selected */}
            {selectedDate && (
              <div className="mb-8 animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose from available options</h2>
                
                <div className="border-2 border-blue-500 rounded-lg overflow-hidden">
                  <div className="bg-white">
                    <button className="w-full p-6 text-left hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-lg flex-1 pr-4">
                          {service.title}
                        </h3>
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 transform rotate-180" />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} {service.duration_type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Guide: English</span>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="underline cursor-pointer hover:text-gray-900">View pickup area</span>
                        </div>
                        <p className="ml-6 text-xs text-gray-500 mt-1">
                          Check to see if your accommodation is within the eligible area for pickup.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4" />
                        <span>Small group</span>
                      </div>

                      <div className="text-sm text-gray-600 mb-4">
                        Limited to {service.max_group_size} participants
                      </div>
                    </button>

                    {/* Time Slots Section */}
                    <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Select a starting time</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                      
                      {service.time_slots && service.time_slots.length > 0 ? (
                        <div className="flex gap-3 mb-4">
                          {service.time_slots.map((slot, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedTimeSlot(`${slot.start}`)}
                              className={`px-6 py-2 rounded-full border-2 text-sm font-medium transition ${
                                selectedTimeSlot === `${slot.start}`
                                  ? 'border-gray-900 bg-gray-900 text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                              }`}
                            >
                              {slot.start}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-3 mb-4">
                          <button
                            onClick={() => setSelectedTimeSlot('7:30 AM')}
                            className={`px-6 py-2 rounded-full border-2 text-sm font-medium transition ${
                              selectedTimeSlot === '7:30 AM'
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            7:30 AM
                          </button>
                          <button
                            onClick={() => setSelectedTimeSlot('7:45 AM')}
                            className={`px-6 py-2 rounded-full border-2 text-sm font-medium transition ${
                              selectedTimeSlot === '7:45 AM'
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            7:45 AM
                          </button>
                        </div>
                      )}

                      {/* Price and Booking Info */}
                      <div className="mb-4">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          ${(service.adult_price * adults + (service.child_price || 0) * children).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {adults} Adult{adults > 1 ? 's' : ''} x ${service.adult_price.toFixed(2)}
                          {children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''} x $${service.child_price?.toFixed(2)}`}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          All taxes and fees included
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={handleBooking}
                          disabled={isBooking || !selectedTimeSlot}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {isBooking ? 'Processing...' : 'Book now'}
                        </button>
                        <button
                          onClick={handleAddToCart}
                          disabled={!selectedTimeSlot}
                          className="flex-1 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* About */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this experience</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{service.description}</p>
            </div>

            {/* About this activity */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free cancellation</p>
                    <p className="text-gray-600">Cancel up to 24 hours in advance for a full refund</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Reserve now & pay later</p>
                    <p className="text-gray-600">Keep your travel plans flexible — book your spot and pay nothing today.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Duration {service.duration} {service.duration_type}</p>
                    <p className="text-gray-600">Check availability to see starting times.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Driver</p>
                    <p className="text-gray-600">English</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pickup included</p>
                    <p className="text-gray-600">Please wait in the hotel lobby from 10 minutes before your scheduled pickup time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Small group</p>
                    <p className="text-gray-600">Limited to {service.max_group_size} participants</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlighted Reviews */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlighted reviews from other travelers</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 font-semibold">5</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Absolutely incredible experience! Our guide was knowledgeable and the views from the top were breathtaking. Highly recommend!"
                  </p>
                  <p className="text-sm text-gray-500">Emily Chen • November 2024</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 font-semibold">5</span>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Perfect day trip! Well organized and our guide made the history come alive. A must-do in Sri Lanka!"
                  </p>
                  <p className="text-sm text-gray-500">Sophie Anderson • October 2024</p>
                </div>
              </div>
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

          {/* Right Column - STICKY Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
              {/* Booking Card */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                {/* Price Header */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-gray-900">${service.adult_price}</span>
                    <span className="text-gray-600">per adult</span>
                  </div>
                  {service.child_price && service.child_price > 0 && (
                    <p className="text-sm text-gray-600">${service.child_price} per child</p>
                  )}
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    min={service.available_dates && service.available_dates.length > 0 ? service.available_dates[0] : new Date().toISOString().split('T')[0]}
                    max={service.available_dates && service.available_dates.length > 0 ? service.available_dates[service.available_dates.length - 1] : ''}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setShowBookingOptions(true);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                {/* Guest Selection - Always visible with side-by-side layout */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Adults */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Adults
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={service.max_group_size - children}
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, Math.min(service.max_group_size - children, parseInt(e.target.value) || 1)))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-center"
                      />
                    </div>

                    {/* Children */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Children
                      </label>
                      <input
                        type="number"
                        min="0"
                        max={service.max_group_size - adults}
                        value={children}
                        onChange={(e) => setChildren(Math.max(0, Math.min(service.max_group_size - adults, parseInt(e.target.value) || 0)))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 text-center"
                      />
                    </div>
                  </div>
                  
                  {/* Group size info */}
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Maximum group size: <span className="font-semibold">{service.max_group_size} people</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      Current selection: <span className="font-semibold">{adults + children} people</span>
                    </p>
                  </div>
                </div>

                {/* Show free cancellation info when date selected */}
                {selectedDate && (
                  <div className="animate-fadeIn">
                    {/* Free Cancellation */}
                    <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                      <p className="font-medium text-green-600 mb-1">Free cancellation</p>
                      <p>Cancel up to 24 hours in advance for a full refund</p>
                    </div>
                  </div>
                )}
              </div>
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

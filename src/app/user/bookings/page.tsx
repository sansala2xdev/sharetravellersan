'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import { Calendar, MapPin, Users, Clock, DollarSign, CheckCircle } from 'lucide-react';

interface Booking {
  id: string;
  service_id: string;
  booking_date: string;
  time_slot: string | null;
  adults: number;
  children: number;
  total_amount: number;
  private_guide: boolean;
  professional_photo: boolean;
  status: string;
  created_at: string;
  services: {
    title: string;
    city: string;
    province: string;
    category: string;
    duration: number;
    duration_type: string;
    images: string[];
  };
}

export default function UserBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          services(title, city, province, category, duration, duration_type, images)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingBookings(false);
    }
  };

  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">View and manage your booking history</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">Start exploring and book your first experience!</p>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
            >
              Explore Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-64 h-48 md:h-auto">
                    {booking.services.images && booking.services.images.length > 0 ? (
                      <img
                        src={booking.services.images[0]}
                        alt={booking.services.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <p className="text-orange-600 font-medium">No image</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.services.title}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                          {booking.services.category}
                        </span>
                      </div>
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {booking.time_slot && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{booking.time_slot}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{booking.services.city}, {booking.services.province}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">
                          {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                          {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                        </span>
                      </div>
                    </div>

                    {/* Add-ons */}
                    {(booking.private_guide || booking.professional_photo) && (
                      <div className="mb-4 flex gap-2">
                        {booking.private_guide && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Private Guide
                          </span>
                        )}
                        {booking.professional_photo && (
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Professional Photo
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Booking ID</p>
                        <p className="text-sm font-mono text-gray-700">{booking.id.slice(0, 13)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ${parseFloat(booking.total_amount.toString()).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

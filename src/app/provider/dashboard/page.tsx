'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { Package, Calendar, DollarSign, Users, MapPin, Edit, Trash2, ClipboardList } from 'lucide-react'

interface Service {
  id: string
  title: string
  description: string
  category: string
  province: string
  city: string
  base_price: number
  adult_price: number
  status: string
  images: string[]
  created_at: string
}

interface Booking {
  id: string
  service_id: string
  user_id: string
  booking_date: string
  time_slot: string | null
  adults: number
  children: number
  total_amount: number
  private_guide: boolean
  professional_photo: boolean
  status: string
  created_at: string
  services: {
    title: string
  }
  profiles: {
    full_name: string | null
    email: string
  }
}

export default function ProviderDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [services, setServices] = useState<Service[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'bookings'>('services')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/provider/auth')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchServices()
      fetchBookings()
    }
  }, [user])

  const fetchServices = async () => {
    if (!user) return
    
    setLoadingServices(true)
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching services:', error)
      } else {
        setServices(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchBookings = async () => {
    if (!user) return
    
    setLoadingBookings(true)
    try {
      console.log('Fetching bookings for provider:', user.id)
      
      // First fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          services!inner(title)
        `)
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false })

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError)
        console.error('Error details:', bookingsError.message)
      } else {
        console.log('Fetched bookings:', bookingsData)
        
        // Fetch user profiles separately
        if (bookingsData && bookingsData.length > 0) {
          const userIds = [...new Set(bookingsData.map(b => b.user_id))]
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds)
          
          // Merge profiles into bookings
          const bookingsWithProfiles = bookingsData.map(booking => ({
            ...booking,
            profiles: profilesData?.find(p => p.id === booking.user_id) || { full_name: null, email: null }
          }))
          
          setBookings(bookingsWithProfiles)
        } else {
          setBookings(bookingsData || [])
        }
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)

      if (error) {
        console.error('Error deleting service:', error)
        alert('Failed to delete service. Please try again.')
      } else {
        // Remove from local state
        setServices(services.filter(s => s.id !== serviceId))
        alert('Service deleted successfully!')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <button
            onClick={() => router.push('/provider/onboarding')}
            className="bg-orange-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Add New Service
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Services</h3>
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{services.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${bookings.reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Customers</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{new Set(bookings.map(b => b.user_id)).size}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'services'
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                My Services
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-orange-600 text-orange-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ClipboardList className="w-5 h-5 inline mr-2" />
                Bookings ({bookings.length})
              </button>
            </div>
          </div>
        </div>

        {/* Services Tab Content */}
        {activeTab === 'services' && (
          <>
            {loadingServices ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Services Yet</h2>
                <p className="text-gray-600 mb-6">
                  Get started by creating your first service listing
                </p>
                <button
                  onClick={() => router.push('/provider/onboarding')}
                  className="bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  Create Your First Service
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                  {service.images && service.images.length > 0 && (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        service.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{service.city}, {service.province}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs text-gray-500">From</p>
                        <p className="text-xl font-bold text-orange-600">${service.base_price}</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </>
        )}

        {/* Bookings Tab Content */}
        {activeTab === 'bookings' && (
          <>
            {loadingBookings ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Yet</h2>
                <p className="text-gray-600">Bookings will appear here once customers book your services</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                              {booking.id.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.services?.title || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {booking.profiles?.full_name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">{booking.profiles?.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.booking_date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                              {booking.time_slot && (
                                <div className="text-sm text-gray-500">{booking.time_slot}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {booking.adults} Adult{booking.adults > 1 ? 's' : ''}
                              {booking.children > 0 && `, ${booking.children} Child${booking.children > 1 ? 'ren' : ''}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              ${parseFloat(booking.total_amount.toString()).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                booking.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

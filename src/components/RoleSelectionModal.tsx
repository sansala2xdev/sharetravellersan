'use client'

import { useRouter } from 'next/navigation'
import { X, User, Building2 } from 'lucide-react'

interface RoleSelectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RoleSelectionModal({ isOpen, onClose }: RoleSelectionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const handleRoleSelection = (role: 'user' | 'provider') => {
    onClose()
    if (role === 'user') {
      router.push('/user/auth')
    } else {
      router.push('/provider/auth')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <p className="text-center text-gray-600 mb-8">
            Select how you'd like to use ShareTraveller
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* User Card */}
            <button
              onClick={() => handleRoleSelection('user')}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 p-8 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Traveler</h3>
                <p className="text-gray-600 mb-4">
                  Explore tours, book experiences, and discover amazing places across Sri Lanka
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Browse tours and activities
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Book experiences instantly
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Read reviews and ratings
                  </li>
                </ul>
              </div>
            </button>

            {/* Provider Card */}
            <button
              onClick={() => handleRoleSelection('provider')}
              className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 p-8 text-left group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">I'm a Provider</h3>
                <p className="text-gray-600 mb-4">
                  Share your services, manage bookings, and grow your tourism business
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    List your tours and services
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Manage bookings and availability
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Grow your business
                  </li>
                </ul>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

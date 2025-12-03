'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Globe, User, ChevronDown, Menu, LogIn, LogOut, Bell, Sun, HelpCircle, Smartphone, ChevronRight, Home, UserCircle, Edit, ClipboardList } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RoleSelectionModal from './RoleSelectionModal';

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPlacesMenu, setShowPlacesMenu] = useState(false);
  
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-orange-500">
                SHARE<br/>TRAVELLER
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className="flex items-center text-gray-700 hover:text-orange-500 transition"
                onClick={() => router.push('/')}
              >
                <Home className="mr-1 w-4 h-4" /> Home
              </button>
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-orange-500 transition"
                  onClick={() => setShowPlacesMenu(!showPlacesMenu)}
                >
                  Places to see <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {/* Places to see Dropdown */}
                {showPlacesMenu && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button 
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      onClick={() => {
                        router.push('/all-services');
                        setShowPlacesMenu(false);
                      }}
                    >
                      Sri Lanka
                    </button>
                  </div>
                )}
              </div>
              <button className="flex items-center text-gray-700 hover:text-orange-500 transition">
                Things to do <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <button className="flex items-center text-gray-700 hover:text-orange-500 transition">
                Trip inspiration <ChevronDown className="ml-1 w-4 h-4" />
              </button>
            </nav>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
                <Heart className="w-5 h-5" />
                <span className="text-xs mt-1">Wishlist</span>
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs mt-1">Cart</span>
              </button>
              <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
                <Globe className="w-5 h-5" />
                <span className="text-xs mt-1">EN/MYR RM</span>
              </button>
              <div className="relative">
                <button 
                  className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <User className="w-5 h-5" />
                  <span className="text-xs mt-1">
                    {user ? (
                      user.user_metadata?.full_name?.split(' ')[0] || 
                      user.user_metadata?.name?.split(' ')[0] || 
                      user.email?.split('@')[0] || 
                      'Profile'
                    ) : 'Profile'}
                  </span>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      {user ? (
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {user.user_metadata?.full_name || 
                             user.user_metadata?.name || 
                             user.email?.split('@')[0] || 
                             'User'}
                          </h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      ) : (
                        <h3 className="font-semibold text-lg text-gray-900">Profile</h3>
                      )}
                    </div>
                    
                    {!user ? (
                      <button 
                        className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition"
                        onClick={() => {
                          setShowRoleModal(true);
                          setShowProfileMenu(false);
                        }}
                      >
                        <LogIn className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-gray-700 font-medium">Log in or sign up</span>
                      </button>
                    ) : (
                      <>
                        {/* View Profile (includes edit functionality) */}
                        <button 
                          className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition"
                          onClick={() => {
                            router.push('/user/profile');
                            setShowProfileMenu(false);
                          }}
                        >
                          <UserCircle className="w-5 h-5 text-gray-600 mr-3" />
                          <span className="text-gray-700 font-medium">My Profile</span>
                        </button>

                        {/* Booking History */}
                        <button 
                          className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition"
                          onClick={() => {
                            router.push('/user/bookings');
                            setShowProfileMenu(false);
                          }}
                        >
                          <ClipboardList className="w-5 h-5 text-gray-600 mr-3" />
                          <span className="text-gray-700 font-medium">My Bookings</span>
                        </button>

                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Sign Out */}
                        <button 
                          className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition"
                          onClick={() => {
                            signOut();
                            setShowProfileMenu(false);
                          }}
                        >
                          <LogOut className="w-5 h-5 text-gray-600 mr-3" />
                          <span className="text-gray-700 font-medium">Sign out</span>
                        </button>
                      </>
                    )}

                    <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <Bell className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-gray-700">Updates</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                      <div className="flex items-center">
                        <Sun className="w-5 h-5 text-gray-600 mr-3" />
                        <span className="text-gray-700">Appearance</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Always light</span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </button>

                    <button className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition">
                      <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-700">Support</span>
                    </button>

                    <button className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition">
                      <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-700">Download the app</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Role Selection Modal */}
      <RoleSelectionModal isOpen={showRoleModal} onClose={() => setShowRoleModal(false)} />
    </>
  );
}

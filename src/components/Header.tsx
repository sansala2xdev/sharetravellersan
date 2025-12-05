'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Globe, User, ChevronDown, Menu, LogIn, LogOut, Bell, Sun, HelpCircle, Smartphone, ChevronRight, Home, UserCircle, Edit, ClipboardList, X, Calendar, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import RoleSelectionModal from './RoleSelectionModal';

export default function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPlacesMenu, setShowPlacesMenu] = useState(false);
  const [showThingsMenu, setShowThingsMenu] = useState(false);
  const [showInterestsMenu, setShowInterestsMenu] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  
  const { user, signOut } = useAuth();
  const { cartCount, cartItems, removeFromCart, cartTotal } = useCart();
  const router = useRouter();

  const thingsToDoCategories = [
    { name: 'Adventure', icon: '🏔️' },
    { name: 'Wildlife', icon: '🐘' },
    { name: 'Cultural', icon: '🏛️' },
    { name: 'Beach & Relaxation', icon: '🏖️' },
    { name: 'City Tour', icon: '🏙️' },
    { name: 'Hiking', icon: '🥾' },
    { name: 'Water Sports', icon: '🏄' },
    { name: 'Photography', icon: '📸' },
    { name: 'Food & Culinary', icon: '🍽️' },
    { name: 'Historical Sites', icon: '🏰' },
  ];

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
                 Home
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
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-orange-500 transition"
                  onClick={() => setShowThingsMenu(!showThingsMenu)}
                >
                  Things to do <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {/* Things to do Dropdown */}
                {showThingsMenu && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 px-4 z-50">
                    <div className="grid grid-cols-2 gap-2">
                      {thingsToDoCategories.map((category) => (
                        <button
                          key={category.name}
                          className="flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition rounded-md"
                          onClick={() => {
                            router.push(`/all-services?category=${encodeURIComponent(category.name)}`);
                            setShowThingsMenu(false);
                          }}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="text-sm">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button 
                  className="flex items-center text-gray-700 hover:text-orange-500 transition"
                  onClick={() => setShowInterestsMenu(!showInterestsMenu)}
                >
                  My Interests <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                
                {/* My Interests Dropdown */}
                {showInterestsMenu && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <button 
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      onClick={() => {
                        router.push('/user-home');
                        setShowInterestsMenu(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Personalized Recommendations</span>
                        <span className="text-xs text-gray-500 mt-1">Based on your interests</span>
                      </div>
                    </button>
                    <button 
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition"
                      onClick={() => {
                        router.push('/user/onboarding');
                        setShowInterestsMenu(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">Update Interests</span>
                        <span className="text-xs text-gray-500 mt-1">Change your preferences</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-6">
              <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
                <Heart className="w-5 h-5" />
                <span className="text-xs mt-1">Wishlist</span>
              </button>
              <button 
                className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition relative"
                onClick={() => setShowCartModal(true)}
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Cart</span>
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

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Cart ({cartCount})</h2>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add some tours to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex gap-4">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.serviceTitle}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{item.serviceTitle}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{item.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>
                                {item.adults} Adult{item.adults > 1 ? 's' : ''}
                                {item.children > 0 && `, ${item.children} Child${item.children > 1 ? 'ren' : ''}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">${item.total.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">All taxes included</div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

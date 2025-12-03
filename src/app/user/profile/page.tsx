'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

export default function UserProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    address: '',
    city: '',
    province: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          province: data.province || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      } else {
        alert('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingProfile) {
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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{profile?.full_name || 'User'}</h1>
                  <p className="text-orange-100 mt-1">{user.email}</p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: profile?.full_name || '',
                        phone: profile?.phone || '',
                        address: profile?.address || '',
                        city: profile?.city || '',
                        province: profile?.province || ''
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {profile?.full_name || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {profile?.phone || 'Not provided'}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                    {profile?.address || 'Not provided'}
                  </p>
                )}
              </div>

              {/* City & Province */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                      {profile?.city || 'Not provided'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                      placeholder="Enter your province"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                      {profile?.province || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              {/* Account Info */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Member Since
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { Check } from 'lucide-react'

const INTERESTS = [
  { id: 'Adventure', name: 'Adventure', icon: '🏔️' },
  { id: 'Wildlife', name: 'Wildlife', icon: '🦁' },
  { id: 'Hiking', name: 'Hiking', icon: '🥾' },
  { id: 'City Tour', name: 'City Tour', icon: '🏙️' },
  { id: 'Water Sports', name: 'Water Sports', icon: '🏄' },
  { id: 'Cultural', name: 'Cultural', icon: '🕌' },
  { id: 'Beach & Relaxation', name: 'Beach & Relaxation', icon: '🏖️' },
  { id: 'Photography', name: 'Photography', icon: '📸' },
  { id: 'Food & Culinary', name: 'Food & Culinary', icon: '🍛' },
  { id: 'Wellness & Spa', name: 'Wellness & Spa', icon: '🧘' },
  { id: 'Historical Sites', name: 'Historical Sites', icon: '🏛️' },
  { id: 'Nature & Eco', name: 'Nature & Eco', icon: '🌿' },
]

export default function UserOnboardingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/user/auth')
      return
    }
    
    // Set role to regular_user when they land on this page
    setUserRole()
  }, [user])

  const setUserRole = async () => {
    if (!user) return

    await supabase
      .from('profiles')
      .update({ role: 'regular_user' })
      .eq('id', user.id)
  }

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    )
  }

  const handleContinue = async () => {
    if (selectedInterests.length === 0 || !user) return

    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'regular_user',
        interests: selectedInterests,
        onboarding_completed: true,
      })
      .eq('id', user.id)

    if (error) {
      console.error('Error saving interests:', error)
      setLoading(false)
      return
    }

    // Verify the update was successful
    const { data } = await supabase
      .from('profiles')
      .select('onboarding_completed, interests')
      .eq('id', user.id)
      .single()

    console.log('Updated profile:', data)

    // Wait a bit to ensure database is updated, then redirect
    setTimeout(() => {
      window.location.href = '/user/dashboard'
    }, 500)
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              What interests you?
            </h2>
            <p className="text-gray-600">
              Select your interests to get personalized tour recommendations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {INTERESTS.map((interest) => (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`relative p-6 rounded-lg border-2 transition-all ${
                  selectedInterests.includes(interest.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {selectedInterests.includes(interest.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="text-4xl mb-2">{interest.icon}</div>
                <div className="font-semibold text-gray-900">{interest.name}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0 || loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

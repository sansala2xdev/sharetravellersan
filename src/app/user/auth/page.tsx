'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import { User } from 'lucide-react'

export default function UserAuthPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      // Check if user already has role set
      checkUserRole()
    }
  }, [user])

  const checkUserRole = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('role, onboarding_completed, interests')
      .eq('id', user.id)
      .single()

    if (data?.role === 'regular_user' && data?.onboarding_completed && data?.interests && data.interests.length > 0) {
      router.push('/user/home')
    } else if (data?.role === 'regular_user') {
      router.push('/user/onboarding')
    } else {
      // No role set yet, will be set on onboarding page
      router.push('/user/onboarding')
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/user/onboarding`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
      <Header />

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Traveler!</h2>
            <p className="text-gray-600 text-center mb-8">
              Sign in to explore tours, book experiences, and discover amazing places across Sri Lanka
            </p>

            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

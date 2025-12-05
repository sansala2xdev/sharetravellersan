'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import UserHome from '@/app/pages/UserHome'

export default function UserHomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!loading && !user) {
        router.push('/user/auth')
        return
      }

      if (user) {
        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        if (profile && !profile.onboarding_completed) {
          // First time user - redirect to onboarding
          router.push('/user/onboarding')
        } else {
          // User has completed onboarding - show home page
          setCheckingOnboarding(false)
        }
      }
    }

    checkOnboardingStatus()
  }, [user, loading, router, supabase])

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <UserHome />
}

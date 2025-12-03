'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import ServiceProviderOnboarding from '@/components/ServiceProviderOnboarding'

export default function ProviderOnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/provider/auth')
      return
    }
    
    if (user) {
      setUserRole()
    }
  }, [user, loading])

  const setUserRole = async () => {
    if (!user) return

    await supabase
      .from('profiles')
      .update({ role: 'service_provider' })
      .eq('id', user.id)
  }

  const handleOnboardingComplete = () => {
    // Redirect to provider dashboard after successful onboarding
    router.push('/provider/dashboard')
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

  return <ServiceProviderOnboarding onComplete={handleOnboardingComplete} />
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import UserHome from '@/app/pages/UserHome'

export default function UserHomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/user/auth')
      return
    }

    // Always redirect to interests selection on every login
    // This allows users to update their interests each time
    if (user) {
      router.push('/user/onboarding')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <UserHome />
}

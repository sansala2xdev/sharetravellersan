'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import UserHome from '../pages/UserHome';

export default function UserHomePage() {
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const handleLogin = () => {
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <UserHome user={user} onSignOut={handleSignOut} onLogin={handleLogin} />;
}

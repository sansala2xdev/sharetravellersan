'use client';

import { Suspense } from 'react';
import AllServices from '@/app/pages/AllServices';

function AllServicesContent() {
  return <AllServices />;
}

export default function AllServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <AllServicesContent />
    </Suspense>
  );
}

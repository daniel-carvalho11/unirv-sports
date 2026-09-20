'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ModalitiesSection } from '@/components/ModalitiesSection';
import { NextMatchesSection } from '@/components/NextMatchesSection';

export default function Home() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'register' }>({
    isOpen: false,
    type: 'login',
  });

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthModal({ isOpen: true, type });
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar onOpenAuth={handleOpenAuth} />
      <HeroSection onOpenAuth={handleOpenAuth} />
      <ModalitiesSection />
      <NextMatchesSection />
    </main>
  );
}
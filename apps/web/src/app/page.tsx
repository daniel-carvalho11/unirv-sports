'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ModalitiesSection } from '@/components/ModalitiesSection';
import { NextMatchesSection } from '@/components/NextMatchesSection';
import { LeaderboardSection } from '@/components/LeaderboardSection';
import { AthleticsGridSection } from '@/components/AthleticsGridSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'register' }>({
    isOpen: false,
    type: 'login',
  });

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthModal({ isOpen: type === 'register' ? true : true, type });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar onOpenAuth={handleOpenAuth} />
      <HeroSection onOpenAuth={handleOpenAuth} />
      <ModalitiesSection />
      <NextMatchesSection />
      <LeaderboardSection />
      <AthleticsGridSection />
      <Footer />
    </main>
  );
}
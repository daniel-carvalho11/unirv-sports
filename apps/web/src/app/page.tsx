'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ModalitiesSection } from '@/components/ModalitiesSection';
import { NextMatchesSection } from '@/components/NextMatchesSection';
import { LeaderboardSection } from '@/components/LeaderboardSection';
import { AthleticsGridSection } from '@/components/AthleticsGridSection';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';

export default function Home() {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: 'login' | 'register' }>({
    isOpen: false,
    type: 'login',
  });

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthModal({ isOpen: true, type });
  };

  const handleCloseAuth = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
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

      <AuthModal
        isOpen={authModal.isOpen}
        type={authModal.type}
        onClose={handleCloseAuth}
        onSwitchType={(type) => setAuthModal({ isOpen: true, type })}
      />
    </main>
  );
}
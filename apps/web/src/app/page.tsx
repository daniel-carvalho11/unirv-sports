'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { ModalitiesSection } from '@/components/ModalitiesSection';
import { NextMatchesSection } from '@/components/NextMatchesSection';
import { LiveFeedSection } from '@/components/LiveFeedSection';
import { AthleticsGridSection } from '@/components/AthleticsGridSection';
import { Footer } from '@/components/Footer';
import { AuthModal } from '@/components/AuthModal';
import { CountdownTimer } from '@/components/CountDownTimer';

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
      
      <section className="max-w-7xl mx-auto px-6 py-6">
        <CountdownTimer
          targetDate="2026-10-15T09:00:00"
          title="Abertura Oficial dos Jogos Universitários UniRV"
        />
      </section>

      <ModalitiesSection />
      <NextMatchesSection />
      <LiveFeedSection />
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
'use client';

import React from 'react';

interface HeroSectionProps {
  onOpenAuth: (type: 'login' | 'register') => void;
}

export function HeroSection({ onOpenAuth }: HeroSectionProps) {
  return (
    <section className="hero-gradient text-white pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Elemento de iluminação de fundo */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-unirv-green/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="inline-flex items-center gap-2 bg-white/10 text-unirv-green text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-unirv-green animate-pulse" />
          Plataforma Oficial UniRV Esportes
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          Acompanhe os Jogos e <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-unirv-green">
            Torneios Universitários
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Tabelas em tempo real, classificação das atléticas, dados dos atletas e cobertura completa dos campeonatos.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuth('register')}
            className="w-full sm:w-auto bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-unirv-green/20 hover:scale-105 active:scale-95"
          >
            Cadastrar Atlética / Perfil
          </button>
          <button
            onClick={() => onOpenAuth('login')}
            className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-200 hover:border-white/40"
          >
            Entrar na Conta
          </button>
        </div>
      </div>
    </section>
  );
}
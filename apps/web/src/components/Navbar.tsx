'use client';

import React from 'react';

interface NavbarProps {
  onOpenAuth: (type: 'login' | 'register') => void;
}

export function Navbar({ onOpenAuth }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-unirv-dark-navy/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-wider text-white">
            UniRV <span className="text-unirv-green">Esportes</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <a href="#modalidades" className="hover:text-white transition-colors">Modalidades</a>
          <a href="#jogos" className="hover:text-white transition-colors">Próximos Jogos</a>
          <a href="#classificacao" className="hover:text-white transition-colors">Classificação</a>
          <a href="#atleticas" className="hover:text-white transition-colors">Atléticas</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="text-sm font-semibold text-white hover:text-unirv-green transition-colors px-3 py-1.5"
          >
            Entrar
          </button>
          <button
            onClick={() => onOpenAuth('register')}
            className="text-sm font-bold bg-unirv-green hover:bg-unirv-mid-green text-slate-900 px-4 py-2 rounded-lg transition-all"
          >
            Cadastrar
          </button>
        </div>
      </div>
    </header>
  );
}
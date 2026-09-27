'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-4 border-t border-slate-800 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <span className="text-lg font-black tracking-wider text-white block mb-1">
            UniRV <span className="text-unirv-green">Esportes</span>
          </span>
          <p className="text-slate-500">
            Plataforma oficial de acompanhamento e gestão dos jogos universitários.
          </p>
        </div>
        <p className="text-slate-500">
          © 2026 UniRV Esportes. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
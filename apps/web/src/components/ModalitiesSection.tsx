'use client';

import React from 'react';

const modalities = [
  { name: 'Futsal', icon: '⚽', teams: '16 Atléticas' },
  { name: 'Vôlei', icon: '🏐', teams: '12 Atléticas' },
  { name: 'Basquete', icon: '🏀', teams: '8 Atléticas' },
  { name: 'Handebol', icon: '🤾', teams: '10 Atléticas' },
  { name: 'Beach Tennis', icon: '🎾', teams: '14 Atléticas' },
  { name: 'Natação', icon: '🏊', teams: 'Individual / Equipes' },
];

export function ModalitiesSection() {
  return (
    <section id="modalidades" className="py-20 px-4 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Modalidades em Disputa
          </h2>
          <p className="text-slate-400 mt-2 font-medium">
            Acompanhe a cobertura completa por categoria esportiva
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {modalities.map((item, index) => (
            <div
              key={index}
              className="bg-slate-800/50 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/60 hover:border-unirv-green transition-all duration-300 text-center group cursor-pointer hover:-translate-y-1 shadow-lg"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-unirv-green transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {item.teams}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
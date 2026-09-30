'use client';

import { UNIRV_ATHLETICS } from '@/lib/athletics';

export function AthleticsGridSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-black text-white">Atléticas Participantes</h2>
        <p className="text-xs md:text-sm text-slate-400">
          Conheça as atléticas oficiais dos cursos da UniRV que disputam os torneios.
        </p>
      </div>z

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
        {UNIRV_ATHLETICS.map((ath) => (
          <div
            key={ath.id}
            className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-unirv-green/50 transition-all duration-200"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-unirv-green rounded-md">
                {ath.acronym}
              </span>
              <h3 className="text-sm font-black text-white mt-3">{ath.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{ath.course}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500">{ath.instagram}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
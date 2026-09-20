'use client';

import React from 'react';

const mockMatches = [
  {
    id: 1,
    sport: 'Futsal Masculino',
    time: 'Sábado, 14:00',
    location: 'Ginásio Campus Rio Verde',
    teamA: 'FAMERV (Medicina)',
    teamB: 'GRIFO (Engenharia)',
  },
  {
    id: 2,
    sport: 'Vôlei Feminino',
    time: 'Sábado, 15:30',
    location: 'Ginásio Campus Rio Verde',
    teamA: 'DIREITO UniRV',
    teamB: 'ODONTO UniRV',
  },
];

export function NextMatchesSection() {
  return (
    <section id="jogos" className="py-20 px-4 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Próximos Confrontos
          </h2>
          <p className="text-slate-400 mt-1 font-medium">
            Fique por dentro das datas e horários da rodada
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockMatches.map((match) => (
            <div
              key={match.id}
              className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-400 mb-6 pb-4 border-b border-slate-800">
                <span className="text-unirv-green uppercase tracking-wider font-extrabold bg-unirv-green/10 px-2.5 py-1 rounded-md border border-unirv-green/20">
                  {match.sport}
                </span>
                <span>{match.time} • {match.location}</span>
              </div>

              <div className="flex items-center justify-between my-2 text-center">
                <div className="flex-1">
                  <span className="block font-black text-lg text-white">
                    {match.teamA}
                  </span>
                </div>
                <div className="px-4 text-unirv-green font-black text-sm bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  VS
                </div>
                <div className="flex-1">
                  <span className="block font-black text-lg text-white">
                    {match.teamB}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
'use client';

import React from 'react';

// Estrutura que será alimentada via WebSocket no futuro
interface LiveMatch {
  id: string;
  sport: string;
  atl1: string;
  atl2: string;
  score1: number;
  score2: number;
  status: 'LIVE' | 'SCHEDULED' | 'FINISHED';
  timeInfo: string; // Ex: "2º Tempo", "18:00", "Encerrado"
}

const mockFeedMatches: LiveMatch[] = [
  {
    id: '1',
    sport: 'Futsal Masculino',
    atl1: 'FAMERV',
    atl2: 'GRIFO',
    score1: 3,
    score2: 2,
    status: 'LIVE',
    timeInfo: '2º Tempo - 12\'',
  },
  {
    id: '2',
    sport: 'Vôlei Feminino',
    atl1: 'MARFIM',
    atl2: 'CERBERUS',
    score1: 1,
    score2: 0,
    status: 'LIVE',
    timeInfo: 'Set 2',
  },
  {
    id: '3',
    sport: 'Handebol Masculino',
    atl1: 'FÚRIA',
    atl2: 'ENTORSE',
    score1: 14,
    score2: 18,
    status: 'FINISHED',
    timeInfo: 'Encerrado',
  },
];

export function LiveFeedSection() {
  return (
    <section id="ao-vivo" className="py-20 px-4 bg-unirv-dark-navy text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Feed em Tempo Real (WebSocket)
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Acompanhe a Rodada
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-2 md:mt-0">
            Atualizações instantâneas do placar das Atléticas
          </p>
        </div>

        {/* Grid de Feed em Placar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockFeedMatches.map((match) => (
            <div
              key={match.id}
              className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between"
            >
              {/* Badge de Status */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-unirv-green">
                  {match.sport}
                </span>

                {match.status === 'LIVE' ? (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                    {match.timeInfo}
                  </span>
                ) : (
                  <span className="bg-slate-800 text-slate-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                    {match.timeInfo}
                  </span>
                )}
              </div>

              {/* Placar Central */}
              <div className="flex items-center justify-between my-2">
                <div className="text-center flex-1">
                  <span className="block font-black text-lg text-white">{match.atl1}</span>
                </div>

                <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 font-black text-xl tracking-widest text-unirv-green mx-2">
                  {match.score1} : {match.score2}
                </div>

                <div className="text-center flex-1">
                  <span className="block font-black text-lg text-white">{match.atl2}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-medium">
                <span>Atléticas vinculadas aos perfis</span>
                <span className="text-unirv-green">Ao Vivo</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
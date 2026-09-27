'use client';

import React from 'react';

const mockStandings = [
  { rank: 1, name: 'Atlética Medicina (FAMERV)', points: 48, wins: 15, draws: 3, losses: 2 },
  { rank: 2, name: 'Atlética Direito (GRIFO)', points: 42, wins: 13, draws: 3, losses: 4 },
  { rank: 3, name: 'Atlética Engenharia (CERBERUS)', points: 39, wins: 12, draws: 3, losses: 5 },
  { rank: 4, name: 'Atlética Agronomia (FÚRIA)', points: 35, wins: 11, draws: 2, losses: 7 },
  { rank: 5, name: 'Atlética Odontologia (MARFIM)', points: 31, wins: 9, draws: 4, losses: 7 },
];

export function LeaderboardSection() {
  return (
    <section id="classificacao" className="py-20 px-4 bg-unirv-dark-navy text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-unirv-green block mb-1">
            Tabela em Tempo Real
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Classificação Geral
          </h2>
        </div>

        <div className="bg-slate-900/80 rounded-2xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase font-bold text-slate-400 bg-white/5">
                  <th className="py-4 px-6 w-20 text-center">Pos</th>
                  <th className="py-4 px-6">Atlética</th>
                  <th className="py-4 px-6 text-center w-24">Pontos</th>
                  <th className="py-4 px-6 text-center w-20">V</th>
                  <th className="py-4 px-6 text-center w-20">E</th>
                  <th className="py-4 px-6 text-center w-20">D</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {mockStandings.map((item) => (
                  <tr key={item.rank} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-center font-bold">
                      {item.rank === 1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md">
                          1
                        </span>
                      ) : (
                        <span className="text-slate-400">{item.rank}º</span>
                      )}
                    </td>
                    <td className={`py-4 px-6 font-bold ${item.rank === 1 ? 'text-amber-300' : 'text-white'}`}>
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-center font-black text-base text-unirv-green">
                      {item.points}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-300">{item.wins}</td>
                    <td className="py-4 px-6 text-center text-slate-300">{item.draws}</td>
                    <td className="py-4 px-6 text-center text-slate-300">{item.losses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
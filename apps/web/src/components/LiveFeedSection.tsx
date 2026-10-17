'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getMatches, MatchFromApi } from '@/lib/api';
import { formatClock, mergeMatch, subscribeLiveMatches, useMatchClock } from '@/lib/matches';

const STATUS_ORDER: Record<MatchFromApi['status'], number> = {
  IN_PROGRESS: 0,
  FINISHED: 1,
  SCHEDULED: 2,
  CANCELED: 3,
};

function LiveMatchCard({ match }: { match: MatchFromApi }) {
  const isLive = match.status === 'IN_PROGRESS';
  const clock = useMatchClock(isLive ? match : null);
  const isSets = match.tournamentSport.sport.type === 'SETS_PARTIALS';

  const timeInfo = isLive
    ? isSets
      ? `Sets ${match.sets.home} x ${match.sets.away}`
      : formatClock(clock)
    : match.status === 'FINISHED'
      ? 'Encerrado'
      : new Date(match.scheduledAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
      {/* Badge de Status */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-unirv-green truncate">
          {match.tournamentSport.sport.name}
        </span>

        {isLive ? (
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            {timeInfo}
          </span>
        ) : (
          <span className="bg-slate-800 text-slate-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md shrink-0">
            {timeInfo}
          </span>
        )}
      </div>

      {/* Placar Central */}
      <div className="flex items-center justify-between my-2">
        <div className="text-center flex-1 min-w-0">
          <span className="block font-black text-lg text-white truncate">{match.homeTeam?.athletics.acronym ?? 'A definir'}</span>
        </div>

        <div className="px-4 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60 font-black text-xl tracking-widest text-unirv-green mx-2 tabular-nums">
          {match.status === 'SCHEDULED' ? 'VS' : `${match.homeScore} : ${match.awayScore}`}
        </div>

        <div className="text-center flex-1 min-w-0">
          <span className="block font-black text-lg text-white truncate">{match.awayTeam?.athletics.acronym ?? 'A definir'}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-medium gap-2">
        <span className="truncate">{match.locationCourt ?? match.stage}</span>
        <span className={isLive ? 'text-red-400 font-bold' : 'text-unirv-green'}>
          {isLive ? 'Ao Vivo' : match.status === 'FINISHED' ? 'Final' : 'Em breve'}
        </span>
      </div>
    </div>
  );
}

export function LiveFeedSection() {
  const [matches, setMatches] = useState<MatchFromApi[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getMatches()
      .then(setMatches)
      .catch(() => setFailed(true));

    // Cada lance registrado pela mesa chega aqui via Server-Sent Events
    return subscribeLiveMatches((updated) => setMatches((prev) => mergeMatch(prev, updated)));
  }, []);

  // Prioriza jogos ao vivo; completa com os encerrados e os próximos
  const feed = useMemo(
    () =>
      matches
        .filter((m) => m.status !== 'CANCELED')
        .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.scheduledAt.localeCompare(b.scheduledAt))
        .slice(0, 3),
    [matches],
  );

  const liveCount = matches.filter((m) => m.status === 'IN_PROGRESS').length;

  return (
    <section id="ao-vivo" className="py-20 px-4 bg-unirv-dark-navy text-white border-b border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {liveCount > 0 ? `${liveCount} jogo(s) ao vivo` : 'Feed em Tempo Real'}
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Acompanhe a Rodada</h2>
          </div>
          <p className="text-xs text-slate-400 mt-2 md:mt-0">Placar atualizado pela mesa oficial, sem recarregar a página</p>
        </div>

        {feed.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-10 border border-dashed border-white/10 rounded-2xl">
            {failed ? 'Não foi possível carregar os jogos agora.' : 'Nenhum jogo no calendário ainda.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {feed.map((match) => (
              <LiveMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

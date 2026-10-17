'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApiError, clearSession } from '@/lib/api';
import {
  addEvent,
  addScore,
  closeSet,
  controlClock,
  formatClock,
  getMatch,
  LiveEventType,
  LiveMatch,
  MatchEventFromApi,
  MatchSide,
  subscribeLiveMatches,
  useMatchClock,
} from '@/lib/matches';

const EVENT_LABEL: Record<MatchEventFromApi['type'], string> = {
  GOAL_POINT: 'Ponto',
  FOUL: 'Falta',
  YELLOW_CARD: 'Cartão Amarelo',
  RED_CARD: 'Cartão Vermelho',
  SET_PARTIAL: 'Set encerrado',
  TIME_NOTE_RECORD: 'Tempo',
};

const EVENT_ICON: Record<MatchEventFromApi['type'], string> = {
  GOAL_POINT: '🎯',
  FOUL: '⚠️',
  YELLOW_CARD: '🟨',
  RED_CARD: '🟥',
  SET_PARTIAL: '🏁',
  TIME_NOTE_RECORD: '⏱️',
};

const STATUS_STYLE: Record<LiveMatch['status'], { label: string; color: string }> = {
  SCHEDULED: { label: 'Agendada', color: 'bg-slate-800 text-slate-300 border-slate-700' },
  IN_PROGRESS: { label: 'Em andamento', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  FINISHED: { label: 'Encerrada', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  CANCELED: { label: 'Cancelada', color: 'bg-slate-800 text-slate-500 border-slate-700' },
};

function TeamBadge({ match, side }: { match: LiveMatch; side: MatchSide }) {
  const team = side === 'HOME' ? match.homeTeam : match.awayTeam;
  const [failed, setFailed] = useState(false);
  const logo = team?.athletics.logoUrl;

  return (
    <div className="flex flex-col items-center gap-3 min-w-0">
      <div className="w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
        {logo && !failed ? (
          <img src={logo} alt={team?.athletics.name} className="w-full h-full object-contain" onError={() => setFailed(true)} />
        ) : (
          <span className="text-sm font-black text-slate-400">{team?.athletics.acronym.slice(0, 3) ?? '?'}</span>
        )}
      </div>
      <span className="font-black text-lg text-white truncate max-w-full">{team?.athletics.acronym ?? 'A definir'}</span>
      <span className="text-[10px] uppercase tracking-wider text-slate-500">{side === 'HOME' ? 'Mandante' : 'Visitante'}</span>
    </div>
  );
}

export default function TableOfficialPanelPage() {
  const params = useParams<{ id: string }>();
  const matchId = Number(params.id);
  const router = useRouter();

  const [match, setMatch] = useState<LiveMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const clock = useMatchClock(match);

  const handleError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        clearSession();
        router.push('/');
        return;
      }
      setError(err instanceof Error ? err.message : 'Falha ao atualizar a partida.');
    },
    [router],
  );

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/');
      return;
    }

    getMatch(matchId).then(setMatch).catch(handleError);

    // Mantém o painel sincronizado se a partida for alterada em outro dispositivo
    return subscribeLiveMatches((updated) => {
      if (updated.id === matchId) setMatch(updated);
    });
  }, [matchId, router, handleError]);

  // Envolve cada ação da mesa: trava os botões, mostra erro e aplica a versão devolvida pela API
  const run = async (action: () => Promise<LiveMatch>) => {
    setBusy(true);
    setError(null);
    try {
      setMatch(await action());
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
      setConfirmFinish(false);
    }
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        {error ? (
          <>
            <p className="text-red-400 text-sm font-semibold">{error}</p>
            <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-unirv-green hover:underline">
              ← Voltar ao painel
            </button>
          </>
        ) : (
          <p className="text-slate-400 font-medium animate-pulse">Carregando mesa...</p>
        )}
      </div>
    );
  }

  const sport = match.tournamentSport.sport;
  const isSets = sport.type === 'SETS_PARTIALS';
  const isLive = match.status === 'IN_PROGRESS';
  const isClosed = match.status === 'FINISHED' || match.status === 'CANCELED';
  const pointOptions = sport.name.toLowerCase().includes('basquete') ? [1, 2, 3] : [1];
  const canDisciplinary = sport.type === 'DIRECT_SCORE';
  const status = STATUS_STYLE[match.status];
  const disabled = busy || !isLive;

  const teamControls = (side: MatchSide) => (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
      <h3 className="text-sm font-black text-white uppercase tracking-wider">
        {(side === 'HOME' ? match.homeTeam : match.awayTeam)?.athletics.acronym ?? 'Equipe'}
      </h3>

      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{isSets ? 'Pontos do set' : 'Placar'}</span>
        <div className="flex gap-2 flex-wrap">
          {pointOptions.map((points) => (
            <button
              key={points}
              disabled={disabled}
              onClick={() => run(() => addScore(match.id, side, points))}
              className="flex-1 min-w-16 py-4 rounded-2xl bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-black text-lg transition disabled:opacity-40"
            >
              +{points}
            </button>
          ))}
          <button
            disabled={disabled || (side === 'HOME' ? match.homeScore : match.awayScore) === 0}
            onClick={() => run(() => addScore(match.id, side, -1))}
            className="px-4 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition disabled:opacity-40"
            title="Desfaz o último ponto lançado para esta equipe"
          >
            −1 Corrigir
          </button>
        </div>
      </div>

      {canDisciplinary && (
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Disciplina</span>
          <div className="grid grid-cols-3 gap-2">
            {(['FOUL', 'YELLOW_CARD', 'RED_CARD'] as LiveEventType[]).map((type) => (
              <button
                key={type}
                disabled={disabled}
                onClick={() => run(() => addEvent(match.id, side, type))}
                className="py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs font-bold text-slate-300 transition disabled:opacity-40"
              >
                {EVENT_ICON[type]} {type === 'FOUL' ? 'Falta' : type === 'YELLOW_CARD' ? 'Amarelo' : 'Vermelho'}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between gap-4">
        <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-400 hover:text-white">
          ← Painel
        </button>
        <span className="text-sm font-black text-white">
          Mesa de Controle <span className="text-unirv-green">#{match.id}</span>
        </span>
        <span className={`text-xs px-3 py-1 rounded-full border font-bold ${status.color}`}>{status.label}</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <p className="text-center text-xs text-slate-400">
          {sport.iconUrl} <strong className="text-white">{sport.name}</strong> • {match.stage} • {match.locationCourt ?? 'Local a definir'}
        </p>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-between gap-4">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}

        {/* Placar */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <TeamBadge match={match} side="HOME" />

            <div className="text-center space-y-3">
              <div className="text-6xl sm:text-7xl font-black tabular-nums text-white tracking-tight">
                {match.homeScore}
                <span className="text-slate-600 mx-2">:</span>
                {match.awayScore}
              </div>
              {isSets && (
                <p className="text-xs font-bold text-slate-400">
                  Sets <span className="text-unirv-green">{match.sets.home} x {match.sets.away}</span>
                </p>
              )}
              <div
                className={`inline-block px-5 py-2 rounded-2xl border font-black text-2xl tabular-nums ${
                  match.clockRunning ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                ⏱ {formatClock(clock)}
              </div>
            </div>

            <TeamBadge match={match} side="AWAY" />
          </div>

          {match.status === 'FINISHED' && (
            <p className="text-center text-sm font-black text-emerald-400 mt-6">
              {match.winnerTeam ? `Vitória da ${match.winnerTeam.athletics.acronym}` : 'Partida encerrada empatada'}
            </p>
          )}

          {/* Cronômetro */}
          {!isClosed && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {match.clockRunning ? (
                <button
                  disabled={busy}
                  onClick={() => run(() => controlClock(match.id, 'PAUSE'))}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                  ⏸ Pausar
                </button>
              ) : (
                <button
                  disabled={busy}
                  onClick={() => run(() => controlClock(match.id, 'START'))}
                  className="px-6 py-3 rounded-xl bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                >
                  ▶ {match.status === 'SCHEDULED' ? 'Iniciar Partida' : 'Retomar'}
                </button>
              )}

              {isSets && (
                <button
                  disabled={disabled || match.homeScore === match.awayScore}
                  onClick={() => run(() => closeSet(match.id))}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider border border-slate-700 transition disabled:opacity-40"
                >
                  🏁 Fechar Set
                </button>
              )}

              {isLive &&
                (confirmFinish ? (
                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => run(() => controlClock(match.id, 'FINISH'))}
                      className="px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                    >
                      Confirmar encerramento
                    </button>
                    <button
                      onClick={() => setConfirmFinish(false)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={busy}
                    onClick={() => setConfirmFinish(true)}
                    className="px-6 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-black text-xs uppercase tracking-wider transition disabled:opacity-50"
                  >
                    ⏹ Encerrar Partida
                  </button>
                ))}
            </div>
          )}

          {match.status === 'SCHEDULED' && (
            <p className="text-center text-[11px] text-slate-500 mt-4">Inicie a partida para liberar o lançamento de pontos.</p>
          )}
        </section>

        {/* Controles por equipe */}
        {!isClosed && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamControls('HOME')}
            {teamControls('AWAY')}
          </section>
        )}

        {/* Súmula / lances */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <h2 className="text-lg font-black text-white">Súmula da Partida</h2>
          {match.events.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center border border-dashed border-slate-800 rounded-2xl">
              Nenhum lance registrado ainda.
            </p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {match.events.map((event) => (
                <li key={event.id} className="py-3 flex items-center gap-4 text-xs">
                  <span className="font-mono text-slate-500 w-12 shrink-0">{formatClock(event.matchTimeSec ?? 0)}</span>
                  <span className="text-base">{EVENT_ICON[event.type]}</span>
                  <span className="font-bold text-white">{EVENT_LABEL[event.type]}</span>
                  {event.recordedValue && <span className="text-unirv-green font-bold">{event.recordedValue}</span>}
                  <span className="ml-auto text-slate-400 font-semibold">{event.team?.athletics.acronym}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

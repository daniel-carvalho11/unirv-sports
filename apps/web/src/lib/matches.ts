import { useEffect, useState } from 'react';
import { API_URL, apiFetch, MatchFromApi } from './api';

export type MatchSide = 'HOME' | 'AWAY';
export type ClockAction = 'START' | 'PAUSE' | 'FINISH';
export type LiveEventType = 'FOUL' | 'YELLOW_CARD' | 'RED_CARD';

export interface MatchEventFromApi {
  id: number;
  type: 'GOAL_POINT' | 'FOUL' | 'YELLOW_CARD' | 'RED_CARD' | 'SET_PARTIAL' | 'TIME_NOTE_RECORD';
  teamId: number | null;
  recordedValue: string | null;
  matchTimeSec: number | null;
  createdAt: string;
  team: { id: number; athletics: { acronym: string } } | null;
}

export interface LiveMatch extends MatchFromApi {
  events: MatchEventFromApi[];
}

export function getMatch(id: number) {
  return apiFetch<LiveMatch>(`/matches/${id}`, {}, 'Partida não encontrada.');
}

export function getOfficiatingMatches() {
  return apiFetch<LiveMatch[]>('/matches/officiating', {}, 'Falha ao carregar suas partidas.');
}

function post(id: number, path: string, body?: unknown) {
  return apiFetch<LiveMatch>(
    `/matches/${id}/${path}`,
    { method: 'POST', body: body ? JSON.stringify(body) : undefined },
    'Falha ao atualizar a partida.',
  );
}

export const controlClock = (id: number, action: ClockAction) => post(id, 'clock', { action });
export const addScore = (id: number, side: MatchSide, points: number) => post(id, 'score', { side, points });
export const addEvent = (id: number, side: MatchSide, type: LiveEventType) => post(id, 'events', { side, type });
export const closeSet = (id: number) => post(id, 'sets/close');

// Recebe as atualizações de placar em tempo real (Server-Sent Events). Retorna a função para cancelar.
export function subscribeLiveMatches(onUpdate: (match: LiveMatch) => void) {
  const source = new EventSource(`${API_URL}/matches/live/stream`);
  source.addEventListener('match-update', (event) => {
    onUpdate(JSON.parse((event as MessageEvent).data));
  });
  return () => source.close();
}

// Substitui a partida atualizada dentro de uma lista
export function mergeMatch<T extends MatchFromApi>(list: T[], updated: T) {
  return list.map((m) => (m.id === updated.id ? { ...m, ...updated } : m));
}

export function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Cronômetro exibido: parte do tempo calculado pela API e soma os segundos passados desde que essa versão chegou.
// Cada atualização do servidor (SSE ou resposta de ação) reancora o valor, então não acumula desvio.
export function useMatchClock(match: Pick<MatchFromApi, 'elapsedSeconds' | 'clockRunning'> | null) {
  const [ticks, setTicks] = useState(0);
  const [lastMatch, setLastMatch] = useState(match);

  if (match !== lastMatch) {
    setLastMatch(match);
    setTicks(0);
  }

  const running = !!match?.clockRunning;
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setTicks((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [running, match]);

  if (!match) return 0;
  return match.elapsedSeconds + (running ? ticks : 0);
}

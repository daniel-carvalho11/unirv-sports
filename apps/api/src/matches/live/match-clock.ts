import { MatchEventType } from '@prisma/client';

interface ClockFields {
  stopwatchSeconds: number;
  clockRunningSince: Date | null;
}

interface WithEvents {
  homeTeamId: number | null;
  awayTeamId: number | null;
  events?: { type: MatchEventType; teamId: number | null; deletedAt: Date | null }[];
}

// O cronômetro é salvo como "tempo acumulado + instante em que voltou a rodar";
// assim ele continua correto mesmo se a página do mesário for recarregada.
export function elapsedSeconds(match: ClockFields, now = new Date()) {
  if (!match.clockRunningSince) return match.stopwatchSeconds;
  const running = Math.floor((now.getTime() - match.clockRunningSince.getTime()) / 1000);
  return match.stopwatchSeconds + Math.max(running, 0);
}

// Sets vencidos são derivados dos eventos SET_PARTIAL (modalidades SETS_PARTIALS)
export function setsWon(match: WithEvents) {
  const sets = (match.events ?? []).filter((e) => e.type === MatchEventType.SET_PARTIAL && !e.deletedAt);
  return {
    home: sets.filter((e) => e.teamId === match.homeTeamId).length,
    away: sets.filter((e) => e.teamId === match.awayTeamId).length,
  };
}

// Campos calculados enviados ao front junto com a partida
export function withClock<T extends ClockFields & WithEvents>(match: T) {
  return {
    ...match,
    clockRunning: !!match.clockRunningSince,
    elapsedSeconds: elapsedSeconds(match),
    sets: setsWon(match),
    serverTime: new Date().toISOString(),
  };
}

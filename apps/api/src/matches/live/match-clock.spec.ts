import { elapsedSeconds, setsWon } from './match-clock';

describe('match-clock', () => {
  it('retorna o tempo acumulado quando o cronômetro está pausado', () => {
    expect(elapsedSeconds({ stopwatchSeconds: 90, clockRunningSince: null })).toBe(90);
  });

  it('soma o tempo desde que o cronômetro voltou a rodar', () => {
    const now = new Date('2026-10-16T20:10:00Z');
    const since = new Date('2026-10-16T20:08:30Z');
    expect(elapsedSeconds({ stopwatchSeconds: 60, clockRunningSince: since }, now)).toBe(150);
  });

  it('conta sets vencidos ignorando eventos removidos', () => {
    const sets = setsWon({
      homeTeamId: 1,
      awayTeamId: 2,
      events: [
        { type: 'SET_PARTIAL', teamId: 1, deletedAt: null },
        { type: 'SET_PARTIAL', teamId: 2, deletedAt: null },
        { type: 'SET_PARTIAL', teamId: 2, deletedAt: new Date() },
        { type: 'GOAL_POINT', teamId: 1, deletedAt: null },
      ],
    });
    expect(sets).toEqual({ home: 1, away: 1 });
  });
});

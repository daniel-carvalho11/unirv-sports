export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type UserRoleType = 'ADMIN' | 'REPRESENTATIVE' | 'TABLE_OFFICIAL' | 'ATHLETE' | 'VISITOR';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  athleticsId?: number;
}

export interface AthleticFromApi {
  id: number;
  name: string;
  acronym: string;
  degreeProgram: string;
  logoUrl: string | null;
}

export interface SportFromApi {
  id: number;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  type: string;
  shortDesc: string | null;
  iconUrl: string | null;
}

interface TeamFromApi {
  id: number;
  athletics: AthleticFromApi;
}

export interface MatchFromApi {
  id: number;
  stage: string;
  scheduledAt: string;
  locationCourt: string | null;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED';
  homeScore: number;
  awayScore: number;
  tableOfficialId: number | null;
  homeTeam: TeamFromApi | null;
  awayTeam: TeamFromApi | null;
  winnerTeam?: TeamFromApi | null;
  tournamentSport: {
    sport: SportFromApi;
    tournament: { id: number; name: string };
  };
  // Campos calculados pela API (cronômetro e sets)
  clockRunning: boolean;
  elapsedSeconds: number;
  sets: { home: number; away: number };
}

// Erro com status HTTP, para a UI distinguir sessão expirada (401) de outros erros
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
  fallbackMessage = 'Falha na comunicação com o servidor.',
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string>) },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // O ValidationPipe do Nest devolve `message` como array de strings
    const message = Array.isArray(errorData.message) ? errorData.message.join(' ') : errorData.message;
    throw new ApiError(message || fallbackMessage, response.status);
  }

  return response.json();
}

export async function loginRequest(email: string, password: string) {
  const data = await apiFetch<{ accessToken: string; user: unknown }>(
    '/auth/login',
    { method: 'POST', body: JSON.stringify({ email, password }) },
    'Falha ao efetuar login.',
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export function registerRequest(payload: RegisterPayload) {
  return apiFetch('/users', { method: 'POST', body: JSON.stringify(payload) }, 'Falha ao realizar cadastro.');
}

export function getProfile<T>() {
  return apiFetch<T>('/auth/profile', {}, 'Falha ao carregar perfil.');
}

export function getSports() {
  return apiFetch<SportFromApi[]>('/sports', {}, 'Falha ao carregar modalidades.');
}

export function getAthletics() {
  return apiFetch<AthleticFromApi[]>('/athletics', {}, 'Falha ao carregar atléticas.');
}

export function getMatches() {
  return apiFetch<MatchFromApi[]>('/matches', {}, 'Falha ao carregar partidas.');
}

export const SPORT_GENDER_LABEL: Record<SportFromApi['gender'], string> = {
  MALE: 'Masculino',
  FEMALE: 'Feminino',
  MIXED: 'Misto',
};

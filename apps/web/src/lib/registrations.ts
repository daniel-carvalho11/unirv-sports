import { apiFetch, SportFromApi } from './api';

export interface SportRegistration {
  id: number;
  userId: number;
  sportId: number;
  athleticsId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string | null;
  createdAt: string;
  sport: SportFromApi;
  user?: {
    id: number;
    name: string;
    email: string;
    academicId?: string | null;
    photoUrl?: string | null;
  };
}

export function requestSportRegistration(sportId: number) {
  return apiFetch<SportRegistration>(
    '/registrations',
    { method: 'POST', body: JSON.stringify({ sportId }) },
    'Falha ao solicitar inscrição.',
  );
}

export function getMyRegistrations() {
  return apiFetch<SportRegistration[]>('/registrations/my-requests', {}, 'Falha ao buscar solicitações.');
}

export function getPendingRegistrations() {
  return apiFetch<SportRegistration[]>('/registrations/pending', {}, 'Falha ao buscar solicitações pendentes.');
}

// Todas as inscrições da atlética do diretor (pendentes, aprovadas e recusadas)
export function getAthleticsRegistrations() {
  return apiFetch<SportRegistration[]>('/registrations/athletics', {}, 'Falha ao buscar inscrições da atlética.');
}

export function updateRegistrationStatus(id: number, status: 'APPROVED' | 'REJECTED', notes?: string) {
  return apiFetch<SportRegistration>(
    `/registrations/${id}/status`,
    { method: 'PATCH', body: JSON.stringify({ status, notes }) },
    'Falha ao atualizar status.',
  );
}

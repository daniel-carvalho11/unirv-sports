const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface SportRegistration {
  id: number;
  userId: number;
  sportId: number;
  athleticsId: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  sport: {
    id: number;
    name: string;
    gender: string;
    type: string;
  };
  user?: {
    id: number;
    name: string;
    email: string;
    academicId?: string;
    photoUrl?: string;
  };
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export async function requestSportRegistration(sportId: number): Promise<SportRegistration> {
  const response = await fetch(`${API_URL}/registrations`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ sportId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao solicitar inscrição.');
  }

  return response.json();
}

export async function getMyRegistrations(): Promise<SportRegistration[]> {
  const response = await fetch(`${API_URL}/registrations/my-requests`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao buscar solicitações.');
  }

  return response.json();
}

export async function getPendingRegistrations(): Promise<SportRegistration[]> {
  const response = await fetch(`${API_URL}/registrations/pending`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao buscar solicitações pendentes.');
  }

  return response.json();
}

export async function updateRegistrationStatus(
  id: number,
  status: 'APPROVED' | 'REJECTED',
  notes?: string,
): Promise<SportRegistration> {
  const response = await fetch(`${API_URL}/registrations/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao atualizar status.');
  }

  return response.json();
}
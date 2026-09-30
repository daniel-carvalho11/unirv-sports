const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Exportando o tipo de Role alinhado ao Prisma
export type UserRoleType = 'ADMIN' | 'REPRESENTATIVE' | 'TABLE_OFFICIAL' | 'ATHLETE' | 'VISITOR';

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao efetuar login.');
  }

  return response.json();
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  role: UserRoleType;
  athleticsId?: number;
}) {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao realizar cadastro.');
  }

  return response.json();
}
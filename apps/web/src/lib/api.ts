const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Falha ao efetuar login. Verifique as credenciais.');
  }

  return response.json(); // Retorna { accessToken, user }
}
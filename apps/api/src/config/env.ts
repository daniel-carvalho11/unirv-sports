// Leitura centralizada das variáveis de ambiente sensíveis.
// Nada de valor padrão para segredo: sem JWT_SECRET a API não sobe (um segredo conhecido permite forjar token de ADMIN).

const MIN_JWT_SECRET_LENGTH = 32;

export const isProduction = () => process.env.NODE_ENV === 'production';

export function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(
      `JWT_SECRET ausente ou fraco (mínimo de ${MIN_JWT_SECRET_LENGTH} caracteres). ` +
        `Gere um com: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`,
    );
  }
  return secret;
}

// Login liberado só quando LOGIN_ENABLED=true. Sem a variável: liberado no dev, bloqueado em produção (pré-lançamento)
export function isLoginEnabled(): boolean {
  const flag = process.env.LOGIN_ENABLED;
  if (flag === undefined || flag === '') return !isProduction();
  return flag === 'true';
}

// Origens do front autorizadas no CORS, separadas por vírgula (ex.: https://unirv-sports.onrender.com)
export function corsOrigins(): string[] | true {
  const origins = process.env.CORS_ORIGIN?.split(',').map((o) => o.trim()).filter(Boolean);
  if (origins?.length) return origins;
  if (isProduction()) {
    throw new Error('CORS_ORIGIN é obrigatório em produção (URL do front-end).');
  }
  return true; // dev: qualquer origem
}

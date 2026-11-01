// Flags de pré-lançamento. Variáveis NEXT_PUBLIC_ são fixadas no `next build`: alterou no Render, faça novo deploy do web.

// Login liberado só com NEXT_PUBLIC_LOGIN_ENABLED=true. Sem a variável: liberado no dev, bloqueado no build de produção.
// A API tem a mesma trava (LOGIN_ENABLED); esta aqui só esconde os botões.
const loginFlag = process.env.NEXT_PUBLIC_LOGIN_ENABLED;
export const LOGIN_ENABLED = loginFlag ? loginFlag === 'true' : process.env.NODE_ENV !== 'production';

// Data/hora do lançamento exibida no contador (horário de Brasília)
export const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE || '2026-11-16T09:00:00-03:00';

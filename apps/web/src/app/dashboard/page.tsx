'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ApiError,
  clearSession,
  getMatches,
  getProfile,
  getSports,
  MatchFromApi,
  SPORT_GENDER_LABEL,
  SportFromApi,
  UserRoleType,
} from '@/lib/api';
import {
  getAthleticsRegistrations,
  getMyRegistrations,
  getPendingRegistrations,
  requestSportRegistration,
  SportRegistration,
  updateRegistrationStatus,
} from '@/lib/registrations';

interface AthleticInfo {
  id: number;
  name: string;
  acronym: string;
  degreeProgram?: string;
  logoUrl?: string | null;
}

interface UserData {
  id: number;
  name?: string;
  email: string;
  role: UserRoleType;
  athleticsId?: number | null;
  athletics?: AthleticInfo | null;
}

type TabKey = 'overview' | 'matches' | 'sports' | 'pending' | 'roster' | 'officiating';

const TAB_LABELS: Record<TabKey, string> = {
  overview: 'Visão Geral',
  matches: 'Calendário',
  sports: 'Modalidades',
  pending: 'Aprovações Pendentes',
  roster: 'Atletas da Atlética',
  officiating: 'Minhas Partidas',
};

// Cada perfil enxerga apenas as abas que fazem sentido para ele
const TABS_BY_ROLE: Record<UserRoleType, TabKey[]> = {
  ATHLETE: ['overview', 'matches', 'sports'],
  REPRESENTATIVE: ['overview', 'matches', 'pending', 'roster'],
  TABLE_OFFICIAL: ['overview', 'officiating', 'matches'],
  VISITOR: ['overview', 'matches'],
  ADMIN: ['overview', 'matches', 'sports'],
};

const ROLE_BADGE: Record<UserRoleType, { label: string; color: string; intro: string }> = {
  ATHLETE: {
    label: 'Atleta Universitário',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    intro: 'Solicite inscrição nas modalidades da sua atlética e acompanhe o calendário oficial de partidas.',
  },
  REPRESENTATIVE: {
    label: 'Diretoria de Atlética',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    intro: 'Aprove ou recuse as inscrições dos atletas da sua atlética e acompanhe os jogos.',
  },
  TABLE_OFFICIAL: {
    label: 'Oficial de Mesa',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    intro: 'Confira as partidas sob sua responsabilidade e prepare-se para registrar placar e cronômetro.',
  },
  ADMIN: {
    label: 'Administrador Geral',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    intro: 'Visão geral das modalidades e do calendário dos Jogos Universitários.',
  },
  VISITOR: {
    label: 'Aluno / Torcedor',
    color: 'bg-slate-800 text-slate-300 border-slate-700',
    intro: 'Acompanhe o calendário de jogos e torça pela sua atlética!',
  },
};

const REGISTRATION_BADGE: Record<SportRegistration['status'], { label: string; color: string }> = {
  APPROVED: { label: 'Aprovado', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  PENDING: { label: 'Pendente', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  REJECTED: { label: 'Recusado', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const MATCH_STATUS_LABEL: Record<MatchFromApi['status'], string> = {
  SCHEDULED: 'Agendada',
  IN_PROGRESS: 'Ao Vivo',
  FINISHED: 'Encerrada',
  CANCELED: 'Cancelada',
};

function formatMatchDate(iso: string) {
  const date = new Date(iso);
  return {
    date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  };
}

function AthleticLogo({ athletics, size = 'w-8 h-8' }: { athletics?: AthleticInfo | null; size?: string }) {
  const [failed, setFailed] = useState(false);

  if (!athletics?.logoUrl || failed) {
    return (
      <span className={`${size} rounded-lg bg-slate-800 text-[9px] font-black text-slate-400 flex items-center justify-center`}>
        {athletics?.acronym?.slice(0, 3) ?? '?'}
      </span>
    );
  }

  return (
    <img
      src={athletics.logoUrl}
      alt={athletics.name}
      className={`${size} object-contain`}
      onError={() => setFailed(true)}
    />
  );
}

function MatchCard({ match }: { match: MatchFromApi }) {
  const { date, time } = formatMatchDate(match.scheduledAt);
  const isLive = match.status === 'IN_PROGRESS';
  const showScore = match.status !== 'SCHEDULED';

  return (
    <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3 gap-2">
        <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-unirv-green font-bold">
          {match.tournamentSport.sport.iconUrl} {match.tournamentSport.sport.name}
        </span>
        <span className={`text-[10px] uppercase ${isLive ? 'text-red-400 font-black animate-pulse' : 'text-slate-500'}`}>
          {isLive ? '● Ao Vivo' : match.stage}
        </span>
      </div>

      <div className="flex items-center justify-between py-5 my-2 border-y border-slate-900 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <AthleticLogo athletics={match.homeTeam?.athletics} />
          <span className="font-black text-sm text-white truncate">{match.homeTeam?.athletics.acronym ?? 'A definir'}</span>
        </div>

        <span className="text-xs font-black text-slate-500 shrink-0">
          {showScore ? `${match.homeScore} x ${match.awayScore}` : 'VS'}
        </span>

        <div className="flex items-center gap-2 min-w-0 justify-end">
          <span className="font-black text-sm text-white truncate">{match.awayTeam?.athletics.acronym ?? 'A definir'}</span>
          <AthleticLogo athletics={match.awayTeam?.athletics} />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 gap-2">
        <span className="truncate">📍 {match.locationCourt ?? 'Local a definir'}</span>
        <span className="font-bold text-unirv-green shrink-0">
          🗓️ {date} • {time}
        </span>
      </div>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-slate-400 py-6 text-center border border-dashed border-slate-800 rounded-2xl">{children}</p>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [error, setError] = useState<string | null>(null);

  const [sports, setSports] = useState<SportFromApi[]>([]);
  const [matches, setMatches] = useState<MatchFromApi[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<SportRegistration[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<SportRegistration[]>([]);
  const [athleticsRegistrations, setAthleticsRegistrations] = useState<SportRegistration[]>([]);

  const [submittingSportId, setSubmittingSportId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const handleLogout = useCallback(() => {
    clearSession();
    router.push('/');
  }, [router]);

  // Token de 50min: ao expirar, qualquer chamada retorna 401 e o usuário volta para a home
  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      if (err instanceof ApiError && err.status === 401) {
        handleLogout();
        return;
      }
      setError(err instanceof Error ? err.message : fallback);
    },
    [handleLogout],
  );

  // Sessão: confirma o token com /auth/profile e usa os dados atualizados do usuário (role/atlética)
  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      router.push('/');
      return;
    }

    getProfile<UserData>()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
      })
      .catch((err) => handleError(err, 'Falha ao validar sessão.'));
  }, [router, handleLogout, handleError]);

  const role = user?.role;

  useEffect(() => {
    if (!role) return;

    getMatches().then(setMatches).catch((err) => handleError(err, 'Falha ao carregar partidas.'));

    if (role === 'ATHLETE' || role === 'ADMIN') {
      getSports().then(setSports).catch((err) => handleError(err, 'Falha ao carregar modalidades.'));
    }
    if (role === 'ATHLETE') {
      getMyRegistrations().then(setMyRegistrations).catch((err) => handleError(err, 'Falha ao carregar inscrições.'));
    }
    if (role === 'REPRESENTATIVE') {
      getPendingRegistrations().then(setPendingRegistrations).catch((err) => handleError(err, 'Falha ao carregar pendências.'));
      getAthleticsRegistrations().then(setAthleticsRegistrations).catch((err) => handleError(err, 'Falha ao carregar atletas.'));
    }
  }, [role, handleError]);

  const upcomingMatches = useMemo(
    () => matches.filter((m) => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS'),
    [matches],
  );

  const officiatingMatches = useMemo(
    () => upcomingMatches.filter((m) => m.tableOfficialId === user?.id),
    [upcomingMatches, user?.id],
  );

  // Para atleta/diretor, destaca os jogos da própria atlética
  const myAthleticsMatches = useMemo(() => {
    const acronym = user?.athletics?.acronym;
    if (!acronym) return [];
    return upcomingMatches.filter(
      (m) => m.homeTeam?.athletics.acronym === acronym || m.awayTeam?.athletics.acronym === acronym,
    );
  }, [upcomingMatches, user?.athletics?.acronym]);

  const handleRequestRegistration = async (sportId: number) => {
    try {
      setError(null);
      setSubmittingSportId(sportId);
      await requestSportRegistration(sportId);
      setMyRegistrations(await getMyRegistrations());
    } catch (err) {
      handleError(err, 'Erro ao solicitar inscrição.');
    } finally {
      setSubmittingSportId(null);
    }
  };

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      setError(null);
      setActionLoadingId(id);
      await updateRegistrationStatus(id, status);
      setPendingRegistrations((prev) => prev.filter((item) => item.id !== id));
      setAthleticsRegistrations(await getAthleticsRegistrations());
    } catch (err) {
      handleError(err, 'Falha ao atualizar status da solicitação.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!user || !role) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 font-medium animate-pulse">Carregando painel...</p>
      </div>
    );
  }

  const tabs = TABS_BY_ROLE[role] ?? TABS_BY_ROLE.VISITOR;
  const currentTab = tabs.includes(activeTab) ? activeTab : 'overview';
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.VISITOR;
  const nextMatch = (myAthleticsMatches[0] ?? upcomingMatches[0]) as MatchFromApi | undefined;
  const approvedAthletes = athleticsRegistrations.filter((r) => r.status === 'APPROVED');

  const primaryAction: { label: string; tab: TabKey } | null =
    role === 'ATHLETE'
      ? { label: 'Inscrever em Modalidades', tab: 'sports' }
      : role === 'REPRESENTATIVE'
        ? { label: `Gerenciar Inscrições (${pendingRegistrations.length})`, tab: 'pending' }
        : role === 'TABLE_OFFICIAL'
          ? { label: `Minhas Partidas (${officiatingMatches.length})`, tab: 'officiating' }
          : null;

  const tabCount: Partial<Record<TabKey, number>> = {
    matches: upcomingMatches.length,
    pending: pendingRegistrations.length,
    roster: approvedAthletes.length,
    officiating: officiatingMatches.length,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-white cursor-pointer" onClick={() => router.push('/')}>
            UniRV <span className="text-unirv-green">Esportes</span>
          </span>
          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${badge.color}`}>{badge.label}</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">{user.email}</span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-xl transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Banner Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Olá, {user.name || 'Universitário'}!</h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">{badge.intro}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {primaryAction && (
              <button
                onClick={() => setActiveTab(primaryAction.tab)}
                className="px-4 py-3 bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-unirv-green/10"
              >
                {primaryAction.label}
              </button>
            )}
            <button
              onClick={() => setActiveTab('matches')}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition-all"
            >
              Ver Calendário
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center justify-between gap-4">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-300 hover:text-white">✕</button>
          </div>
        )}

        {/* Navegação de Abas */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                currentTab === tab ? 'bg-unirv-green text-slate-950' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {TAB_LABELS[tab]}
              {!!tabCount[tab] && (
                <span className="px-2 py-0.5 text-[10px] bg-slate-950/30 rounded-full font-black">{tabCount[tab]}</span>
              )}
            </button>
          ))}
        </div>

        {/* VISÃO GERAL */}
        {currentTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                {role === 'ATHLETE' && (
                  <>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Minhas Inscrições</span>
                    <p className="text-2xl font-black text-unirv-green mt-2">
                      {myRegistrations.filter((r) => r.status === 'APPROVED').length} aprovada(s)
                    </p>
                    <p className="text-xs text-slate-400 mt-1 truncate">
                      {myRegistrations.length > 0
                        ? myRegistrations.map((r) => `${r.sport.name} (${REGISTRATION_BADGE[r.status].label})`).join(', ')
                        : 'Nenhuma solicitação enviada'}
                    </p>
                  </>
                )}
                {role === 'REPRESENTATIVE' && (
                  <>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Solicitações Pendentes</span>
                    <p className="text-2xl font-black text-unirv-green mt-2">{pendingRegistrations.length} pendente(s)</p>
                    <p className="text-xs text-slate-400 mt-1">{approvedAthletes.length} atleta(s) aprovados na atlética</p>
                  </>
                )}
                {role === 'TABLE_OFFICIAL' && (
                  <>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Partidas sob sua Mesa</span>
                    <p className="text-2xl font-black text-unirv-green mt-2">{officiatingMatches.length} partida(s)</p>
                    <p className="text-xs text-slate-400 mt-1">Agendadas ou em andamento</p>
                  </>
                )}
                {(role === 'VISITOR' || role === 'ADMIN') && (
                  <>
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Jogos no Calendário</span>
                    <p className="text-2xl font-black text-unirv-green mt-2">{upcomingMatches.length} partida(s)</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {role === 'VISITOR' ? 'Quer competir? Crie uma conta de atleta.' : 'Agendadas ou em andamento'}
                    </p>
                  </>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {myAthleticsMatches.length > 0 ? 'Próximo Jogo da sua Atlética' : 'Próxima Partida'}
                </span>
                {nextMatch ? (
                  <>
                    <p className="text-xl font-black text-white mt-2">
                      {nextMatch.homeTeam?.athletics.acronym} x {nextMatch.awayTeam?.athletics.acronym}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {nextMatch.tournamentSport.sport.name} • {formatMatchDate(nextMatch.scheduledAt).date} às{' '}
                      {formatMatchDate(nextMatch.scheduledAt).time}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-slate-400 mt-2">Nenhuma partida agendada.</p>
                )}
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-unirv-green/40 transition-all group">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Atlética Vinculada</span>
                  <p className="text-xl font-black text-unirv-green">{user.athletics?.name || 'Sem Atlética Vinculada'}</p>
                  <p className="text-xs text-slate-400">{user.athletics?.degreeProgram || 'Perfil ativo no sistema'}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                  {user.athletics ? (
                    <AthleticLogo athletics={user.athletics} size="w-full h-full" />
                  ) : (
                    <span className="text-xs font-black text-slate-400 uppercase">UNIRV</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Próximos Jogos</h2>
                <button onClick={() => setActiveTab('matches')} className="text-xs font-bold text-unirv-green hover:underline">
                  Ver todos →
                </button>
              </div>
              {upcomingMatches.length === 0 ? (
                <EmptyState>Nenhuma partida agendada no momento.</EmptyState>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(myAthleticsMatches.length > 0 ? myAthleticsMatches : upcomingMatches).slice(0, 2).map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CALENDÁRIO */}
        {currentTab === 'matches' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Calendário de Partidas</h2>
              <p className="text-xs text-slate-400 mt-1">Datas, horários e locais dos jogos das atléticas da UniRV.</p>
            </div>
            {upcomingMatches.length === 0 ? (
              <EmptyState>Nenhuma partida agendada no momento.</EmptyState>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODALIDADES (Atleta solicita inscrição; Admin apenas visualiza) */}
        {currentTab === 'sports' && (
          <div className="space-y-8">
            {role === 'ATHLETE' && !user.athleticsId && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                Seu perfil não está vinculado a uma atlética. Procure a diretoria para regularizar antes de se inscrever.
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Modalidades Disponíveis</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {role === 'ATHLETE'
                    ? `Solicite inscrição para representar a ${user.athletics?.acronym ?? 'sua atlética'}. A diretoria aprova cada pedido.`
                    : 'Modalidades oficiais cadastradas na plataforma.'}
                </p>
              </div>

              {sports.length === 0 ? (
                <EmptyState>Nenhuma modalidade cadastrada.</EmptyState>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sports.map((sport) => {
                    const registration = myRegistrations.find((r) => r.sportId === sport.id);

                    return (
                      <div key={sport.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-3xl">{sport.iconUrl || '🏆'}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
                              {SPORT_GENDER_LABEL[sport.gender] ?? sport.gender}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white">{sport.name}</h3>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {sport.shortDesc || 'Modalidade oficial dos jogos universitários.'}
                          </p>
                          {registration?.status === 'REJECTED' && registration.notes && (
                            <p className="text-[11px] text-red-400">Motivo da recusa: {registration.notes}</p>
                          )}
                        </div>

                        {role === 'ATHLETE' &&
                          (registration && registration.status !== 'REJECTED' ? (
                            <div
                              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center border ${REGISTRATION_BADGE[registration.status].color}`}
                            >
                              {registration.status === 'APPROVED' ? 'Inscrição Aprovada' : 'Solicitação Pendente'}
                            </div>
                          ) : (
                            <button
                              disabled={submittingSportId === sport.id || !user.athleticsId}
                              onClick={() => handleRequestRegistration(sport.id)}
                              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-unirv-green hover:bg-unirv-mid-green text-slate-950 shadow-lg shadow-unirv-green/10 disabled:opacity-50"
                            >
                              {submittingSportId === sport.id
                                ? 'Enviando...'
                                : registration?.status === 'REJECTED'
                                  ? 'Solicitar Novamente'
                                  : 'Solicitar Inscrição'}
                            </button>
                          ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* APROVAÇÕES PENDENTES (Diretoria) */}
        {currentTab === 'pending' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Aprovações de Atletas Pendentes</h2>
              <p className="text-xs text-slate-400 mt-1">
                Solicitações dos atletas vinculados à {user.athletics?.name ?? 'sua atlética'}.
              </p>
            </div>

            {pendingRegistrations.length === 0 ? (
              <EmptyState>Nenhuma solicitação pendente no momento.</EmptyState>
            ) : (
              <div className="space-y-3">
                {pendingRegistrations.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-unirv-green/20 text-unirv-green font-black flex items-center justify-center">
                        {item.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{item.user?.name}</h4>
                        <p className="text-xs text-slate-400">
                          RA: {item.user?.academicId || 'Não informado'} • Modalidade:{' '}
                          <span className="text-unirv-green font-bold">{item.sport.name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleStatusUpdate(item.id, 'REJECTED')}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
                      >
                        Recusar
                      </button>
                      <button
                        disabled={actionLoadingId === item.id}
                        onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-unirv-green text-slate-950 hover:bg-unirv-mid-green transition disabled:opacity-50"
                      >
                        {actionLoadingId === item.id ? 'Processando...' : 'Aprovar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ATLETAS DA ATLÉTICA (Diretoria) */}
        {currentTab === 'roster' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Inscrições da Atlética</h2>
              <p className="text-xs text-slate-400 mt-1">Histórico de todas as solicitações e seus status.</p>
            </div>

            {athleticsRegistrations.length === 0 ? (
              <EmptyState>Nenhuma inscrição registrada ainda.</EmptyState>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-slate-500 uppercase tracking-wider border-b border-slate-800">
                      <th className="py-3 pr-4">Atleta</th>
                      <th className="py-3 pr-4">RA</th>
                      <th className="py-3 pr-4">Modalidade</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {athleticsRegistrations.map((reg) => (
                      <tr key={reg.id} className="border-b border-slate-800/60">
                        <td className="py-3 pr-4 font-bold text-white">{reg.user?.name}</td>
                        <td className="py-3 pr-4 text-slate-400">{reg.user?.academicId || '—'}</td>
                        <td className="py-3 pr-4 text-slate-300">{reg.sport.name}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full font-bold border ${REGISTRATION_BADGE[reg.status].color}`}>
                            {REGISTRATION_BADGE[reg.status].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MINHAS PARTIDAS (Oficial de Mesa) */}
        {currentTab === 'officiating' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Partidas sob sua Responsabilidade</h2>
              <p className="text-xs text-slate-400 mt-1">Jogos em que você foi escalado como oficial de mesa.</p>
            </div>
            {officiatingMatches.length === 0 ? (
              <EmptyState>Nenhuma partida atribuída a você.</EmptyState>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {officiatingMatches.map((match) => (
                  <div key={match.id} className="space-y-2">
                    <MatchCard match={match} />
                    <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">
                      Status: {MATCH_STATUS_LABEL[match.status]}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

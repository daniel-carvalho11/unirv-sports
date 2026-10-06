'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UNIRV_ATHLETICS, getAthleticLogo } from '@/lib/athletics';
import {
  getMyRegistrations,
  requestSportRegistration,
  getPendingRegistrations,
  updateRegistrationStatus,
  SportRegistration,
} from '@/lib/registrations';

interface AthleticInfo {
  id: number;
  name: string;
  acronym: string;
  degreeProgram?: string;
}

interface UserData {
  id: number | string;
  name?: string;
  email: string;
  role: 'ADMIN' | 'REPRESENTATIVE' | 'TABLE_OFFICIAL' | 'ATHLETE' | 'VISITOR';
  athleticsId?: number;
  athletics?: AthleticInfo | null;
}

interface Match {
  id: number;
  sport: string;
  teamA: string;
  teamB: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

interface SportFromApi {
  id: number;
  name: string;
  gender: string;
  type: string;
  shortDesc: string | null;
  iconUrl: string | null;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'matches' | 'sports' | 'pending'>('overview');

  // Estados de dados da API
  const [sports, setSports] = useState<SportFromApi[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<SportRegistration[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<SportRegistration[]>([]);
  
  // Estados de carregamento de ações
  const [submittingSportId, setSubmittingSportId] = useState<number | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  // Lista Mock de Próximos Jogos
  const matches: Match[] = [
    { id: 1, sport: 'Futsal Masculino', teamA: 'FAMERV', teamB: 'Grifo', date: '30/09/2026', time: '19:30', location: 'Ginásio Campus Rio Verde', category: 'Fase de Grupos' },
    { id: 2, sport: 'Beach Tennis', teamA: 'Alcateia', teamB: 'AAAFORV', date: '02/10/2026', time: '16:00', location: 'Arena Areia UniRV', category: 'Semifinal' },
    { id: 3, sport: 'Vôlei Feminino', teamA: 'FAMERV', teamB: 'Neurótica', date: '04/10/2026', time: '10:00', location: 'Ginásio Campus Rio Verde', category: 'Final' },
  ];

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      router.push('/');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Carrega modalidades e dados de inscrição conforme o tipo de usuário
  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        // 1. Buscar todas as modalidades disponíveis
        const sportsRes = await fetch(`${apiUrl}/sports`);
        if (sportsRes.ok) {
          const sportsData = await sportsRes.json();
          setSports(sportsData);
        }

        if (user) {
          // 2. Se for Atleta, buscar as inscrições do atleta
          if (user.role === 'ATHLETE') {
            const regs = await getMyRegistrations();
            setMyRegistrations(regs);
          }

          // 3. Se for Diretor de Atlética, buscar solicitações pendentes da atlética
          if (user.role === 'REPRESENTATIVE') {
            const pending = await getPendingRegistrations();
            setPendingRegistrations(pending);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados do Dashboard:', err);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/');
  };

  // Solicitar Inscrição na Modalidade (Atleta)
  const handleRequestRegistration = async (sportId: number) => {
    try {
      setSubmittingSportId(sportId);
      await requestSportRegistration(sportId);
      // Recarrega as inscrições atualizadas
      const updatedRegs = await getMyRegistrations();
      setMyRegistrations(updatedRegs);
    } catch (err: any) {
      alert(err.message || 'Erro ao solicitar inscrição.');
    } finally {
      setSubmittingSportId(null);
    }
  };

  // Aprovar ou Rejeitar Inscrição (Diretor de Atlética)
  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoadingId(id);
      await updateRegistrationStatus(id, status);
      setPendingRegistrations((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Falha ao atualizar status da solicitação.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 font-medium animate-pulse">Carregando painel...</p>
      </div>
    );
  }

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'REPRESENTATIVE':
        return { label: 'Diretoria de Atlética', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'ATHLETE':
        return { label: 'Atleta Universitário', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
      case 'TABLE_OFFICIAL':
        return { label: 'Oficial de Mesa', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
      case 'ADMIN':
        return { label: 'Administrador Geral', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Aluno / Torcedor', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getRoleBadge(user?.role);

  // Busca dados estáticos adicionais da atlética
  const userAthleticData = UNIRV_ATHLETICS.find(
    (a) => a.acronym.toLowerCase() === user?.athletics?.acronym?.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Navbar */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-white cursor-pointer" onClick={() => router.push('/')}>
            UniRV <span className="text-unirv-green">Esportes</span>
          </span>
          <span className={`text-xs px-3 py-1 rounded-full border font-bold ${badge.color}`}>
            {badge.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            {user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3.5 py-1.5 rounded-xl transition-all"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        
        {/* Banner Principal */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Olá, {user?.name || 'Atleta UniRV'}!
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-lg leading-relaxed">
              Gerencie suas modalidades esportivas, acompanhe o calendário oficial de partidas e solicite inscrição em novas equipes.
            </p>
          </div>

          <div className="flex gap-3">
            {user?.role === 'REPRESENTATIVE' ? (
              <button
                onClick={() => setActiveTab('pending')}
                className="px-4 py-3 bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-unirv-green/10"
              >
                Gerenciar Inscrições ({pendingRegistrations.length})
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('sports')}
                className="px-4 py-3 bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-unirv-green/10"
              >
                Inscrever em Modalidades
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

        {/* Navegação de Abas */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-unirv-green text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'matches'
                ? 'bg-unirv-green text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Próximos Jogos ({matches.length})
          </button>
          
          <button
            onClick={() => setActiveTab('sports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sports'
                ? 'bg-unirv-green text-slate-950'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Modalidades
          </button>

          {user?.role === 'REPRESENTATIVE' && (
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-unirv-green text-slate-950'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              Aprovações Pendentes
              {pendingRegistrations.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] bg-emerald-500 text-slate-950 rounded-full font-black">
                  {pendingRegistrations.length}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Conteúdo Aba: VISÃO GERAL */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Inscrições */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {user?.role === 'REPRESENTATIVE' ? 'Solicitações Pendentes' : 'Minhas Inscrições'}
                </span>
                <p className="text-2xl font-black text-unirv-green mt-2">
                  {user?.role === 'REPRESENTATIVE'
                    ? `${pendingRegistrations.length} Pendente(s)`
                    : `${myRegistrations.length} Modalidade(s)`}
                </p>
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {user?.role === 'REPRESENTATIVE'
                    ? 'Aguardando aprovação da diretoria'
                    : myRegistrations.length > 0
                    ? myRegistrations.map((r) => r.sport.name).join(', ')
                    : 'Nenhuma solicitação enviada'}
                </p>
              </div>

              {/* Card Próxima Partida */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Próxima Partida</span>
                <p className="text-xl font-black text-white mt-2">{matches[0].sport}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {matches[0].date} às {matches[0].time} • {matches[0].location}
                </p>
              </div>

              {/* Card Atlética Vinculada */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between hover:border-unirv-green/40 transition-all group">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    Atlética Vinculada
                  </span>
                  <p className="text-xl font-black text-unirv-green">
                    {user?.athletics?.name || 'Sem Atlética Vinculada'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {userAthleticData?.course || user?.athletics?.degreeProgram || 'Perfil ativo no sistema'}
                  </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform overflow-hidden relative">
                  {user?.athletics?.acronym ? (
                    <img
                      src={getAthleticLogo(user.athletics.acronym)}
                      alt={user.athletics.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xs font-black text-slate-400 uppercase">
                      UNIRV
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Resumo de Jogos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Próximos Jogos da Semana</h2>
                <button
                  onClick={() => setActiveTab('matches')}
                  className="text-xs font-bold text-unirv-green hover:underline"
                >
                  Ver todos →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.slice(0, 2).map((match) => (
                  <div key={match.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
                        <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-white">{match.sport}</span>
                        <span>{match.category}</span>
                      </div>
                      <div className="flex items-center justify-around py-4 my-2 border-y border-slate-900">
                        <div className="flex items-center gap-2">
                          <img 
                            src={getAthleticLogo(match.teamA)} 
                            alt={match.teamA} 
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-black text-sm text-white">{match.teamA}</span>
                        </div>

                        <span className="text-xs font-extrabold text-slate-600 uppercase">VS</span>

                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">{match.teamB}</span>
                          <img 
                            src={getAthleticLogo(match.teamB)} 
                            alt={match.teamB} 
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
                      <span>📍 {match.location}</span>
                      <span className="font-bold text-unirv-green">🗓️ {match.date} - {match.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Aba: PRÓXIMOS JOGOS */}
        {activeTab === 'matches' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Calendário de Partidas</h2>
              <p className="text-xs text-slate-400 mt-1">
                Acompanhe as datas, horários e locais dos jogos das atléticas da UniRV.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matches.map((match) => (
                <div key={match.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-3">
                      <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-unirv-green font-bold">{match.sport}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{match.category}</span>
                    </div>

                    <div className="flex items-center justify-between py-6 my-2 border-y border-slate-900">
                      <div className="flex items-center gap-2">
                        <img 
                          src={getAthleticLogo(match.teamA)} 
                          alt={match.teamA} 
                          className="w-8 h-8 object-contain"
                        />
                        <span className="font-black text-base text-white">{match.teamA}</span>
                      </div>

                      <span className="text-xs font-black text-slate-600">VS</span>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-white">{match.teamB}</span>
                        <img 
                          src={getAthleticLogo(match.teamB)} 
                          alt={match.teamB} 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-400 pt-3">
                    <p className="flex items-center gap-2">
                      <span>📅</span> <strong className="text-white">{match.date} às {match.time}</strong>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>📍</span> {match.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conteúdo Aba: MODALIDADES E MINHAS SOLICITAÇÕES */}
        {activeTab === 'sports' && (
          <div className="space-y-8">
            {/* Seção Minhas Inscrições Existentes (para Atleta) */}
            {user?.role === 'ATHLETE' && myRegistrations.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-black text-white">Minhas Solicitações de Modalidade</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRegistrations.map((reg) => (
                    <div key={reg.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-sm">{reg.sport.name}</h4>
                        <p className="text-xs text-slate-400">Categoria: {reg.sport.gender}</p>
                      </div>
                      <div>
                        {reg.status === 'APPROVED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Aprovado
                          </span>
                        )}
                        {reg.status === 'REJECTED' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Recusado
                          </span>
                        )}
                        {reg.status === 'PENDING' && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modalidades Disponíveis na API */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-white">Modalidades Disponíveis</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Solicite sua inscrição nas modalidades para participar dos treinos e representar sua atlética nos torneios.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sports.map((sport) => {
                  const registration = myRegistrations.find((r) => r.sportId === sport.id);
                  const isPending = registration?.status === 'PENDING';
                  const isApproved = registration?.status === 'APPROVED';

                  return (
                    <div key={sport.id} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl">{sport.iconUrl || '🏆'}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-slate-400">
                            {sport.gender}
                          </span>
                        </div>
                        <h3 className="text-base font-black text-white">{sport.name}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {sport.shortDesc || 'Modalidade oficial dos jogos universitários.'}
                        </p>
                      </div>

                      {/* Botão dinâmico conectado à API */}
                      {isApproved ? (
                        <div className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Inscrição Aprovada
                        </div>
                      ) : isPending ? (
                        <div className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Solicitação Pendente
                        </div>
                      ) : (
                        <button
                          disabled={submittingSportId === sport.id}
                          onClick={() => handleRequestRegistration(sport.id)}
                          className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-unirv-green hover:bg-unirv-mid-green text-slate-950 shadow-lg shadow-unirv-green/10 disabled:opacity-50"
                        >
                          {submittingSportId === sport.id ? 'Enviando...' : 'Solicitar Inscrição'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Conteúdo Aba: APROVAÇÕES PENDENTES (Diretoria) */}
        {activeTab === 'pending' && user?.role === 'REPRESENTATIVE' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-xl font-black text-white">Aprovações de Atletas Pendentes</h2>
              <p className="text-xs text-slate-400 mt-1">
                Revise e aprove as solicitações de inscrição dos atletas vinculados à sua atlética.
              </p>
            </div>

            {pendingRegistrations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">Nenhuma solicitação pendente no momento.</p>
            ) : (
              <div className="space-y-3">
                {pendingRegistrations.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {item.user?.photoUrl ? (
                        <img
                          src={item.user.photoUrl}
                          alt={item.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-unirv-green/20 text-unirv-green font-black flex items-center justify-center">
                          {item.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-white text-sm">{item.user?.name}</h4>
                        <p className="text-xs text-slate-400">
                          RA: {item.user?.academicId || 'Não informado'} • Modalidade:{' '}
                          <span className="text-unirv-green font-bold">
                            {item.sport.name} ({item.sport.gender})
                          </span>
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

      </main>
    </div>
  );
}
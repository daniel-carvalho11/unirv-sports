'use client';

import { useState, useEffect } from 'react';
import {
  getMyRegistrations,
  requestSportRegistration,
  SportRegistration,
} from '@/lib/registrations';

interface Sport {
  id: number;
  name: string;
  gender: string;
}

export function AthleteRegistrations({ availableSports }: { availableSports: Sport[] }) {
  const [myRequests, setMyRequests] = useState<SportRegistration[]>([]);
  const [selectedSportId, setSelectedSportId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRegistrations();
      setMyRequests(data);
    } catch (error) {
      console.error('Erro ao buscar as minhas solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSportId) return;

    try {
      setSubmitting(true);
      await requestSportRegistration(Number(selectedSportId));
      setSelectedSportId('');
      await fetchMyRequests();
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Erro ao solicitar inscrição.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Aprovado</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Recusado</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Pendente</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur">
        <h3 className="text-lg font-bold text-white mb-2">Solicitar Inscrição em Modalidade</h3>
        <form onSubmit={handleRequestSubmit} className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedSportId}
            onChange={(e) => setSelectedSportId(e.target.value ? Number(e.target.value) : '')}
            className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm rounded-lg p-2.5 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="">Selecione uma modalidade...</option>
            {availableSports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name} ({sport.gender})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedSportId || submitting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition"
          >
            {submitting ? 'A enviar...' : 'Solicitar'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur">
        <h3 className="text-lg font-bold text-white mb-4">Minhas Modalidades</h3>
        {loading ? (
          <p className="text-sm text-gray-400">A carregar...</p>
        ) : myRequests.length === 0 ? (
          <p className="text-sm text-gray-400">Ainda não solicitou inscrição em nenhuma modalidade.</p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                <div>
                  <h4 className="font-semibold text-white text-sm">{req.sport.name}</h4>
                  <p className="text-xs text-gray-400">Categoria: {req.sport.gender}</p>
                </div>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
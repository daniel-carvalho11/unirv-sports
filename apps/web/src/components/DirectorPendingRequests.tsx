'use client';

import { useState, useEffect } from 'react';
import {
  getPendingRegistrations,
  updateRegistrationStatus,
  SportRegistration,
} from '@/lib/registrations';

export function DirectorPendingRequests() {
  const [requests, setRequests] = useState<SportRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingRegistrations();
      setRequests(data);
    } catch (error) {
      console.error('Erro ao carregar solicitações pendentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      setActionLoadingId(id);
      await updateRegistrationStatus(id, status);
      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Falha ao processar solicitação.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-400">A carregar solicitações...</div>;
  }

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white mb-4">
        Solicitações de Inscrição Pendentes
      </h2>

      {requests.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma solicitação pendente no momento.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-gray-800/80 border border-gray-700/50 gap-4"
            >
              <div className="flex items-center gap-3">
                {item.user?.photoUrl ? (
                  <img
                    src={item.user.photoUrl}
                    alt={item.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center">
                    {item.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-white">{item.user?.name}</h4>
                  <p className="text-xs text-gray-400">
                    RA: {item.user?.academicId || 'Não informado'} • Modalidade:{' '}
                    <span className="text-emerald-400 font-medium">
                      {item.sport.name} ({item.sport.gender})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  disabled={actionLoadingId === item.id}
                  onClick={() => handleStatusUpdate(item.id, 'REJECTED')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition disabled:opacity-50"
                >
                  Recusar
                </button>
                <button
                  disabled={actionLoadingId === item.id}
                  onClick={() => handleStatusUpdate(item.id, 'APPROVED')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-50"
                >
                  {actionLoadingId === item.id ? 'A processar...' : 'Aprovar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
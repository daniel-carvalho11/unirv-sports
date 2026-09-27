'use client';

import React, { useState } from 'react';
import { loginRequest } from '@/lib/api';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
  onSwitchType: (type: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, type, onClose, onSwitchType }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'login') {
        const data = await loginRequest(email, password);
        
        // Guarda o token de acesso no localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(`Bem-vindo, ${data.user.email}! Login efetuado com sucesso.`);
        onClose();
      } else {
        alert('O registo direto pode ser efetuado após a criação da conta via API ou painel de gestão.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-white mb-2">
          {type === 'login' ? 'Área de Login' : 'Criar Conta'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {type === 'login'
            ? 'Introduza as suas credenciais para aceder à plataforma UniRV Esportes.'
            : 'Selecione o seu perfil para aceder às funcionalidades.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              E-mail Institucional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@unirv.edu.br"
              className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green focus:ring-1 focus:ring-unirv-green py-3 px-4 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green focus:ring-1 focus:ring-unirv-green py-3 px-4 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 mt-2 disabled:opacity-50"
          >
            {loading ? 'A autenticar...' : type === 'login' ? 'Entrar na Plataforma' : 'Continuar'}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            {type === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?'}{' '}
            <button
              onClick={() => onSwitchType(type === 'login' ? 'register' : 'login')}
              className="font-bold text-unirv-green hover:underline"
            >
              {type === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
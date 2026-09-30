'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginRequest, registerRequest, UserRoleType } from '@/lib/api';
import { UNIRV_ATHLETICS } from '@/lib/athletics';

interface AuthModalProps {
  isOpen: boolean;
  type: 'login' | 'register';
  onClose: () => void;
  onSwitchType: (type: 'login' | 'register') => void;
}

export function AuthModal({ isOpen, type, onClose, onSwitchType }: AuthModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRoleType>('VISITOR');
  const [athleticsId, setAthleticsId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  if (!isOpen) return null;

  const showAthleticSelect = role === 'ATHLETE' || role === 'REPRESENTATIVE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'login') {
        const data = await loginRequest(email, password);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user || { email }));
        alert('Login efetuado com sucesso!');
        onClose();
        router.push('/dashboard');
      } else {
        await registerRequest({
          name,
          email,
          password,
          role,
          ...(showAthleticSelect && { athleticsId }),
        });
        alert('Conta criada com sucesso! Agora efetue o login.');
        onSwitchType('login');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao conectar ao servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h3 className="text-2xl font-black text-white mb-1">
          {type === 'login' ? 'Área de Login' : 'Criar Nova Conta'}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {type === 'login'
            ? 'Acesse com seu e-mail cadastrado.'
            : 'Preencha os dados para criar seu acesso na plataforma.'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green py-3 px-4 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Tipo de Perfil
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRoleType)}
                  className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green py-3 px-4 outline-none"
                >
                  <option value="VISITOR">Aluno / Torcedor</option>
                  <option value="ATHLETE">Atleta Universitário</option>
                  <option value="REPRESENTATIVE">Diretoria de Atlética</option>
                  <option value="TABLE_OFFICIAL">Oficial de Mesa</option>
                </select>
              </div>

              {/* Campo Dinâmico: Aparece apenas para Atletas e Diretores de Atlética */}
              {showAthleticSelect && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Sua Atlética
                  </label>
                  <select
                    value={athleticsId}
                    onChange={(e) => setAthleticsId(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green py-3 px-4 outline-none"
                  >
                    {UNIRV_ATHLETICS.map((ath) => (
                      <option key={ath.id} value={ath.id}>
                        {ath.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@unirv.edu.br"
              className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green py-3 px-4 outline-none"
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
              className="w-full text-xs rounded-xl border border-slate-700 bg-slate-800 text-white focus:border-unirv-green py-3 px-4 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-unirv-green hover:bg-unirv-mid-green text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all duration-200 mt-2 disabled:opacity-50"
          >
            {loading
              ? 'Aguarde...'
              : type === 'login'
              ? 'Entrar na Plataforma'
              : 'Concluir Cadastro'}
          </button>
        </form>

        <div className="pt-6 mt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            {type === 'login' ? 'Ainda não tem conta?' : 'Já possui uma conta?'}{' '}
            <button
              type="button"
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
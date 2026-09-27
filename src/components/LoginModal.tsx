import React, { useState } from 'react';
import { Shield, User, KeyRound, AlertCircle, X, Check } from 'lucide-react';
import { ActiveUser, Contractor } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractors: Contractor[];
  onLoginSuccess: (user: ActiveUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  contractors,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Gestor Tia Drika
    if (
      (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'tiadrika') &&
      password.trim() === '123'
    ) {
      onLoginSuccess({
        role: 'gestor',
        name: 'Tia Drika',
        username: 'tiadrika',
      });
      onClose();
      return;
    }

    // Check Contractors
    const foundContractor = contractors.find(
      (c) =>
        c.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        c.password.trim() === password.trim()
    );

    if (foundContractor) {
      if (foundContractor.status === 'inativo') {
        setError('Este cadastro está desativado no momento. Entre em contato com a Tia Drika.');
        return;
      }
      onLoginSuccess({
        role: 'contractor',
        contractorId: foundContractor.id,
        name: foundContractor.name,
        username: foundContractor.username,
      });
      onClose();
      return;
    }

    setError('Usuário ou senha inválidos. Verifique as credenciais fornecidas pela Tia Drika.');
  };

  const handleQuickLogin = (role: 'gestor' | 'contractor', contractorId?: string) => {
    if (role === 'gestor') {
      onLoginSuccess({
        role: 'gestor',
        name: 'Tia Drika',
        username: 'tiadrika',
      });
    } else if (contractorId) {
      const c = contractors.find((item) => item.id === contractorId);
      if (c) {
        onLoginSuccess({
          role: 'contractor',
          contractorId: c.id,
          name: c.name,
          username: c.username,
        });
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-amber-400 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm mb-3">
            🚐
          </div>
          <h2 className="text-2xl font-black text-stone-900 font-display">Acesso ao Sistema</h2>
          <p className="text-xs text-stone-500 mt-1">
            Transporte Escolar Tia Drika · Portal do Contratante & Gestão
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Usuário (fornecido pelo gestor)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: mariana.ramos ou admin"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Senha de Acesso</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-sm transition hover:shadow flex items-center justify-center gap-2"
          >
            <span>Entrar no Sistema</span>
          </button>
        </form>

        {/* Quick Demo Access Buttons */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 text-center mb-2.5">
            Acesso Rápido para Teste
          </p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('gestor')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100/80 transition text-left text-xs font-semibold text-amber-950"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Entrar como Gestor (Tia Drika)</span>
              </div>
              <span className="text-[10px] text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded font-mono">
                admin / 123
              </span>
            </button>

            {contractors.slice(0, 2).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleQuickLogin('contractor', c.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition text-left text-xs font-semibold text-stone-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <User className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Contratante: {c.name.split(' ')[0]} ({c.students[0]?.name.split(' ')[0]})</span>
                </div>
                <span className="text-[10px] text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded font-mono shrink-0 ml-1">
                  {c.username} / 123
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

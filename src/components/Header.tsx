import React, { useState } from 'react';
import {
  Bell,
  LogOut,
  UserCheck,
  Shield,
  User,
  Users,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ActiveUser, Contractor, NotificationItem } from '../types';

interface HeaderProps {
  activeUser: ActiveUser;
  contractors: Contractor[];
  notifications: NotificationItem[];
  onSwitchUser: (user: ActiveUser) => void;
  onOpenLoginModal: () => void;
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onOpenAnnouncementsModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeUser,
  contractors,
  notifications,
  onSwitchUser,
  onOpenLoginModal,
  onMarkNotificationAsRead,
  onClearNotifications,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  // Filter notifications for current user
  const userNotifications = notifications.filter(
    (n) =>
      activeUser.role === 'gestor' ||
      n.contractorId === 'todos' ||
      n.contractorId === activeUser.contractorId
  );

  const unreadCount = userNotifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 border border-amber-600/30 flex items-center justify-center text-xl shadow-xs shrink-0">
              🚐
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  Transporte Escolar
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-display leading-tight">
                TIA DRIKA
              </h1>
            </div>
          </div>

          {/* Action Center: Role info, Notification Bell & Quick Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowSwitchMenu(false);
                }}
                className="relative p-2.5 rounded-xl text-stone-700 hover:text-amber-900 hover:bg-amber-100/70 transition border border-transparent hover:border-amber-200"
                aria-label="Notificações"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-xl border border-stone-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">Notificações e Avisos</span>
                      <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                        {userNotifications.length}
                      </span>
                    </div>
                    {userNotifications.length > 0 && (
                      <button
                        onClick={onClearNotifications}
                        className="text-xs text-stone-500 hover:text-amber-700 underline font-medium"
                      >
                        Limpar lidas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                    {userNotifications.length === 0 ? (
                      <div className="py-8 text-center text-stone-500 text-sm">
                        <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-1 opacity-70" />
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      userNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            n.read
                              ? 'bg-stone-50/70 border-stone-200/60 text-stone-600'
                              : 'bg-amber-50/90 border-amber-300 text-stone-900 font-medium shadow-xs'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {n.type === 'vencimento_2_dias' && (
                              <Calendar className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'vencimento_hoje' && (
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'vencimento_atrasado' && (
                              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                            )}
                            {n.type === 'pagamento_confirmado' && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            )}
                            {(n.type === 'comunicado' || n.type === 'aviso') && (
                              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-stone-900">{n.title}</p>
                              <p className="text-stone-700 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-stone-400 mt-1 block">
                                {n.date.split('-').reverse().join('/')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowSwitchMenu(!showSwitchMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 transition text-left"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activeUser.role === 'gestor'
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {activeUser.role === 'gestor' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-xs font-bold text-stone-900 truncate max-w-[140px]">
                    {activeUser.name}
                  </p>
                  <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                    {activeUser.role === 'gestor' ? 'Gestora Tia Drika' : 'Contratante'}
                  </p>
                </div>
              </button>

              {/* Profile Switcher Menu */}
              {showSwitchMenu && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in">
                  <div className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100">
                    Alternar Acesso (Demonstração)
                  </div>

                  <div className="space-y-1 mt-1">
                    {/* Switch to Tia Drika */}
                    <button
                      onClick={() => {
                        onSwitchUser({
                          role: 'gestor',
                          name: 'Tia Drika',
                          username: 'admin',
                        });
                        setShowSwitchMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                        activeUser.role === 'gestor'
                          ? 'bg-amber-100 text-amber-950 font-bold'
                          : 'hover:bg-stone-100 text-stone-800'
                      }`}
                    >
                      <Shield className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="font-bold">Tia Drika (Gestor)</p>
                        <p className="text-[10px] text-stone-500">Acesso administrativo completo</p>
                      </div>
                      {activeUser.role === 'gestor' && (
                        <UserCheck className="w-4 h-4 text-amber-700 ml-auto" />
                      )}
                    </button>

                    {/* Switch to Registered Contractors */}
                    <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-stone-400">
                      Contratantes Cadastrados:
                    </div>

                    {contractors.map((c) => {
                      const isCurrent =
                        activeUser.role === 'contractor' && activeUser.contractorId === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSwitchUser({
                              role: 'contractor',
                              contractorId: c.id,
                              name: c.name,
                              username: c.username,
                            });
                            setShowSwitchMenu(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition ${
                            isCurrent
                              ? 'bg-emerald-100 text-emerald-950 font-bold'
                              : 'hover:bg-stone-100 text-stone-800'
                          }`}
                        >
                          <User className="w-4 h-4 text-emerald-600" />
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{c.name}</p>
                            <p className="text-[10px] text-stone-500 truncate">
                              Filhos: {c.students.map((s) => s.name).join(', ')}
                            </p>
                          </div>
                          {isCurrent && <UserCheck className="w-4 h-4 text-emerald-700 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between px-2">
                    <button
                      onClick={() => {
                        setShowSwitchMenu(false);
                        onOpenLoginModal();
                      }}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Fazer Login com outro usuário
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Login Modal Trigger */}
            <button
              onClick={onOpenLoginModal}
              title="Trocar de Conta / Fazer Login"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

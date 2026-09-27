/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Contractor,
  PaymentInstallment,
  PixConfig,
  Announcement,
  NotificationItem,
  ChatMessage,
  ActiveUser,
  ChatCategory,
} from './types';
import {
  loadData,
  saveContractors,
  saveInstallments,
  savePixConfig,
  saveAnnouncements,
  saveNotifications,
  saveChatMessages,
  getActiveUser,
  setActiveUser as persistActiveUser,
} from './services/storage';
import { Header } from './components/Header';
import { LoginModal } from './components/LoginModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ContractorModal } from './components/admin/ContractorModal';
import { PixConfigModal } from './components/admin/PixConfigModal';
import { AnnouncementModal } from './components/admin/AnnouncementModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ContractorDashboard } from './components/contractor/ContractorDashboard';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeUser, setActiveUserState] = useState<ActiveUser>(getActiveUser());

  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [installments, setInstallments] = useState<PaymentInstallment[]>([]);
  const [pixConfig, setPixConfig] = useState<PixConfig>({
    key: '(27) 99581-6987',
    keyType: 'telefone',
    beneficiaryName: 'Adriana Silva (Tia Drika)',
    city: 'Vitória - ES',
    bank: 'Nubank (260)',
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isContractorModalOpen, setIsContractorModalOpen] = useState(false);
  const [contractorToEdit, setContractorToEdit] = useState<Contractor | null>(null);
  const [isPixConfigModalOpen, setIsPixConfigModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [receiptModal, setReceiptModal] = useState<{
    isOpen: boolean;
    contractor: Contractor | null;
    installment: PaymentInstallment | null;
  }>({
    isOpen: false,
    contractor: null,
    installment: null,
  });

  // Toast feedback
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Initial loading from storage & notification engine
  useEffect(() => {
    const data = loadData();
    setContractors(data.contractors);
    setInstallments(data.installments);
    setPixConfig(data.pixConfig);
    setAnnouncements(data.announcements);
    setChatMessages(data.chatMessages);
    setNotifications(data.notifications);
    setDataLoaded(true);
  }, []);

  const handleSwitchUser = (user: ActiveUser) => {
    setActiveUserState(user);
    persistActiveUser(user);
    showToast(`Alternado para perfil: ${user.name}`, 'info');
  };

  const handleLoginSuccess = (user: ActiveUser) => {
    setActiveUserState(user);
    persistActiveUser(user);
    showToast(`Bem-vindo(a), ${user.name}!`, 'success');
  };

  // Save new or edited contractor
  const handleSaveContractor = (contractor: Contractor) => {
    let updatedList: Contractor[];
    const exists = contractors.some((c) => c.id === contractor.id);

    if (exists) {
      updatedList = contractors.map((c) => (c.id === contractor.id ? contractor : c));
      showToast(`Cadastro de ${contractor.name} atualizado!`, 'success');
    } else {
      updatedList = [contractor, ...contractors];
      showToast(`Novo contratante ${contractor.name} cadastrado com sucesso!`, 'success');

      // Create initial installment for this contractor
      const today = new Date();
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const curMonth = `${monthNames[today.getMonth()]}/${today.getFullYear()}`;

      const newInstallments: PaymentInstallment[] = [];
      if (contractor.dueOption === 'ambos') {
        const half = contractor.monthlyFee / 2;
        newInstallments.push(
          {
            id: 'inst-' + Date.now() + '-15',
            contractorId: contractor.id,
            referenceMonth: curMonth,
            dueDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-15`,
            dueDay: 15,
            totalAmount: contractor.splitValueDia15 || half,
            paidAmount: 0,
            method: contractor.paymentMethod,
            status: 'pendente',
          },
          {
            id: 'inst-' + Date.now() + '-30',
            contractorId: contractor.id,
            referenceMonth: curMonth,
            dueDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-30`,
            dueDay: 30,
            totalAmount: contractor.splitValueDia30 || half,
            paidAmount: 0,
            method: contractor.paymentMethod,
            status: 'pendente',
          }
        );
      } else {
        const day = contractor.dueOption === 'dia_15' ? 15 : 30;
        newInstallments.push({
          id: 'inst-' + Date.now(),
          contractorId: contractor.id,
          referenceMonth: curMonth,
          dueDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${day}`,
          dueDay: day,
          totalAmount: contractor.monthlyFee,
          paidAmount: 0,
          method: contractor.paymentMethod,
          status: 'pendente',
        });
      }

      const updatedInstallments = [...installments, ...newInstallments];
      setInstallments(updatedInstallments);
      saveInstallments(updatedInstallments);
    }

    setContractors(updatedList);
    saveContractors(updatedList);
  };

  const handleDeleteContractor = (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este contratante?')) return;
    const updated = contractors.filter((c) => c.id !== id);
    setContractors(updated);
    saveContractors(updated);
    showToast('Contratante removido com sucesso.', 'info');
  };

  const handleSavePixConfig = (newConfig: PixConfig) => {
    setPixConfig(newConfig);
    savePixConfig(newConfig);
    showToast('Chave PIX atualizada com sucesso!', 'success');
  };

  const handleAddAnnouncement = (ann: Announcement) => {
    const updated = [ann, ...announcements];
    setAnnouncements(updated);
    saveAnnouncements(updated);

    // Notify all contractors
    const newNotif: NotificationItem = {
      id: 'notif-ann-' + Date.now(),
      contractorId: 'todos',
      title: '📢 Novo Comunicado da Tia Drika',
      message: ann.title,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'comunicado',
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);

    showToast('Comunicado publicado para todos os pais!', 'success');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    saveAnnouncements(updated);
    showToast('Comunicado removido.', 'info');
  };

  // Confirm payment (by manager or cash receive)
  const handleConfirmPayment = (
    installmentId: string,
    amount: number,
    method: 'pix' | 'dinheiro'
  ) => {
    const updated = installments.map((inst) => {
      if (inst.id === installmentId) {
        const isFull = amount >= inst.totalAmount;
        return {
          ...inst,
          paidAmount: amount,
          status: isFull ? ('pago' as const) : ('parcial' as const),
          method,
          paidAt: new Date().toLocaleString('pt-BR'),
          receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
        };
      }
      return inst;
    });

    setInstallments(updated);
    saveInstallments(updated);

    const inst = installments.find((i) => i.id === installmentId);
    if (inst) {
      const c = contractors.find((item) => item.id === inst.contractorId);
      // Create confirmed notification for contractor
      const newNotif: NotificationItem = {
        id: 'notif-paid-' + Date.now(),
        contractorId: inst.contractorId,
        title: '✅ Pagamento Confirmado!',
        message: `Seu pagamento da parcela ${inst.referenceMonth} (dia ${inst.dueDay}) foi confirmado com sucesso por Tia Drika. Recibo disponível!`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'pagamento_confirmado',
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveNotifications(updatedNotifs);

      showToast(`Pagamento de ${c?.name || 'Contratante'} confirmado!`, 'success');
    }
  };

  // Toggle payment method directly on contractor dashboard
  const handleToggleContractorPaymentMethod = (method: 'pix' | 'dinheiro') => {
    if (!activeUser.contractorId) return;
    const updated = contractors.map((c) => {
      if (c.id === activeUser.contractorId) {
        return { ...c, paymentMethod: method };
      }
      return c;
    });
    setContractors(updated);
    saveContractors(updated);

    // Update ongoing installments method
    const updatedInst = installments.map((i) => {
      if (i.contractorId === activeUser.contractorId && i.status !== 'pago') {
        return { ...i, method };
      }
      return i;
    });
    setInstallments(updatedInst);
    saveInstallments(updatedInst);

    showToast(`Forma de pagamento alterada para: ${method.toUpperCase()}!`, 'success');
  };

  // Contractor pays installment via portal
  const handleContractorPayInstallment = (
    installmentId: string,
    amount: number,
    method: 'pix' | 'dinheiro'
  ) => {
    handleConfirmPayment(installmentId, amount, method);
  };

  // Contractor marks cash handover
  const handleMarkCashHandover = (installmentId: string) => {
    const updated = installments.map((inst) => {
      if (inst.id === installmentId) {
        return { ...inst, cashHandoverMarked: true };
      }
      return inst;
    });
    setInstallments(updated);
    saveInstallments(updated);

    // Notify Tia Drika
    const inst = installments.find((i) => i.id === installmentId);
    const contractor = contractors.find((c) => c.id === inst?.contractorId);

    const newNotif: NotificationItem = {
      id: 'cash-alert-' + Date.now(),
      contractorId: 'todos',
      title: '💵 Entrega de Dinheiro Informada',
      message: `${contractor?.name} informou que entregou o valor da mensalidade em dinheiro para você conferir.`,
      date: new Date().toISOString().split('T')[0],
      read: false,
      type: 'aviso',
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveNotifications(updatedNotifs);

    showToast('Aviso de entrega em dinheiro enviado para a Tia Drika!', 'success');
  };

  // Send Chat message
  const handleSendChatMessage = (
    contractorId: string,
    message: string,
    category: ChatCategory = 'geral'
  ) => {
    const isGestor = activeUser.role === 'gestor';
    const c = contractors.find((item) => item.id === contractorId);

    const newMsg: ChatMessage = {
      id: 'chat-' + Date.now(),
      contractorId,
      sender: isGestor ? 'gestor' : 'contractor',
      senderName: isGestor ? 'Tia Drika' : c?.name || activeUser.name,
      message,
      category,
      timestamp: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: false,
    };

    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveChatMessages(updated);

    showToast('Mensagem enviada com sucesso!', 'success');
  };

  // Broadcast manual reminder verification
  const handleBroadcastReminder = () => {
    const now = new Date();
    let remindersCreated = 0;

    const newNotifs: NotificationItem[] = [];

    installments.forEach((inst) => {
      if (inst.status === 'pago') return;
      const c = contractors.find((item) => item.id === inst.contractorId);
      if (!c) return;

      newNotifs.push({
        id: 'manual-remind-' + Date.now() + '-' + inst.id,
        contractorId: inst.contractorId,
        title: '📲 Lembrete de Pagamento de Mensalidade',
        message: `Olá ${c.name}! Passando para lembrar da mensalidade escolar de ${inst.referenceMonth} (vencimento dia ${inst.dueDay}). Chave PIX: ${pixConfig.key}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'lembrete_manual',
      });
      remindersCreated++;
    });

    if (remindersCreated > 0) {
      const updated = [...newNotifs, ...notifications];
      setNotifications(updated);
      saveNotifications(updated);
      showToast(`Disparados ${remindersCreated} lembretes para os contratantes pendentes!`, 'success');
    } else {
      showToast('Todas as mensalidades estão em dia no momento!', 'info');
    }
  };

  const handleMarkNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const handleClearNotifications = () => {
    const updated = notifications.filter((n) => !n.read);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const currentContractor =
    activeUser.role === 'contractor'
      ? contractors.find((c) => c.id === activeUser.contractorId) || contractors[0]
      : null;

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">🚐</div>
          <p className="font-bold text-stone-700">Carregando Transporte Escolar Tia Drika...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-stone-900">
      {/* Header with Role & Quick switch */}
      <Header
        activeUser={activeUser}
        contractors={contractors}
        notifications={notifications}
        onSwitchUser={handleSwitchUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        onClearNotifications={handleClearNotifications}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-300" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-200" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeUser.role === 'gestor' ? (
          <AdminDashboard
            contractors={contractors}
            installments={installments}
            pixConfig={pixConfig}
            announcements={announcements}
            chatMessages={chatMessages}
            onOpenNewContractor={() => {
              setContractorToEdit(null);
              setIsContractorModalOpen(true);
            }}
            onEditContractor={(c) => {
              setContractorToEdit(c);
              setIsContractorModalOpen(true);
            }}
            onDeleteContractor={handleDeleteContractor}
            onOpenNewAnnouncement={() => setIsAnnouncementModalOpen(true)}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onOpenPixConfig={() => setIsPixConfigModalOpen(true)}
            onConfirmPayment={handleConfirmPayment}
            onOpenReceipt={(c, inst) => {
              setReceiptModal({
                isOpen: true,
                contractor: c,
                installment: inst,
              });
            }}
            onSendMessage={(contractorId, text) =>
              handleSendChatMessage(contractorId, text, 'geral')
            }
            onBroadcastReminder={handleBroadcastReminder}
          />
        ) : (
          currentContractor && (
            <ContractorDashboard
              contractor={currentContractor}
              installments={installments}
              pixConfig={pixConfig}
              announcements={announcements}
              chatMessages={chatMessages}
              onTogglePaymentMethod={handleToggleContractorPaymentMethod}
              onPayInstallment={handleContractorPayInstallment}
              onMarkCashHandover={handleMarkCashHandover}
              onOpenReceipt={(c, inst) => {
                setReceiptModal({
                  isOpen: true,
                  contractor: c,
                  installment: inst,
                });
              }}
              onSendMessage={(category, text) =>
                handleSendChatMessage(currentContractor.id, text, category)
              }
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-stone-900 text-stone-300 py-6 border-t border-stone-800 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-extrabold text-amber-400 font-display text-sm tracking-wide">
            TRANSPORTE ESCOLAR TIA DRIKA
          </p>
          <p className="italic text-stone-400">
            &ldquo;Tradição, confiança, conforto e profissionalismo&rdquo;
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-stone-400 pt-1">
            <span>📞 (27) 9 9581-6987</span>
            <span>•</span>
            <span>📞 (27) 9 9956-3226</span>
            <span>•</span>
            <span>Faça já o seu orçamento!</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        contractors={contractors}
        onLoginSuccess={handleLoginSuccess}
      />

      <ContractorModal
        isOpen={isContractorModalOpen}
        onClose={() => {
          setIsContractorModalOpen(false);
          setContractorToEdit(null);
        }}
        onSave={handleSaveContractor}
        contractorToEdit={contractorToEdit}
      />

      <PixConfigModal
        isOpen={isPixConfigModalOpen}
        onClose={() => setIsPixConfigModalOpen(false)}
        pixConfig={pixConfig}
        onSavePixConfig={handleSavePixConfig}
      />

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onAddAnnouncement={handleAddAnnouncement}
      />

      {receiptModal.isOpen && receiptModal.contractor && receiptModal.installment && (
        <ReceiptModal
          isOpen={receiptModal.isOpen}
          onClose={() =>
            setReceiptModal({ isOpen: false, contractor: null, installment: null })
          }
          contractor={receiptModal.contractor}
          installment={receiptModal.installment}
        />
      )}
    </div>
  );
}

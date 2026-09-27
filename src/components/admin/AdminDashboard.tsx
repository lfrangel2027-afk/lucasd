import React, { useState } from 'react';
import {
  Users,
  CreditCard,
  MessageSquare,
  Megaphone,
  UserPlus,
  Send,
  Search,
  Filter,
  Phone,
  MessageCircle,
  MapPin,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  QrCode,
  DollarSign,
  FileText,
  Edit2,
  Trash2,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  BellRing,
} from 'lucide-react';
import {
  Contractor,
  PaymentInstallment,
  PixConfig,
  Announcement,
  ChatMessage,
  NotificationItem,
} from '../../types';
import { formatCurrency, formatPhone } from '../../services/viacep';
import { BusinessCardBadge } from '../BusinessCardBadge';

interface AdminDashboardProps {
  contractors: Contractor[];
  installments: PaymentInstallment[];
  pixConfig: PixConfig;
  announcements: Announcement[];
  chatMessages: ChatMessage[];
  onOpenNewContractor: () => void;
  onEditContractor: (c: Contractor) => void;
  onDeleteContractor: (id: string) => void;
  onOpenNewAnnouncement: () => void;
  onDeleteAnnouncement: (id: string) => void;
  onOpenPixConfig: () => void;
  onConfirmPayment: (installmentId: string, amount: number, method: 'pix' | 'dinheiro') => void;
  onOpenReceipt: (c: Contractor, inst: PaymentInstallment) => void;
  onSendMessage: (contractorId: string, text: string) => void;
  onBroadcastReminder: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  contractors,
  installments,
  pixConfig,
  announcements,
  chatMessages,
  onOpenNewContractor,
  onEditContractor,
  onDeleteContractor,
  onOpenNewAnnouncement,
  onDeleteAnnouncement,
  onOpenPixConfig,
  onConfirmPayment,
  onOpenReceipt,
  onSendMessage,
  onBroadcastReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'contractors' | 'finance' | 'chat' | 'announcements'>('contractors');
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('todas');
  const [paymentFilter, setPaymentFilter] = useState('todos');
  const [selectedChatContractorId, setSelectedChatContractorId] = useState<string>(
    contractors[0]?.id || ''
  );
  const [replyText, setReplyText] = useState('');

  // Financial calculations
  const totalStudents = contractors.reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const totalMonthlyTarget = contractors.reduce((acc, c) => acc + (c.monthlyFee || 0), 0);
  const totalPaid = installments.filter((i) => i.status === 'pago').reduce((acc, i) => acc + i.paidAmount, 0);
  const totalPending = installments
    .filter((i) => i.status !== 'pago')
    .reduce((acc, i) => acc + (i.totalAmount - i.paidAmount), 0);

  // Distinct schools
  const allSchools = Array.from(
    new Set([
      ...contractors.map((c) => c.school),
      ...contractors.flatMap((c) => c.students.map((s) => s.school)),
    ].filter(Boolean))
  );

  // Filtered contractors
  const filteredContractors = contractors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.students.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.school.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSchool =
      schoolFilter === 'todas' ||
      c.school === schoolFilter ||
      c.students.some((s) => s.school === schoolFilter);

    const matchesPayment =
      paymentFilter === 'todos' || c.paymentMethod === paymentFilter;

    return matchesSearch && matchesSchool && matchesPayment;
  });

  // Selected chat contractor
  const selectedContractor = contractors.find((c) => c.id === selectedChatContractorId) || contractors[0];
  const activeConversation = chatMessages.filter(
    (m) => m.contractorId === selectedContractor?.id
  );

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedContractor) return;
    onSendMessage(selectedContractor.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Brand Banner */}
      <BusinessCardBadge />

      {/* Stats KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Contratantes</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-stone-900 font-display">
            {contractors.length}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            <span className="font-semibold text-amber-700">{totalStudents} alunos</span> vinculados
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Recebido no Mês</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 font-display">
            {formatCurrency(totalPaid)}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Meta: {formatCurrency(totalMonthlyTarget)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">A Receber</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 font-display">
            {formatCurrency(totalPending)}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Parcelas dia 15 e dia 30
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Chave PIX Ativa</span>
            <QrCode className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-sm font-bold text-stone-900 truncate font-mono">
            {pixConfig.key}
          </p>
          <button
            onClick={onOpenPixConfig}
            className="text-xs text-amber-700 font-semibold underline mt-1 block"
          >
            Alterar chave PIX
          </button>
        </div>
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewContractor}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-xs transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Contratante & Filhos</span>
          </button>

          <button
            onClick={onOpenNewAnnouncement}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs transition"
          >
            <Megaphone className="w-4 h-4 text-amber-700" />
            <span>Enviar Comunicado</span>
          </button>

          <button
            onClick={onBroadcastReminder}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl text-xs transition"
            title="Dispara lembretes para parcelas a vencer em 2 dias e no dia de hoje"
          >
            <BellRing className="w-4 h-4 text-amber-700" />
            <span>Verificar Lembretes de Vencimento</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('contractors')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'contractors'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Contratantes ({contractors.length})
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'finance'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Financeiro & Recibos
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition relative ${
              activeTab === 'chat'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Atendimento / Chat
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'announcements'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Mural ({announcements.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CONTRACTORS & STUDENTS */}
      {activeTab === 'contractors' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por contratante, aluno, usuário ou escola..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 font-medium"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            <div className="sm:col-span-3">
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              >
                <option value="todas">Todas as Escolas</option>
                {allSchools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium"
              >
                <option value="todos">Todos os Meios</option>
                <option value="pix">PIX</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            </div>
          </div>

          {/* Contractors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredContractors.length === 0 ? (
              <div className="col-span-2 bg-white rounded-2xl p-8 text-center text-stone-500">
                <Users className="w-10 h-10 mx-auto text-amber-500 mb-2 opacity-50" />
                <p className="font-bold text-stone-800">Nenhum contratante encontrado.</p>
                <p className="text-xs text-stone-500 mt-1">
                  Tente ajustar a busca ou cadastre um novo contratante no botão acima.
                </p>
              </div>
            ) : (
              filteredContractors.map((c) => {
                const cInstallments = installments.filter((i) => i.contractorId === c.id);
                const hasPending = cInstallments.some((i) => i.status !== 'pago');

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition space-y-4"
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-stone-900 text-base font-display">
                            {c.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              c.paymentMethod === 'pix'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {c.paymentMethod === 'pix' ? '⚡ PIX' : '💵 Dinheiro'}
                          </span>
                        </div>
                        {/* Credentials reminder for manager */}
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                          <span>Acesso: <strong className="font-mono text-stone-800">{c.username}</strong> / senha: <span className="font-mono">{c.password}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditContractor(c)}
                          className="p-1.5 text-stone-400 hover:text-amber-700 rounded-lg hover:bg-stone-100 transition"
                          title="Editar Cadastro"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteContractor(c.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition"
                          title="Excluir Cadastro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Children linked */}
                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 space-y-2">
                      <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                        <span>Alunos Vinculados ({c.students.length}):</span>
                      </div>
                      <div className="space-y-1.5">
                        {c.students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-amber-200/60"
                          >
                            <span className="font-bold text-stone-800">{student.name}</span>
                            <span className="text-[11px] text-stone-500">
                              {student.grade ? `${student.grade} · ` : ''}
                              <strong className="text-amber-800">{student.shift}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Escola: <strong>{c.school}</strong>
                      </p>
                    </div>

                    {/* Address & Contacts */}
                    <div className="space-y-1.5 text-xs text-stone-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>
                          {c.street}, {c.number} {c.complement ? `(${c.complement})` : ''} - {c.neighborhood}, {c.city}/{c.state} (CEP: {c.cep})
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href={`https://wa.me/55${c.phonePrimary.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{c.phonePrimary}</span>
                        </a>

                        {c.phoneSecondary && (
                          <span className="text-stone-500">
                            Recado: {c.phoneSecondary}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Financial condition footer */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-bold">
                          Mensalidade:
                        </span>
                        <span className="font-extrabold text-stone-900 text-sm">
                          {formatCurrency(c.monthlyFee)}
                        </span>
                        <span className="text-stone-500 text-[11px] ml-1">
                          {c.dueOption === 'ambos'
                            ? '(Dia 15 e Dia 30)'
                            : c.dueOption === 'dia_15'
                            ? '(Dia 15)'
                            : '(Dia 30)'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedChatContractorId(c.id);
                            setActiveTab('chat');
                          }}
                          className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>Mensagem</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL TRACKER & RECEIPTS */}
      {activeTab === 'finance' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900 font-display">
                  Controle de Mensalidades & Vencimentos
                </h3>
                <p className="text-xs text-stone-500">
                  Gerencie o status de pagamento de cada contratante, emita recibos e confirme entregas em dinheiro ou PIX.
                </p>
              </div>

              <button
                onClick={onBroadcastReminder}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Disparar Lembretes Automáticos</span>
              </button>
            </div>

            {/* Installments Table / Card list */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Contratante / Aluno</th>
                    <th className="py-2.5 px-3">Vencimento</th>
                    <th className="py-2.5 px-3">Valor</th>
                    <th className="py-2.5 px-3">Forma</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {installments.map((inst) => {
                    const c = contractors.find((item) => item.id === inst.contractorId);
                    if (!c) return null;

                    const isPaid = inst.status === 'pago';

                    return (
                      <tr key={inst.id} className="hover:bg-amber-50/40 transition">
                        <td className="py-3 px-3">
                          <p className="font-bold text-stone-900">{c.name}</p>
                          <p className="text-[11px] text-stone-500">
                            {c.students.map((s) => s.name).join(', ')} · {c.school}
                          </p>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-semibold text-stone-800">
                            Dia {inst.dueDay} ({inst.referenceMonth})
                          </span>
                          <span className="block text-[10px] text-stone-500">
                            {inst.dueDate.split('-').reverse().join('/')}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <span className="font-extrabold text-stone-900">
                            {formatCurrency(inst.totalAmount)}
                          </span>
                          {inst.paidAmount > 0 && !isPaid && (
                            <span className="block text-[10px] text-emerald-700">
                              Pago: {formatCurrency(inst.paidAmount)}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                              inst.method === 'pix'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {inst.method === 'pix' ? 'PIX' : 'Dinheiro'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Pago ({inst.paidAt?.split(' ')[0] || 'Confirmado'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3.5 h-3.5" />
                              Pendente
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isPaid ? (
                              <button
                                onClick={() =>
                                  onConfirmPayment(inst.id, inst.totalAmount, inst.method)
                                }
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Confirmar Recebimento</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => onOpenReceipt(c, inst)}
                                className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs transition shadow-xs flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3 text-amber-400" />
                                <span>Ver Recibo</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHAT & ATENDIMENTO */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
          {/* Contractors Chat List */}
          <div className="md:col-span-4 border-r border-stone-200 bg-stone-50/50 p-3 space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2 py-1">
              Conversas com Contratantes
            </p>
            <div className="space-y-1">
              {contractors.map((c) => {
                const msgs = chatMessages.filter((m) => m.contractorId === c.id);
                const lastMsg = msgs[msgs.length - 1];
                const isSelected = selectedContractor?.id === c.id;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedChatContractorId(c.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition text-xs flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-100/90 text-stone-950 font-semibold shadow-xs'
                        : 'hover:bg-white text-stone-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-bold text-stone-950 text-xs shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-stone-900 truncate">{c.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {lastMsg ? lastMsg.message : 'Nenhuma mensagem recente'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Conversation Area */}
          <div className="md:col-span-8 flex flex-col justify-between p-4 bg-stone-50/30">
            {selectedContractor ? (
              <>
                {/* Chat Header */}
                <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-stone-900 text-sm font-display">
                      {selectedContractor.name}
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Alunos: {selectedContractor.students.map((s) => s.name).join(', ')} ·{' '}
                      {selectedContractor.school}
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/55${selectedContractor.phonePrimary.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Messages stream */}
                <div className="flex-1 py-4 space-y-3 overflow-y-auto max-h-[360px] pr-2">
                  {activeConversation.length === 0 ? (
                    <div className="text-center py-12 text-stone-400 text-xs">
                      Nenhuma mensagem trocada ainda com este contratante.
                    </div>
                  ) : (
                    activeConversation.map((m) => {
                      const isManager = m.sender === 'gestor';
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isManager ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                              isManager
                                ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                                : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                            }`}
                          >
                            {!isManager && m.category && (
                              <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded mb-1 uppercase tracking-wider">
                                {m.category === 'feedback' && '🌟 Feedback'}
                                {m.category === 'reclamacao' && '⚠️ Reclamação'}
                                {m.category === 'falta_aluno' && '🚌 Aviso de Falta'}
                                {m.category === 'pagamento' && '💳 Pagamento'}
                                {m.category === 'geral' && '💬 Dúvida Geral'}
                              </span>
                            )}
                            <p>{m.message}</p>
                          </div>
                          <span className="text-[10px] text-stone-400 mt-1 px-1">
                            {isManager ? 'Tia Drika' : selectedContractor.name} · {m.timestamp}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendAdminReply} className="pt-3 border-t border-stone-200 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Responder como Tia Drika para ${selectedContractor.name}...`}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-16 text-stone-500 text-xs">
                Selecione um contratante ao lado para visualizar as mensagens.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MURAL DE COMUNICADOS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-stone-900 font-display">
                Mural de Avisos & Comunicados
              </h3>
              <p className="text-xs text-stone-500">
                Todos os contratantes recebem estes avisos diretamente no portal.
              </p>
            </div>
            <button
              onClick={onOpenNewAnnouncement}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Megaphone className="w-4 h-4" />
              <span>+ Criar Novo Comunicado</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-2 relative"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                      {ann.type}
                    </span>
                    {ann.pinned && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        📌 Fixado
                      </span>
                    )}
                    <span className="text-xs text-stone-400">
                      Publicado em {ann.date.split('-').reverse().join('/')}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteAnnouncement(ann.id)}
                    className="text-stone-400 hover:text-rose-600 p-1 rounded transition"
                    title="Excluir comunicado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-extrabold text-stone-900 text-base font-display">
                  {ann.title}
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">{ann.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Copy,
  Check,
  QrCode,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  MapPin,
  MessageSquare,
  Send,
  FileText,
  ShieldCheck,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  Contractor,
  PaymentInstallment,
  PixConfig,
  Announcement,
  ChatMessage,
  ChatCategory,
} from '../../types';
import { formatCurrency } from '../../services/viacep';
import { BusinessCardBadge } from '../BusinessCardBadge';

interface ContractorDashboardProps {
  contractor: Contractor;
  installments: PaymentInstallment[];
  pixConfig: PixConfig;
  announcements: Announcement[];
  chatMessages: ChatMessage[];
  onTogglePaymentMethod: (method: 'pix' | 'dinheiro') => void;
  onPayInstallment: (installmentId: string, amount: number, method: 'pix' | 'dinheiro') => void;
  onMarkCashHandover: (installmentId: string) => void;
  onOpenReceipt: (c: Contractor, inst: PaymentInstallment) => void;
  onSendMessage: (category: ChatCategory, text: string) => void;
}

export const ContractorDashboard: React.FC<ContractorDashboardProps> = ({
  contractor,
  installments,
  pixConfig,
  announcements,
  chatMessages,
  onTogglePaymentMethod,
  onPayInstallment,
  onMarkCashHandover,
  onOpenReceipt,
  onSendMessage,
}) => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [chatCategory, setChatCategory] = useState<ChatCategory>('feedback');
  const [chatInput, setChatInput] = useState('');
  const [partialAmountModal, setPartialAmountModal] = useState<{
    isOpen: boolean;
    installment: PaymentInstallment | null;
    customAmount: number;
  }>({
    isOpen: false,
    installment: null,
    customAmount: 0,
  });

  const myInstallments = installments.filter((i) => i.contractorId === contractor.id);
  const myChat = chatMessages.filter((m) => m.contractorId === contractor.id);

  // Check upcoming or urgent dues
  const pendingInstallments = myInstallments.filter((i) => i.status !== 'pago');
  const nextPending = pendingInstallments[0];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixConfig.key);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatCategory, chatInput.trim());
    setChatInput('');
  };

  const handleConfirmPartialPayment = () => {
    if (!partialAmountModal.installment || partialAmountModal.customAmount <= 0) return;
    onPayInstallment(
      partialAmountModal.installment.id,
      partialAmountModal.customAmount,
      contractor.paymentMethod
    );
    setPartialAmountModal({ isOpen: false, installment: null, customAmount: 0 });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Official Business Card Banner */}
      <BusinessCardBadge />

      {/* Welcome & Student Overview */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              Área do Contratante
            </span>
            <h2 className="text-2xl font-black text-stone-900 font-display mt-1">
              Olá, {contractor.name}!
            </h2>
            <p className="text-xs text-stone-500">
              Escola Principal: <strong className="text-stone-800">{contractor.school}</strong>
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-lg font-bold text-stone-950">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Alunos no Transporte
              </p>
              <p className="text-sm font-extrabold text-stone-900">
                {contractor.students.length} {contractor.students.length > 1 ? 'filhos' : 'filho(a)'}
              </p>
            </div>
          </div>
        </div>

        {/* Linked Children Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
          {contractor.students.map((student, idx) => (
            <div
              key={student.id}
              className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/80 flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-200/70 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                #{idx + 1}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-stone-900 text-sm truncate">{student.name}</p>
                <p className="text-xs text-stone-600 truncate">{student.school}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px]">
                  <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded">
                    Turno {student.shift}
                  </span>
                  {student.grade && (
                    <span className="text-stone-500 font-medium">{student.grade}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Registered Address */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-600">
          <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Endereço cadastrado para embarque/desembarque:{' '}
            <strong className="text-stone-800">
              {contractor.street}, {contractor.number} {contractor.complement || ''} -{' '}
              {contractor.neighborhood}, {contractor.city}/{contractor.state} (CEP: {contractor.cep})
            </strong>
          </span>
        </div>
      </div>

      {/* SECTION: PAYMENT & BILLING PORTAL */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-xl font-black text-stone-900 font-display flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-600" />
              Portal de Pagamento da Mensalidade
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Escolha pagar por PIX ou em Dinheiro. Você pode alternar a forma de pagamento a qualquer momento.
            </p>
          </div>

          {/* User Toggle: Switch Payment Method Directly on Screen */}
          <div className="bg-stone-100 p-1 rounded-2xl flex items-center gap-1 border border-stone-200">
            <button
              type="button"
              onClick={() => onTogglePaymentMethod('pix')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                contractor.paymentMethod === 'pix'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>⚡ Pagar via PIX</span>
              {contractor.paymentMethod === 'pix' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onTogglePaymentMethod('dinheiro')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                contractor.paymentMethod === 'dinheiro'
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              <span>💵 Pagar em Dinheiro</span>
              {contractor.paymentMethod === 'dinheiro' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Current Due / Installments Overview */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myInstallments.map((inst) => {
              const isPaid = inst.status === 'pago';

              return (
                <div
                  key={inst.id}
                  className={`rounded-2xl p-5 border transition ${
                    isPaid
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-amber-50/50 border-amber-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Vencimento Dia {inst.dueDay}
                      </span>
                      <h4 className="text-base font-black text-stone-900 font-display mt-1">
                        Parcela {inst.referenceMonth}
                      </h4>
                      <p className="text-xs text-stone-600">
                        Data de vencimento: <strong className="text-stone-900">{inst.dueDate.split('-').reverse().join('/')}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-stone-500 font-medium">Valor</p>
                      <p className="text-xl font-black text-stone-950 font-display">
                        {formatCurrency(inst.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Status Banner */}
                  <div className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Pago em {inst.paidAt?.split(' ')[0] || 'Dia do Vencimento'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-900 font-bold bg-amber-200/70 px-2.5 py-1 rounded-lg">
                        <Clock className="w-4 h-4 text-amber-700" />
                        <span>Pendente de Pagamento</span>
                      </span>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {isPaid ? (
                        <button
                          onClick={() => onOpenReceipt(contractor, inst)}
                          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Ver Recibo</span>
                        </button>
                      ) : (
                        <>
                          {contractor.paymentMethod === 'dinheiro' ? (
                            <button
                              onClick={() => onMarkCashHandover(inst.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition"
                            >
                              {inst.cashHandoverMarked ? '✓ Dinheiro Avisado' : 'Avisar Entrega em Dinheiro'}
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                onPayInstallment(inst.id, inst.totalAmount, 'pix')
                              }
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-xl font-bold text-xs shadow-xs transition"
                            >
                              Confirmar Pagamento Integral
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setPartialAmountModal({
                                isOpen: true,
                                installment: inst,
                                customAmount: Math.round(inst.totalAmount / 2),
                              })
                            }
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs transition"
                          >
                            Pagar Parcial
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETAILS FOR ACTIVE PAYMENT METHOD (PIX OR CASH) */}
        {contractor.paymentMethod === 'pix' ? (
          <div className="bg-amber-50/70 border-2 border-amber-300 rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm shadow-xs">
                  ⚡
                </div>
                <div>
                  <h4 className="font-extrabold text-stone-950 text-base font-display">
                    Chave PIX da Tia Drika para Pagamento
                  </h4>
                  <p className="text-xs text-stone-600">
                    Copie a chave abaixo ou leia o QR Code no aplicativo do seu banco
                  </p>
                </div>
              </div>
            </div>

            {/* Pix Key Box with Copy Button */}
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Chave ({pixConfig.keyType.toUpperCase()}):
                </span>
                <span className="text-lg font-black text-stone-900 font-mono select-all">
                  {pixConfig.key}
                </span>
                <p className="text-xs text-stone-500 mt-0.5">
                  Favorecido: <strong className="text-stone-800">{pixConfig.beneficiaryName}</strong> · Banco: {pixConfig.bank}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyPix}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs ${
                  copiedPix
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-stone-950'
                }`}
              >
                {copiedPix ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Chave PIX Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Chave PIX</span>
                  </>
                )}
              </button>
            </div>

            {/* QR Code representation */}
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center gap-4 text-xs text-stone-600">
              <div className="w-24 h-24 bg-white p-2 rounded-xl border border-stone-300 flex items-center justify-center shadow-inner shrink-0 text-center font-mono">
                <QrCode className="w-20 h-20 text-stone-900" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-bold text-stone-900">Como pagar via PIX:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-stone-600">
                  <li>Abra o app do seu banco e selecione a opção <strong>PIX</strong></li>
                  <li>Cole a chave <strong>{pixConfig.key}</strong></li>
                  <li>Confira o nome de <strong>{pixConfig.beneficiaryName}</strong></li>
                  <li>Envie o comprovante para Tia Drika pelo WhatsApp ou aqui pelo chat!</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          /* CASH PAYMENT INSTRUCTIONS */
          <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                💵
              </div>
              <div>
                <h4 className="font-extrabold text-stone-950 text-base font-display">
                  Pagamento em Dinheiro (Em Espécie)
                </h4>
                <p className="text-xs text-stone-600">
                  Você optou por pagar diretamente à Tia Drika
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-emerald-200 text-xs text-stone-700 space-y-2">
              <p>
                • O valor pode ser entregue em mãos para a <strong>Tia Drika</strong> no momento do embarque ou desembarque do aluno.
              </p>
              <p>
                • Assim que entregue, a Tia Drika confirmará o recebimento no sistema e emitirá seu <strong>Recibo Oficial de Pagamento</strong>.
              </p>
              <p className="text-[11px] text-stone-500 italic">
                * Caso prefira pagar via PIX posteriormente, basta clicar no botão &ldquo;Pagar via PIX&rdquo; no canto superior.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SECTION: CHAT & FEEDBACK DIRECT TO TIA DRIKA */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-black text-stone-900 font-display flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              Canal de Atendimento com a Tia Drika
            </h3>
            <p className="text-xs text-stone-500">
              Envie feedbacks, elogios, reclamações, avisos de falta de aluno ou dúvidas sobre itinerário e pagamentos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/5527995816987`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>Abrir WhatsApp da Tia Drika</span>
            </a>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="bg-stone-50/60 rounded-2xl p-4 border border-stone-200/80 max-h-[320px] overflow-y-auto space-y-3">
          {myChat.length === 0 ? (
            <div className="text-center py-8 text-stone-400 text-xs">
              Você ainda não enviou mensagens para a Tia Drika. Use o campo abaixo para conversar!
            </div>
          ) : (
            myChat.map((m) => {
              const isMe = m.sender === 'contractor';
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                        : 'bg-white text-stone-900 border border-stone-200 rounded-tl-none'
                    }`}
                  >
                    {isMe && m.category && (
                      <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded mb-1 uppercase tracking-wider">
                        {m.category === 'feedback' && '🌟 Elogio / Feedback'}
                        {m.category === 'reclamacao' && '⚠️ Reclamação'}
                        {m.category === 'falta_aluno' && '🚌 Aviso de Falta'}
                        {m.category === 'pagamento' && '💳 Pagamento'}
                        {m.category === 'geral' && '💬 Mensagem'}
                      </span>
                    )}
                    <p>{m.message}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {isMe ? 'Você' : 'Tia Drika'} · {m.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Form with Category Selector */}
        <form onSubmit={handleSendChat} className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-600">Assunto:</span>
            <button
              type="button"
              onClick={() => setChatCategory('feedback')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                chatCategory === 'feedback'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🌟 Feedback / Elogio
            </button>
            <button
              type="button"
              onClick={() => setChatCategory('reclamacao')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                chatCategory === 'reclamacao'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ⚠️ Reclamação
            </button>
            <button
              type="button"
              onClick={() => setChatCategory('falta_aluno')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                chatCategory === 'falta_aluno'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🚌 Aviso de Falta
            </button>
            <button
              type="button"
              onClick={() => setChatCategory('pagamento')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                chatCategory === 'pagamento'
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              💳 Dúvida Financeira
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              required
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Digite sua mensagem para a Tia Drika..."
              className="flex-1 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-400 font-medium"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECTION: ANNOUNCEMENTS & SCHOOL NOTICE BOARD */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-lg font-black text-stone-900 font-display">
          Mural de Comunicados da Tia Drika
        </h3>
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                  {ann.type}
                </span>
                <span className="text-[11px] text-stone-500">
                  {ann.date.split('-').reverse().join('/')}
                </span>
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm font-display">
                {ann.title}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: CUSTOM PARTIAL PAYMENT */}
      {partialAmountModal.isOpen && partialAmountModal.installment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h4 className="text-lg font-black text-stone-900 font-display">
              Informar Pagamento Parcial
            </h4>
            <p className="text-xs text-stone-500">
              Valor total da parcela: <strong>{formatCurrency(partialAmountModal.installment.totalAmount)}</strong>
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Valor a Pagar Agora (R$)
              </label>
              <input
                type="number"
                min="10"
                max={partialAmountModal.installment.totalAmount}
                value={partialAmountModal.customAmount}
                onChange={(e) =>
                  setPartialAmountModal((prev) => ({
                    ...prev,
                    customAmount: Number(e.target.value),
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-base font-bold focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Saldo restante após este pagamento:{' '}
                <strong>
                  {formatCurrency(
                    Math.max(
                      0,
                      partialAmountModal.installment.totalAmount - partialAmountModal.customAmount
                    )
                  )}
                </strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setPartialAmountModal({ isOpen: false, installment: null, customAmount: 0 })
                }
                className="px-4 py-2 text-stone-600 font-semibold text-xs rounded-xl hover:bg-stone-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmPartialPayment}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs transition shadow-xs"
              >
                Confirmar Parcial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

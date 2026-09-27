import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck } from 'lucide-react';
import { Contractor, PaymentInstallment } from '../types';
import { formatCurrency } from '../services/viacep';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor;
  installment: PaymentInstallment;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  contractor,
  installment,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in max-h-[92vh] overflow-y-auto">
        {/* Actions bar (not printed) */}
        <div className="no-print flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
          <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Comprovante Oficial de Pagamento
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-amber-50/30 border-2 border-amber-300 rounded-2xl text-stone-900 space-y-5 print:border-stone-900 print:bg-white print:p-0">
          {/* Header */}
          <div className="text-center border-b border-amber-200 pb-4">
            <div className="inline-block bg-amber-400 text-stone-950 px-3 py-0.5 rounded-md font-bold text-xs uppercase tracking-wider mb-1">
              Transporte Escolar Regulamentado
            </div>
            <h2 className="text-2xl font-black text-stone-950 font-display">TIA DRIKA</h2>
            <p className="text-xs text-stone-700 italic">
              &ldquo;Tradição, confiança, conforto e profissionalismo&rdquo;
            </p>
            <div className="text-[11px] text-stone-600 mt-1 flex justify-center items-center gap-3">
              <span>📞 (27) 9 9581-6987</span>
              <span>•</span>
              <span>📞 (27) 9 9956-3226</span>
            </div>
            <div className="text-xs font-mono font-bold text-stone-700 mt-2 bg-white/80 py-1 px-3 rounded-lg inline-block border border-amber-200">
              RECIBO Nº: {installment.receiptNumber || `REC-${installment.id.toUpperCase()}`}
            </div>
          </div>

          {/* Amount Box */}
          <div className="bg-white p-4 rounded-xl border border-amber-200 text-center shadow-xs">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Valor Pago
            </p>
            <p className="text-3xl font-black text-emerald-700 font-display">
              {formatCurrency(installment.paidAmount || installment.totalAmount)}
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Forma de Pagamento: <strong className="uppercase">{installment.method}</strong>
            </p>
          </div>

          {/* Details */}
          <div className="space-y-2 text-xs bg-white/70 p-4 rounded-xl border border-amber-100">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Contratante:</span>
              <span className="font-bold text-stone-900">{contractor.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Aluno(s) Vinculado(s):</span>
              <span className="font-bold text-stone-900">
                {contractor.students.map((s) => s.name).join(', ')}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Escola / Colégio:</span>
              <span className="font-bold text-stone-900">{contractor.school}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Mês de Referência:</span>
              <span className="font-bold text-stone-900">
                {installment.referenceMonth} (Vencimento: {installment.dueDate.split('-').reverse().join('/')})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500 font-medium">Data do Pagamento:</span>
              <span className="font-bold text-stone-900">
                {installment.paidAt || new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
            {installment.notes && (
              <div className="py-1">
                <span className="text-stone-500 font-medium">Observações: </span>
                <span className="italic text-stone-700">{installment.notes}</span>
              </div>
            )}
          </div>

          {/* Signature / Stamp */}
          <div className="pt-6 text-center">
            <div className="w-56 mx-auto border-t-2 border-stone-400 pt-1">
              <p className="font-bold text-xs text-stone-900">Transporte Escolar Tia Drika</p>
              <p className="text-[10px] text-stone-500">Assinatura do Gestor / Responsável</p>
            </div>
            <p className="text-[10px] text-stone-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Documento digital emitido pelo Sistema Oficial Tia Drika
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

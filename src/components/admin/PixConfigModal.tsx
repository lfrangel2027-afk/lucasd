import React, { useState } from 'react';
import { X, QrCode, Check, Save } from 'lucide-react';
import { PixConfig } from '../../types';

interface PixConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  pixConfig: PixConfig;
  onSavePixConfig: (config: PixConfig) => void;
}

export const PixConfigModal: React.FC<PixConfigModalProps> = ({
  isOpen,
  onClose,
  pixConfig,
  onSavePixConfig,
}) => {
  const [key, setKey] = useState(pixConfig.key);
  const [keyType, setKeyType] = useState(pixConfig.keyType);
  const [beneficiaryName, setBeneficiaryName] = useState(pixConfig.beneficiaryName);
  const [bank, setBank] = useState(pixConfig.bank);
  const [city, setCity] = useState(pixConfig.city);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePixConfig({
      key: key.trim(),
      keyType,
      beneficiaryName: beneficiaryName.trim(),
      bank: bank.trim(),
      city: city.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 font-display">
              Configurar Chave PIX
            </h2>
            <p className="text-xs text-stone-500">
              Esta chave será exibida para os contratantes copiarem e pagarem no app
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tipo de Chave</label>
            <select
              value={keyType}
              onChange={(e) => setKeyType(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
            >
              <option value="telefone">Celular / Telefone</option>
              <option value="cpf_cnpj">CPF ou CNPJ</option>
              <option value="email">E-mail</option>
              <option value="aleatoria">Chave Aleatória (EVP)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Chave PIX *</label>
            <input
              type="text"
              required
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="(27) 99581-6987"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nome do Titular / Favorecido *
            </label>
            <input
              type="text"
              required
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Adriana Silva (Tia Drika)"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Banco / Instituição</label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="Nubank ou BB"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Cidade do Titular</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Vitória - ES"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 font-semibold text-xs rounded-xl hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Chave PIX</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

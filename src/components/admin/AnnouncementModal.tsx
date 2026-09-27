import React, { useState } from 'react';
import { X, Send, Megaphone, Bell, Calendar } from 'lucide-react';
import { Announcement } from '../../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnnouncement: (announcement: Announcement) => void;
}

export const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onAddAnnouncement,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<Announcement['type']>('geral');
  const [pinned, setPinned] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    onAddAnnouncement({
      id: 'ann-' + Date.now(),
      title: title.trim(),
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      author: 'Tia Drika',
      type,
      pinned,
    });

    setTitle('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-stone-900 font-display">
              Novo Comunicado para Pais
            </h2>
            <p className="text-xs text-stone-500">
              Esta mensagem aparecerá no mural de avisos de todos os contratantes
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Título do Comunicado *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 📢 Aviso sobre itinerário no feriado escolar"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Categoria</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold"
              >
                <option value="geral">Geral / Informativo</option>
                <option value="lembrete">Lembrete de Pagamento</option>
                <option value="feriado">Feriado / Recesso</option>
                <option value="itinerario">Mudança no Itinerário</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 p-2.5 bg-stone-50 border border-stone-200 rounded-xl cursor-pointer w-full text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={pinned}
                  onChange={(e) => setPinned(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Fixar no topo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Mensagem *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva a mensagem com todas as orientações para os responsáveis..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Comunicado</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

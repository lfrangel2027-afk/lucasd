import {
  Contractor,
  PaymentInstallment,
  PixConfig,
  Announcement,
  NotificationItem,
  ChatMessage,
  ActiveUser,
} from '../types';

const STORAGE_KEYS = {
  CONTRACTORS: 'tiadrika_contractors_v1',
  INSTALLMENTS: 'tiadrika_installments_v1',
  PIX_CONFIG: 'tiadrika_pix_config_v1',
  ANNOUNCEMENTS: 'tiadrika_announcements_v1',
  NOTIFICATIONS: 'tiadrika_notifications_v1',
  CHAT_MESSAGES: 'tiadrika_chat_messages_v1',
  ACTIVE_USER: 'tiadrika_active_user_v1',
};

export const INITIAL_PIX_CONFIG: PixConfig = {
  key: '(27) 99581-6987',
  keyType: 'telefone',
  beneficiaryName: 'Adriana Silva (Tia Drika)',
  city: 'Vitória - ES',
  bank: 'Nubank (260)',
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🚐 Boas-vindas ao Transporte Escolar Tia Drika!',
    message: 'Sejam bem-vindos ao nosso portal! Aqui você pode acompanhar seus vencimentos, chave PIX para cópia fácil, solicitar pagamento em dinheiro e enviar mensagens diretas para nossa equipe com total carinho e segurança.',
    date: '2026-09-20',
    author: 'Tia Drika',
    type: 'geral',
    pinned: true,
  },
  {
    id: 'ann-2',
    title: '⏰ Horários de Embarque e Chegada das Turmas',
    message: 'Pedimos a gentileza de deixar os pequenos prontos 5 minutos antes da buzina para manter o itinerário de todas as crianças no horário pontual. Agradecemos a colaboração de todas as famílias!',
    date: '2026-09-24',
    author: 'Tia Drika',
    type: 'itinerario',
  },
];

export const INITIAL_CONTRACTORS: Contractor[] = [
  {
    id: 'cont-1',
    name: 'Mariana Oliveira Ramos',
    username: 'mariana.ramos',
    password: '123',
    phonePrimary: '(27) 99876-4321',
    phoneSecondary: '(27) 98111-2233',
    cep: '29055-250',
    street: 'Rua Desembargador Sampaio',
    number: '412',
    complement: 'Apto 302',
    neighborhood: 'Praia do Canto',
    city: 'Vitória',
    state: 'ES',
    school: 'Colégio Sagrado Coração de Maria',
    students: [
      {
        id: 'stud-1',
        name: 'Sofia Oliveira Ramos',
        school: 'Colégio Sagrado Coração de Maria',
        grade: '3º Ano Fundamental I',
        shift: 'Tarde',
      },
      {
        id: 'stud-2',
        name: 'Lucas Oliveira Ramos',
        school: 'Colégio Sagrado Coração de Maria',
        grade: '6º Ano Fundamental II',
        shift: 'Manhã',
      },
    ],
    paymentMethod: 'pix',
    dueOption: 'ambos', // dia 15 e dia 30
    monthlyFee: 560,
    splitValueDia15: 280,
    splitValueDia30: 280,
    status: 'ativo',
    createdAt: '2026-08-01',
  },
  {
    id: 'cont-2',
    name: 'Rodrigo Guimarães Ferreira',
    username: 'rodrigo.ferreira',
    password: '123',
    phonePrimary: '(27) 99723-5566',
    cep: '29060-100',
    street: 'Avenida Dante Michelini',
    number: '1250',
    complement: 'Ed. Albatroz Bloco B',
    neighborhood: 'Jardim da Penha',
    city: 'Vitória',
    state: 'ES',
    school: 'Escola São Gonçalo',
    students: [
      {
        id: 'stud-3',
        name: 'Enzo Guimarães Ferreira',
        school: 'Escola São Gonçalo',
        grade: '2º Ano Fundamental I',
        shift: 'Tarde',
      },
    ],
    paymentMethod: 'dinheiro',
    dueOption: 'dia_15',
    monthlyFee: 320,
    status: 'ativo',
    createdAt: '2026-08-10',
  },
  {
    id: 'cont-3',
    name: 'Patrícia Albuquerque Souza',
    username: 'patricia.souza',
    password: '123',
    phonePrimary: '(27) 99654-8899',
    phoneSecondary: '(27) 3225-4433',
    cep: '29090-070',
    street: 'Rua Carlos Martins',
    number: '680',
    neighborhood: 'Jardim Camburi',
    city: 'Vitória',
    state: 'ES',
    school: 'Colégio Darwin',
    students: [
      {
        id: 'stud-4',
        name: 'Beatriz Albuquerque Souza',
        school: 'Colégio Darwin',
        grade: '5º Ano',
        shift: 'Manhã',
      },
    ],
    paymentMethod: 'pix',
    dueOption: 'dia_30',
    monthlyFee: 350,
    status: 'ativo',
    createdAt: '2026-08-15',
  },
];

export const INITIAL_INSTALLMENTS: PaymentInstallment[] = [
  // Mariana - ambos: dia 15 já pago, dia 30 a vencer
  {
    id: 'inst-1',
    contractorId: 'cont-1',
    referenceMonth: 'Setembro/2026',
    dueDate: '2026-09-15',
    dueDay: 15,
    totalAmount: 280,
    paidAmount: 280,
    method: 'pix',
    status: 'pago',
    paidAt: '2026-09-14 16:45',
    receiptNumber: 'REC-202609-001',
    notes: '1ª Quinzena paga via PIX',
  },
  {
    id: 'inst-2',
    contractorId: 'cont-1',
    referenceMonth: 'Setembro/2026',
    dueDate: '2026-09-30',
    dueDay: 30,
    totalAmount: 280,
    paidAmount: 0,
    method: 'pix',
    status: 'pendente', // vence em breve!
  },
  // Rodrigo - dia 15: dinheiro
  {
    id: 'inst-3',
    contractorId: 'cont-2',
    referenceMonth: 'Setembro/2026',
    dueDate: '2026-09-15',
    dueDay: 15,
    totalAmount: 320,
    paidAmount: 320,
    method: 'dinheiro',
    status: 'pago',
    paidAt: '2026-09-15 11:30',
    receiptNumber: 'REC-202609-002',
    notes: 'Pago em espécie diretamente à Tia Drika',
  },
  // Patrícia - dia 30: pix
  {
    id: 'inst-4',
    contractorId: 'cont-3',
    referenceMonth: 'Setembro/2026',
    dueDate: '2026-09-30',
    dueDay: 30,
    totalAmount: 350,
    paidAmount: 0,
    method: 'pix',
    status: 'pendente',
  },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-1',
    contractorId: 'cont-1',
    sender: 'contractor',
    senderName: 'Mariana Oliveira Ramos',
    message: 'Olá Tia Drika! Gostaria de avisar que a Sofia hoje irá levar um lanche extra para o amiguinho, muito obrigada pelo cuidado de sempre!',
    category: 'geral',
    timestamp: '2026-09-25 08:15',
    read: true,
  },
  {
    id: 'chat-2',
    contractorId: 'cont-1',
    sender: 'gestor',
    senderName: 'Tia Drika',
    message: 'Oi Mariana! Tudo bem querida? Pode deixar, vou ficar atenta! Um beijo na Sofia e no Lucas ❤️',
    category: 'geral',
    timestamp: '2026-09-25 08:30',
    read: true,
  },
  {
    id: 'chat-3',
    contractorId: 'cont-2',
    sender: 'contractor',
    senderName: 'Rodrigo Guimarães Ferreira',
    message: 'Boa tarde Tia Drika! Na próxima semana o Enzo vai precisar faltar na terça para uma consulta com o dentista.',
    category: 'falta_aluno',
    timestamp: '2026-09-26 14:00',
    read: false,
  },
];

// Helper to calculate days diff
export function getDaysDiffFromDate(targetDateStr: string, baseDate = new Date()): number {
  const [year, month, day] = targetDateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const current = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const diffTime = target.getTime() - current.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function loadData() {
  const contractors: Contractor[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CONTRACTORS) || JSON.stringify(INITIAL_CONTRACTORS)
  );
  const installments: PaymentInstallment[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.INSTALLMENTS) || JSON.stringify(INITIAL_INSTALLMENTS)
  );
  const pixConfig: PixConfig = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.PIX_CONFIG) || JSON.stringify(INITIAL_PIX_CONFIG)
  );
  const announcements: Announcement[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || JSON.stringify(INITIAL_ANNOUNCEMENTS)
  );
  const chatMessages: ChatMessage[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES) || JSON.stringify(INITIAL_CHAT)
  );
  let notifications: NotificationItem[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]'
  );

  // AUTOMATED NOTIFICATION ENGINE:
  // "o sistema envia automaticamente uma notificação de pagamento para vencimento em dois dias antes do pagamento e no mesmo dia."
  const now = new Date();
  const generatedNotifs: NotificationItem[] = [];

  installments.forEach((inst) => {
    if (inst.status === 'pago') return;

    const contractor = contractors.find((c) => c.id === inst.contractorId);
    if (!contractor) return;

    const daysDiff = getDaysDiffFromDate(inst.dueDate, now);

    // 2 days before due date
    if (daysDiff === 2) {
      const notifId = `auto-2d-${inst.id}-${inst.dueDate}`;
      const existing = notifications.some((n) => n.id === notifId);
      if (!existing) {
        generatedNotifs.push({
          id: notifId,
          contractorId: inst.contractorId,
          title: '🔔 Lembrete: Mensalidade vence em 2 dias!',
          message: `Olá ${contractor.name}! Lembramos que a parcela referente a ${inst.referenceMonth} (dia ${inst.dueDay}) no valor de R$ ${inst.totalAmount.toFixed(2)} vence em 2 dias. Chave PIX: ${pixConfig.key}`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'vencimento_2_dias',
          relatedInstallmentId: inst.id,
        });
      }
    }

    // On the due day
    if (daysDiff === 0) {
      const notifId = `auto-today-${inst.id}-${inst.dueDate}`;
      const existing = notifications.some((n) => n.id === notifId);
      if (!existing) {
        generatedNotifs.push({
          id: notifId,
          contractorId: inst.contractorId,
          title: '⚠️ Atenção: A mensalidade vence HOJE!',
          message: `Olá ${contractor.name}! A parcela de ${inst.referenceMonth} vence hoje. Valor: R$ ${inst.totalAmount.toFixed(2)}. Chave PIX: ${pixConfig.key} ou entrega em dinheiro com Tia Drika.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'vencimento_hoje',
          relatedInstallmentId: inst.id,
        });
      }
    }

    // Overdue alert
    if (daysDiff < 0) {
      const notifId = `auto-overdue-${inst.id}-${inst.dueDate}`;
      const existing = notifications.some((n) => n.id === notifId);
      if (!existing) {
        generatedNotifs.push({
          id: notifId,
          contractorId: inst.contractorId,
          title: '🚨 Aviso de Vencimento Pendente',
          message: `Olá ${contractor.name}! Identificamos que a parcela de ${inst.referenceMonth} vencida em ${inst.dueDate.split('-').reverse().join('/')} ainda está em aberto. Qualquer dúvida, contate Tia Drika.`,
          date: new Date().toISOString().split('T')[0],
          read: false,
          type: 'vencimento_atrasado',
          relatedInstallmentId: inst.id,
        });
      }
    }
  });

  if (generatedNotifs.length > 0) {
    notifications = [...generatedNotifs, ...notifications];
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  return {
    contractors,
    installments,
    pixConfig,
    announcements,
    chatMessages,
    notifications,
  };
}

export function saveContractors(contractors: Contractor[]) {
  localStorage.setItem(STORAGE_KEYS.CONTRACTORS, JSON.stringify(contractors));
}

export function saveInstallments(installments: PaymentInstallment[]) {
  localStorage.setItem(STORAGE_KEYS.INSTALLMENTS, JSON.stringify(installments));
}

export function savePixConfig(pixConfig: PixConfig) {
  localStorage.setItem(STORAGE_KEYS.PIX_CONFIG, JSON.stringify(pixConfig));
}

export function saveAnnouncements(announcements: Announcement[]) {
  localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
}

export function saveNotifications(notifications: NotificationItem[]) {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function saveChatMessages(chatMessages: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
}

export function getActiveUser(): ActiveUser {
  const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  // Default to Tia Drika (gestor) on start
  return {
    role: 'gestor',
    name: 'Tia Drika',
    username: 'admin',
  };
}

export function setActiveUser(user: ActiveUser) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.CONTRACTORS);
  localStorage.removeItem(STORAGE_KEYS.INSTALLMENTS);
  localStorage.removeItem(STORAGE_KEYS.PIX_CONFIG);
  localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
}

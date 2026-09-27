export interface Student {
  id: string;
  name: string;
  school: string;
  grade?: string;
  shift: 'Manhã' | 'Tarde' | 'Integral';
}

export type PaymentMethod = 'pix' | 'dinheiro';
export type DueOption = 'dia_15' | 'dia_30' | 'ambos';

export interface Contractor {
  id: string;
  name: string;
  username: string;
  password: string;
  phonePrimary: string;
  phoneSecondary?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  school: string;
  students: Student[];
  paymentMethod: PaymentMethod;
  dueOption: DueOption;
  monthlyFee: number;
  splitValueDia15?: number;
  splitValueDia30?: number;
  status: 'ativo' | 'inativo';
  createdAt: string;
}

export type PaymentStatus = 'pendente' | 'vence_hoje' | 'pago' | 'parcial' | 'atrasado';

export interface PaymentInstallment {
  id: string;
  contractorId: string;
  referenceMonth: string;
  dueDate: string; // YYYY-MM-DD
  dueDay: 15 | 30;
  totalAmount: number;
  paidAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  notes?: string;
  receiptNumber?: string;
  cashHandoverMarked?: boolean;
}

export interface PixConfig {
  key: string;
  keyType: 'telefone' | 'cpf_cnpj' | 'email' | 'aleatoria';
  beneficiaryName: string;
  city: string;
  bank: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  author: string;
  type: 'geral' | 'lembrete' | 'feriado' | 'itinerario';
  pinned?: boolean;
}

export type NotificationType =
  | 'vencimento_2_dias'
  | 'vencimento_hoje'
  | 'vencimento_atrasado'
  | 'comunicado'
  | 'pagamento_confirmado'
  | 'lembrete_manual'
  | 'aviso';

export interface NotificationItem {
  id: string;
  contractorId: string | 'todos';
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: NotificationType;
  relatedInstallmentId?: string;
}

export type ChatCategory = 'feedback' | 'reclamacao' | 'falta_aluno' | 'pagamento' | 'geral';

export interface ChatMessage {
  id: string;
  contractorId: string;
  sender: 'contractor' | 'gestor';
  senderName: string;
  message: string;
  category: ChatCategory;
  timestamp: string;
  read: boolean;
}

export interface ActiveUser {
  role: 'gestor' | 'contractor';
  contractorId?: string;
  name: string;
  username: string;
}

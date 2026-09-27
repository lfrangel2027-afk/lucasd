import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Trash2,
  User,
  KeyRound,
  Phone,
  MapPin,
  GraduationCap,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  Check,
} from 'lucide-react';
import { Contractor, Student, PaymentMethod, DueOption } from '../../types';
import { fetchAddressByCep, formatCep, formatPhone } from '../../services/viacep';

interface ContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractor: Contractor) => void;
  contractorToEdit?: Contractor | null;
}

export const ContractorModal: React.FC<ContractorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contractorToEdit,
}) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const [phonePrimary, setPhonePrimary] = useState('');
  const [phoneSecondary, setPhoneSecondary] = useState('');
  const [hasSecondaryPhone, setHasSecondaryPhone] = useState(false);

  // Address
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  // School & Students
  const [school, setSchool] = useState('');
  const [students, setStudents] = useState<Student[]>([
    {
      id: 's-1',
      name: '',
      school: '',
      grade: '',
      shift: 'Manhã',
    },
  ]);

  // Financial Settings
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [dueOption, setDueOption] = useState<DueOption>('dia_15');
  const [monthlyFee, setMonthlyFee] = useState<number>(350);
  const [split15, setSplit15] = useState<number>(175);
  const [split30, setSplit30] = useState<number>(175);

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (contractorToEdit) {
      setName(contractorToEdit.name);
      setUsername(contractorToEdit.username);
      setPassword(contractorToEdit.password);
      setPhonePrimary(contractorToEdit.phonePrimary);
      setPhoneSecondary(contractorToEdit.phoneSecondary || '');
      setHasSecondaryPhone(!!contractorToEdit.phoneSecondary);
      setCep(contractorToEdit.cep);
      setStreet(contractorToEdit.street);
      setNumber(contractorToEdit.number);
      setComplement(contractorToEdit.complement || '');
      setNeighborhood(contractorToEdit.neighborhood);
      setCity(contractorToEdit.city);
      setState(contractorToEdit.state);
      setSchool(contractorToEdit.school);
      setStudents(contractorToEdit.students);
      setPaymentMethod(contractorToEdit.paymentMethod);
      setDueOption(contractorToEdit.dueOption);
      setMonthlyFee(contractorToEdit.monthlyFee);
      setSplit15(contractorToEdit.splitValueDia15 || contractorToEdit.monthlyFee / 2);
      setSplit30(contractorToEdit.splitValueDia30 || contractorToEdit.monthlyFee / 2);
    } else {
      resetForm();
    }
  }, [contractorToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setUsername('');
    setPassword('123');
    setPhonePrimary('');
    setPhoneSecondary('');
    setHasSecondaryPhone(false);
    setCep('');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setState('');
    setSchool('');
    setStudents([
      {
        id: 's-' + Date.now(),
        name: '',
        school: '',
        grade: '',
        shift: 'Manhã',
      },
    ]);
    setPaymentMethod('pix');
    setDueOption('dia_15');
    setMonthlyFee(350);
    setSplit15(175);
    setSplit30(175);
    setFormError('');
    setCepError('');
  };

  if (!isOpen) return null;

  // Auto-generate username from name if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!contractorToEdit && !username) {
      const suggested = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.')
        .replace(/^\.|\.$/g, '');
      setUsername(suggested);
    }
  };

  const handleCepSearch = async (cepValue: string) => {
    const clean = cepValue.replace(/\D/g, '');
    if (clean.length !== 8) return;

    setIsLoadingCep(true);
    setCepError('');
    const res = await fetchAddressByCep(clean);
    setIsLoadingCep(false);

    if (res.error) {
      setCepError(res.error);
    } else {
      setStreet(res.street);
      setNeighborhood(res.neighborhood);
      setCity(res.city);
      setState(res.state);
    }
  };

  const handleAddStudent = () => {
    setStudents((prev) => [
      ...prev,
      {
        id: 's-' + Date.now(),
        name: '',
        school: school || '',
        grade: '',
        shift: 'Manhã',
      },
    ]);
  };

  const handleRemoveStudent = (id: string) => {
    if (students.length <= 1) {
      setFormError('É necessário manter ao menos 1 aluno cadastrado.');
      return;
    }
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStudentChange = (id: string, field: keyof Student, value: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleMonthlyFeeChange = (val: number) => {
    setMonthlyFee(val);
    setSplit15(Math.round((val / 2) * 100) / 100);
    setSplit30(Math.round((val / 2) * 100) / 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Informe o nome do contratante.');
      return;
    }
    if (!username.trim()) {
      setFormError('Informe o usuário de login.');
      return;
    }
    if (!password.trim()) {
      setFormError('Informe a senha.');
      return;
    }
    if (!phonePrimary.trim()) {
      setFormError('Informe ao menos 1 telefone de contato.');
      return;
    }
    if (!street.trim() || !number.trim() || !neighborhood.trim()) {
      setFormError('Preencha os dados do endereço (rua, número e bairro).');
      return;
    }

    const invalidStudent = students.find((s) => !s.name.trim());
    if (invalidStudent) {
      setFormError('Preencha o nome de todos os alunos vinculados.');
      return;
    }

    const newContractor: Contractor = {
      id: contractorToEdit ? contractorToEdit.id : 'cont-' + Date.now(),
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password: password.trim(),
      phonePrimary: phonePrimary.trim(),
      phoneSecondary: hasSecondaryPhone && phoneSecondary.trim() ? phoneSecondary.trim() : undefined,
      cep: cep.trim(),
      street: street.trim(),
      number: number.trim(),
      complement: complement.trim() || undefined,
      neighborhood: neighborhood.trim(),
      city: city.trim() || 'Vitória',
      state: state.trim() || 'ES',
      school: school.trim() || students[0]?.school || 'Não informada',
      students: students.map((s) => ({
        ...s,
        school: s.school.trim() || school.trim() || 'Não informada',
      })),
      paymentMethod,
      dueOption,
      monthlyFee: Number(monthlyFee),
      splitValueDia15: dueOption === 'ambos' ? Number(split15) : undefined,
      splitValueDia30: dueOption === 'ambos' ? Number(split30) : undefined,
      status: contractorToEdit ? contractorToEdit.status : 'ativo',
      createdAt: contractorToEdit ? contractorToEdit.createdAt : new Date().toISOString().split('T')[0],
    };

    onSave(newContractor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
            {contractorToEdit ? 'Editar Cadastro' : 'Novo Contratante'}
          </span>
          <h2 className="text-2xl font-black text-stone-900 font-display mt-1">
            {contractorToEdit ? 'Atualizar Dados do Contratante' : 'Cadastrar Contratante & Filhos'}
          </h2>
          <p className="text-xs text-stone-500">
            Cadastre os dados completos, crie o usuário e senha do contratante e defina o formato de pagamento.
          </p>
        </div>

        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Contractor & Login Credentials */}
          <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80 space-y-4">
            <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              1. Dados do Contratante & Acesso
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nome Completo do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Mariana Oliveira Ramos"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Usuário de Login (para o contratante acessar) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="mariana.ramos"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Senha de Acesso do Contratante *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-mono"
                  />
                  <KeyRound className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                </div>
              </div>
            </div>

            {/* Contact Phones (1 or 2) */}
            <div className="pt-2 border-t border-amber-200/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Telefone 1 (Principal / WhatsApp) *
                  </label>
                  <input
                    type="text"
                    required
                    value={phonePrimary}
                    onChange={(e) => setPhonePrimary(formatPhone(e.target.value))}
                    placeholder="(27) 99876-5432"
                    className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      Telefone 2 (Opcional / Recados)
                    </label>
                    <button
                      type="button"
                      onClick={() => setHasSecondaryPhone(!hasSecondaryPhone)}
                      className="text-[11px] text-amber-700 font-semibold underline"
                    >
                      {hasSecondaryPhone ? 'Remover 2º' : '+ Adicionar 2º'}
                    </button>
                  </div>
                  {hasSecondaryPhone ? (
                    <input
                      type="text"
                      value={phoneSecondary}
                      onChange={(e) => setPhoneSecondary(formatPhone(e.target.value))}
                      placeholder="(27) 98111-2233"
                      className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                    />
                  ) : (
                    <div
                      onClick={() => setHasSecondaryPhone(true)}
                      className="text-xs text-stone-500 bg-white/70 border border-dashed border-stone-300 rounded-xl px-3.5 py-2 cursor-pointer hover:bg-stone-50"
                    >
                      Clique para cadastrar segundo telefone
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Address with automatic CEP search */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              2. Endereço com Busca Automática de CEP
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  CEP (busca automática) *
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={(e) => {
                      const formatted = formatCep(e.target.value);
                      setCep(formatted);
                      if (formatted.replace(/\D/g, '').length === 8) {
                        handleCepSearch(formatted);
                      }
                    }}
                    onBlur={() => handleCepSearch(cep)}
                    placeholder="29055-250"
                    className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-mono pr-18"
                  />
                  <button
                    type="button"
                    onClick={() => handleCepSearch(cep)}
                    disabled={isLoadingCep}
                    className="absolute right-1.5 px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    {isLoadingCep ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>Buscar</span>
                  </button>
                </div>
                {cepError && <p className="text-[11px] text-rose-600 mt-1">{cepError}</p>}
              </div>

              <div className="sm:col-span-7">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Rua / Logradouro *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ex: Rua Desembargador Sampaio"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-stone-700 mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 412"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-stone-700 mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 302, Bloco C..."
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-stone-700 mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Praia do Canto"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-8">
                <label className="block text-xs font-bold text-stone-700 mb-1">Cidade</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Vitória"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-stone-700 mb-1">Estado</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="ES"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 uppercase"
                />
              </div>
            </div>
          </div>

          {/* Section 3: School & Linked Children */}
          <div className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-600" />
                  3. Escola & Vínculo de Filhos (Alunos)
                </h3>
                <p className="text-[11px] text-stone-500">
                  Permite cadastrar mais de um filho no mesmo cadastro
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddStudent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Adicionar Filho(a)</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Nome da Escola / Colégio Principal *
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  // also update students with empty school
                  setStudents((prev) =>
                    prev.map((s) => (!s.school ? { ...s, school: e.target.value } : s))
                  );
                }}
                placeholder="Ex: Colégio Sagrado Coração de Maria"
                className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-medium"
              />
            </div>

            {/* Students List */}
            <div className="space-y-3 pt-2">
              {students.map((student, idx) => (
                <div
                  key={student.id}
                  className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Filho(a) #{idx + 1}
                    </span>
                    {students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveStudent(student.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded transition"
                        title="Remover este filho do cadastro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">
                        Nome do Filho(a) *
                      </label>
                      <input
                        type="text"
                        required
                        value={student.name}
                        onChange={(e) => handleStudentChange(student.id, 'name', e.target.value)}
                        placeholder="Ex: Sofia Oliveira"
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">
                        Turma / Série
                      </label>
                      <input
                        type="text"
                        value={student.grade || ''}
                        onChange={(e) => handleStudentChange(student.id, 'grade', e.target.value)}
                        placeholder="Ex: 3º Ano Fundamental"
                        className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-stone-600 mb-0.5">
                        Turno *
                      </label>
                      <select
                        value={student.shift}
                        onChange={(e) =>
                          handleStudentChange(student.id, 'shift', e.target.value as any)
                        }
                        className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-400"
                      >
                        <option value="Manhã">Manhã</option>
                        <option value="Tarde">Tarde</option>
                        <option value="Integral">Integral</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Payment Method & Due Dates */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-600" />
              4. Forma de Pagamento & Vencimento (Dia 15, Dia 30 ou Ambos)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Meio de Pagamento Preferencial
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'pix'
                        ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>⚡ PIX</span>
                    {paymentMethod === 'pix' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                      paymentMethod === 'dinheiro'
                        ? 'bg-amber-400 border-amber-500 text-stone-950 shadow-xs'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <span>💵 Dinheiro</span>
                    {paymentMethod === 'dinheiro' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  * O contratante também poderá alternar para dinheiro direto no portal dele.
                </p>
              </div>

              {/* Monthly Fee Total */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Valor Total da Mensalidade (R$) *
                </label>
                <input
                  type="number"
                  min="50"
                  step="10"
                  required
                  value={monthlyFee}
                  onChange={(e) => handleMonthlyFeeChange(Number(e.target.value))}
                  placeholder="350"
                  className="w-full px-3.5 py-2 bg-white border border-stone-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 font-bold"
                />
              </div>
            </div>

            {/* Due Options: Dia 15, Dia 30 ou Ambos */}
            <div className="pt-2 border-t border-stone-200">
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                Opção de Vencimento
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDueOption('dia_15')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    dueOption === 'dia_15'
                      ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <p>Todo dia 15</p>
                  <span className="text-[10px] font-normal text-stone-600 block">Integral</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDueOption('dia_30')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    dueOption === 'dia_30'
                      ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <p>Todo dia 30</p>
                  <span className="text-[10px] font-normal text-stone-600 block">Integral</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDueOption('ambos')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition ${
                    dueOption === 'ambos'
                      ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <p>Dia 15 e Dia 30</p>
                  <span className="text-[10px] font-normal text-stone-600 block">Duas parcelas</span>
                </button>
              </div>

              {dueOption === 'ambos' && (
                <div className="mt-3 p-3 bg-amber-100/60 rounded-xl border border-amber-300 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Parcela Dia 15 (R$)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={split15}
                      onChange={(e) => setSplit15(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">
                      Parcela Dia 30 (R$)
                    </label>
                    <input
                      type="number"
                      step="5"
                      value={split30}
                      onChange={(e) => setSplit30(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 text-sm font-semibold hover:bg-stone-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-sm hover:shadow transition text-sm"
            >
              {contractorToEdit ? 'Salvar Alterações' : 'Concluir Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

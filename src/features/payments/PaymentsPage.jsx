import React, { useState, useMemo } from 'react';
import {
  Wallet, TrendingUp, TrendingDown, Clock, ArrowDownToLine,
  ArrowUpFromLine, ArrowLeftRight, CheckCircle2, XCircle,
  AlertCircle, CreditCard, Eye, EyeOff, Search, Filter,
  ChevronRight, RefreshCw, Send, Building2, CircleDollarSign,
  Zap, BarChart3,
} from 'lucide-react';
import { mockWallet, mockTransactions, mockFundingFlows, mockRecipients } from './mockTransactions';

const TABS = ['Overview', 'Deposit', 'Withdraw', 'Transfer'];

const fmt = (n) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function StatusBadge({ status }) {
  const map = {
    success: { cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={12} />, label: 'Success' },
    pending: { cls: 'bg-amber-100 text-amber-700', icon: <AlertCircle size={12} />, label: 'Pending' },
    failed: { cls: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, label: 'Failed' },
    completed: { cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={12} />, label: 'Completed' },
    in_progress: { cls: 'bg-blue-100 text-blue-700', icon: <RefreshCw size={12} />, label: 'In Progress' },
  };
  const { cls, icon, label } = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {icon} {label}
    </span>
  );
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function ActionButton({ onClick, disabled, variant = 'primary', children }) {
  const base = 'w-full py-2.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg active:scale-[0.98]',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-md hover:shadow-lg active:scale-[0.98]',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-md hover:shadow-lg active:scale-[0.98]',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  );
}

function SuccessToast({ message, onClose }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
      <div className="bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 size={16} />
        </div>
        <p className="text-sm font-medium">{message}</p>
        <button onClick={onClose} className="ml-2 text-gray-400 hover:text-white">
          <XCircle size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Wallet Card ──────────────────────────────────────────────── */
function WalletCard({ showBalance, setShowBalance }) {
  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-7 text-white overflow-hidden shadow-xl">
      {/* Decorative blobs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-8 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Wallet size={16} />
              </div>
              <span className="text-blue-100 text-sm font-medium">Main Wallet</span>
            </div>
            <p className="text-blue-200 text-xs">{mockWallet.accountNumber} · {mockWallet.cardType}</p>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="mb-6">
          <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">Available Balance</p>
          <p className="text-4xl font-bold tracking-tight">
            {showBalance ? fmt(mockWallet.balance) : '••••••'}
          </p>
          {mockWallet.pendingAmount > 0 && (
            <p className="text-blue-200 text-sm mt-1">
              + {fmt(mockWallet.pendingAmount)} pending
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Account Active</span>
          </div>
          <span>Updated {fmtDate(mockWallet.lastUpdated)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Transaction Table ─────────────────────────────────────────── */
function TransactionTable({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Transaction</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Sender</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Receiver</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50/60 transition-colors group">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-emerald-50' : 'bg-red-50'
                  }`}>
                    {tx.type === 'credit'
                      ? <ArrowDownToLine size={16} className="text-emerald-600" />
                      : <ArrowUpFromLine size={16} className="text-red-500" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">{tx.description}</p>
                    <p className="text-xs text-gray-400 capitalize">{tx.category}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 hidden sm:table-cell">
                <p className="text-sm text-gray-700">{tx.sender}</p>
                <p className="text-xs text-gray-400 capitalize">{tx.senderRole}</p>
              </td>
              <td className="py-4 px-4 hidden md:table-cell">
                <p className="text-sm text-gray-700">{tx.receiver}</p>
                <p className="text-xs text-gray-400 capitalize">{tx.receiverRole}</p>
              </td>
              <td className="py-4 px-4 text-right">
                <span className={`text-sm font-bold ${
                  tx.type === 'credit' ? 'text-emerald-600' : 'text-red-500'
                }`}>
                  {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                </span>
              </td>
              <td className="py-4 px-4 text-center">
                <StatusBadge status={tx.status} />
              </td>
              <td className="py-4 px-4 text-right hidden lg:table-cell">
                <span className="text-sm text-gray-500">{fmtDate(tx.date)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Funding Flow ──────────────────────────────────────────────── */
function FundingFlowSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-gray-900">Investment Flow</h3>
          <p className="text-sm text-gray-500 mt-0.5">Active investor → entrepreneur funding pipelines</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
          <Zap size={14} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-600">{mockFundingFlows.length} Active</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockFundingFlows.map((flow) => (
          <div key={flow.id} className="border border-gray-100 rounded-2xl p-4 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex items-center gap-3">
              {/* Investor */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${flow.investor.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {flow.investor.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{flow.investor.name}</p>
                  <span className="text-xs text-gray-400">{flow.investor.badge}</span>
                </div>
              </div>

              {/* Flow arrow + amount */}
              <div className="flex flex-col items-center gap-1 px-2">
                <span className="text-xs font-bold text-gray-700">{fmt(flow.investor.amount)}</span>
                <div className="flex items-center gap-1">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded" />
                  <ChevronRight size={14} className="text-purple-500 flex-shrink-0" />
                </div>
                <span className="text-xs text-gray-400">{flow.investor.equity}% equity</span>
              </div>

              {/* Entrepreneur */}
              <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                <div className="min-w-0 text-right">
                  <p className="text-sm font-semibold text-gray-800 truncate">{flow.entrepreneur.startup}</p>
                  <span className="text-xs text-gray-400">{flow.entrepreneur.industry}</span>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${flow.entrepreneur.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {flow.entrepreneur.initials}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-500">Transfer progress</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={flow.status} />
                  <span className="text-xs font-semibold text-gray-700">{flow.progress}%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    flow.progress === 100
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                      : 'bg-gradient-to-r from-blue-400 to-purple-500'
                  }`}
                  style={{ width: `${flow.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Deposit Panel ─────────────────────────────────────────────── */
function DepositPanel({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank');
  const quickAmounts = [1000, 5000, 10000, 25000];

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    onSuccess(`Successfully deposited ${fmt(Number(amount))} to your wallet!`);
    setAmount('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="text-center pb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ArrowDownToLine size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Deposit Funds</h3>
          <p className="text-sm text-gray-500">Add money to your wallet instantly</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'bank', label: 'Bank Transfer', icon: <Building2 size={16} /> },
              { id: 'card', label: 'Debit Card', icon: <CreditCard size={16} /> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`p-3 rounded-xl border-2 flex items-center gap-2 transition-all text-sm font-medium ${
                  method === m.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 mt-2">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className="flex-1 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                ${(q / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        <ActionButton onClick={handleSubmit} disabled={!amount || Number(amount) <= 0} variant="success">
          <ArrowDownToLine size={16} /> Deposit {amount ? fmt(Number(amount)) : 'Funds'}
        </ActionButton>
      </div>
    </div>
  );
}

/* ─── Withdraw Panel ─────────────────────────────────────────────── */
function WithdrawPanel({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');

  const handleSubmit = () => {
    if (!amount || !account || Number(amount) <= 0) return;
    onSuccess(`Withdrawal of ${fmt(Number(amount))} initiated. Funds arrive in 1–3 business days.`);
    setAmount('');
    setAccount('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="text-center pb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ArrowUpFromLine size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Withdraw Funds</h3>
          <p className="text-sm text-gray-500">Transfer to your linked bank account</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2">
          <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700">Available balance: <strong>{fmt(mockWallet.balance)}</strong></p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Bank Account (last 4 digits)</label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="e.g. 4821"
            maxLength={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <ActionButton onClick={handleSubmit} disabled={!amount || !account || Number(amount) <= 0} variant="danger">
          <ArrowUpFromLine size={16} /> Withdraw {amount ? fmt(Number(amount)) : 'Funds'}
        </ActionButton>
      </div>
    </div>
  );
}

/* ─── Transfer Panel ─────────────────────────────────────────────── */
function TransferPanel({ onSuccess }) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!amount || !recipient || Number(amount) <= 0) return;
    const r = mockRecipients.find((x) => x.id === recipient);
    onSuccess(`${fmt(Number(amount))} transferred to ${r?.name} successfully!`);
    setAmount('');
    setRecipient('');
    setNote('');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <div className="text-center pb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ArrowLeftRight size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Transfer Funds</h3>
          <p className="text-sm text-gray-500">Send money to investors or entrepreneurs</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Recipient</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select recipient…</option>
            <optgroup label="Entrepreneurs">
              {mockRecipients.filter((r) => r.role === 'entrepreneur').map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.startup}</option>
              ))}
            </optgroup>
            <optgroup label="Investors">
              {mockRecipients.filter((r) => r.role === 'investor').map((r) => (
                <option key={r.id} value={r.id}>{r.name} — {r.company}</option>
              ))}
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Seed round payment"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <ActionButton onClick={handleSubmit} disabled={!amount || !recipient || Number(amount) <= 0} variant="primary">
          <Send size={16} /> Send {amount ? fmt(Number(amount)) : 'Transfer'}
        </ActionButton>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showBalance, setShowBalance] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const filteredTxns = useMemo(() => {
    return mockTransactions.filter((tx) => {
      const matchStatus = statusFilter === 'all' || tx.status === statusFilter;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        tx.sender.toLowerCase().includes(q) ||
        tx.receiver.toLowerCase().includes(q) ||
        tx.description.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [statusFilter, searchTerm]);

  const totalReceived = mockTransactions
    .filter((t) => t.type === 'credit' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const totalSent = mockTransactions
    .filter((t) => t.type === 'debit' && t.status === 'success')
    .reduce((s, t) => s + t.amount, 0);

  const totalPending = mockTransactions
    .filter((t) => t.status === 'pending')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your wallet, transfers, and investment flows</p>
      </div>

      {/* Wallet + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-7">
        <div className="lg:col-span-1">
          <WalletCard showBalance={showBalance} setShowBalance={setShowBalance} />
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<TrendingUp size={20} className="text-emerald-600" />}
            label="Total Received"
            value={fmt(totalReceived)}
            sub="Successful credits"
            color="bg-emerald-50"
          />
          <StatCard
            icon={<TrendingDown size={20} className="text-red-500" />}
            label="Total Sent"
            value={fmt(totalSent)}
            sub="Successful debits"
            color="bg-red-50"
          />
          <StatCard
            icon={<Clock size={20} className="text-amber-500" />}
            label="Pending"
            value={fmt(totalPending)}
            sub="Awaiting clearance"
            color="bg-amber-50"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-5">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'Overview' && (
        <div className="space-y-5">
          {/* Funding Flow */}
          <FundingFlowSection />

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Transaction History</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{filteredTxns.length} transactions found</p>
                </div>
                <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search transactions…"
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>
            <TransactionTable transactions={filteredTxns} />
            {filteredTxns.length === 0 && (
              <div className="py-12 text-center text-gray-400">
                <BarChart3 size={40} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No transactions match your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'Deposit' && (
        <DepositPanel onSuccess={showToast} />
      )}

      {activeTab === 'Withdraw' && (
        <WithdrawPanel onSuccess={showToast} />
      )}

      {activeTab === 'Transfer' && (
        <TransferPanel onSuccess={showToast} />
      )}

      {toast && <SuccessToast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Smartphone, Mail, Eye, EyeOff, Key, CheckCircle2,
  XCircle, AlertTriangle, Monitor, Laptop, Globe, RefreshCw,
  UserCheck, Building2, CircleDollarSign, ChevronRight, Check,
  X, Fingerprint, Zap, Settings, Bell, FileText, MessageCircle,
  Calendar, Video, CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── Helpers ───────────────────────────────────────────────────── */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '', bg: '', width: '0%', bars: 0 };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const levels = [
    { min: 0, label: 'Too weak', color: 'text-red-600', bg: 'bg-red-500', width: '20%', bars: 1 },
    { min: 1, label: 'Weak', color: 'text-orange-600', bg: 'bg-orange-500', width: '35%', bars: 1 },
    { min: 2, label: 'Medium', color: 'text-amber-600', bg: 'bg-amber-500', width: '55%', bars: 2 },
    { min: 3, label: 'Strong', color: 'text-blue-600', bg: 'bg-blue-500', width: '75%', bars: 3 },
    { min: 5, label: 'Very Strong', color: 'text-emerald-600', bg: 'bg-emerald-500', width: '100%', bars: 4 },
  ];

  let level = levels[0];
  for (const l of levels) {
    if (score >= l.min) level = l;
  }
  return { ...level, score };
};

const requirements = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'At least 12 characters', test: (p) => p.length >= 12 },
  { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p) => /[0-9]/.test(p) },
  { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const mockSessions = [
  { id: 1, device: 'Chrome · Windows 11', icon: 'monitor', location: 'Karachi, Pakistan', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'Safari · iPhone 15', icon: 'phone', location: 'Karachi, Pakistan', lastActive: '1 hour ago', current: false },
  { id: 3, device: 'Firefox · macOS', icon: 'laptop', location: 'Lahore, Pakistan', lastActive: '3 days ago', current: false },
];

const entrepreneurPermissions = [
  { feature: 'Dashboard', access: true },
  { feature: 'Find Investors', access: true },
  { feature: 'Video Calls', access: true },
  { feature: 'Document Chamber', access: true },
  { feature: 'Calendar & Meetings', access: true },
  { feature: 'Messaging', access: true },
  { feature: 'Payments', access: true },
  { feature: 'View All Investors', access: true },
  { feature: 'Manage Portfolio', access: false },
  { feature: 'Approve Deals', access: false },
];

const investorPermissions = [
  { feature: 'Dashboard', access: true },
  { feature: 'Find Startups', access: true },
  { feature: 'Video Calls', access: true },
  { feature: 'Document Chamber', access: true },
  { feature: 'Calendar & Meetings', access: true },
  { feature: 'Messaging', access: true },
  { feature: 'Payments', access: true },
  { feature: 'Manage Portfolio', access: true },
  { feature: 'Approve Deals', access: true },
  { feature: 'Startup Analytics', access: true },
];

/* ─── Multi-Step Login Demo ─────────────────────────────────────── */
function LoginDemo() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const MOCK_OTP = '123456';

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      document.getElementById('otp-5')?.focus();
    }
    e.preventDefault();
  };

  const step1Valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const strength = getStrength(password);
  const step2Valid = password.length >= 6;
  const otpFull = otp.join('');

  const handleStep3 = () => {
    if (otpFull !== MOCK_OTP) {
      setError('Incorrect code. Try 123456.');
      return;
    }
    setError('');
    setDone(true);
  };

  const reset = () => {
    setStep(1); setEmail(''); setPassword(''); setOtp(['', '', '', '', '', '']);
    setDone(false); setError('');
  };

  const steps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Password' },
    { num: 3, label: '2FA Code' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Fingerprint size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Multi-Step Authentication Demo</h3>
          <p className="text-xs text-gray-500">Simulated secure login flow with 2FA</p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center mb-7">
        {steps.map((s, i) => (
          <React.Fragment key={s.num}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                step > s.num || done
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : step === s.num
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-gray-200 text-gray-400 bg-white'
              }`}>
                {step > s.num || done ? <Check size={14} /> : s.num}
              </div>
              <span className={`text-xs font-medium ${step === s.num && !done ? 'text-blue-600' : 'text-gray-400'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded transition-colors ${step > s.num || done ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Success State */}
      {done ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-1">Access Granted!</h4>
          <p className="text-sm text-gray-500 mb-5">Authentication completed successfully.</p>
          <button onClick={reset} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            Try Again
          </button>
        </div>
      ) : step === 1 ? (
        /* Step 1 — Email */
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => step1Valid && setStep(2)}
            disabled={!step1Valid}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      ) : step === 2 ? (
        /* Step 2 — Password */
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.bg}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <span className={`ml-3 text-xs font-bold ${strength.color}`}>{strength.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {requirements.map((r) => (
                    <div key={r.label} className={`flex items-center gap-1.5 text-xs ${r.test(password) ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {r.test(password) ? <Check size={10} /> : <X size={10} />}
                      {r.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button
              onClick={() => step2Valid && setStep(3)}
              disabled={!step2Valid}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        /* Step 3 — OTP */
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Smartphone size={22} className="text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Enter the 6-digit code sent to</p>
            <p className="text-sm font-bold text-gray-900">{email}</p>
            <p className="text-xs text-gray-400 mt-1">Hint: use <strong>123456</strong></p>
          </div>

          <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, i)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && i > 0) {
                    document.getElementById(`otp-${i - 1}`)?.focus();
                  }
                }}
                className={`w-11 h-13 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  digit ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200'
                }`}
                style={{ height: '3.2rem' }}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center font-medium">{error}</p>
          )}

          <div className="flex gap-3">
            <button onClick={() => { setStep(2); setError(''); }} className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button
              onClick={handleStep3}
              disabled={otpFull.length < 6}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Verify & Login <Zap size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Password Strength Section ─────────────────────────────────── */
function PasswordStrengthSection() {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const strength = getStrength(password);

  const meterBars = [
    { filled: strength.bars >= 1, color: strength.bars >= 3 ? 'bg-blue-500' : strength.bars >= 2 ? 'bg-amber-500' : 'bg-red-500' },
    { filled: strength.bars >= 2, color: strength.bars >= 3 ? 'bg-blue-500' : 'bg-amber-500' },
    { filled: strength.bars >= 3, color: strength.bars >= 4 ? 'bg-emerald-500' : 'bg-blue-500' },
    { filled: strength.bars >= 4, color: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Key size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Password Strength Checker</h3>
          <p className="text-xs text-gray-500">Live password security analysis</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={showPwd ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a password to check strength…"
          className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={() => setShowPwd(!showPwd)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength bars */}
      <div className="flex gap-2 mb-3">
        {meterBars.map((bar, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full transition-all duration-300 ${
              bar.filled && password ? bar.color : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {password && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-gray-500">Security level</span>
          <span className={`text-sm font-bold ${strength.color}`}>{strength.label}</span>
        </div>
      )}

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {requirements.map((r) => {
          const passed = r.test(password);
          return (
            <div
              key={r.label}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-colors ${
                passed ? 'bg-emerald-50' : 'bg-gray-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                passed ? 'bg-emerald-500' : 'bg-gray-200'
              }`}>
                {passed ? <Check size={10} className="text-white" /> : <X size={10} className="text-gray-400" />}
              </div>
              <span className={`text-xs font-medium ${passed ? 'text-emerald-700' : 'text-gray-500'}`}>{r.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Active Sessions ───────────────────────────────────────────── */
function SessionsSection() {
  const [sessions, setSessions] = useState(mockSessions);

  const revoke = (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const DeviceIcon = ({ type }) => {
    const iconMap = {
      monitor: <Monitor size={18} className="text-blue-600" />,
      phone: <Smartphone size={18} className="text-purple-600" />,
      laptop: <Laptop size={18} className="text-orange-500" />,
    };
    return iconMap[type] || <Globe size={18} className="text-gray-400" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
            <Monitor size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Active Sessions</h3>
            <p className="text-xs text-gray-500">{sessions.length} device(s) logged in</p>
          </div>
        </div>
        <button
          onClick={() => setSessions([mockSessions[0]])}
          className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Revoke All Others
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              session.current ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                session.current ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <DeviceIcon type={session.icon} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-800">{session.device}</p>
                  {session.current && (
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{session.location} · {session.lastActive}</p>
              </div>
            </div>
            {!session.current && (
              <button
                onClick={() => revoke(session.id)}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors border border-gray-200 hover:border-red-200"
              >
                Revoke
              </button>
            )}
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-4">No other active sessions.</p>
        )}
      </div>
    </div>
  );
}

/* ─── Role Permissions ──────────────────────────────────────────── */
function PermissionsSection({ role }) {
  const perms = role === 'entrepreneur' ? entrepreneurPermissions : investorPermissions;
  const granted = perms.filter((p) => p.access).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            role === 'investor'
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : 'bg-gradient-to-br from-emerald-500 to-teal-600'
          }`}>
            {role === 'investor' ? <CircleDollarSign size={18} className="text-white" /> : <Building2 size={18} className="text-white" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Role Permissions</h3>
            <p className="text-xs text-gray-500 capitalize">{role} account · {granted}/{perms.length} features granted</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
          <UserCheck size={14} className="text-blue-600" />
          <span className="text-xs font-semibold text-blue-600 capitalize">{role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {perms.map((p) => (
          <div
            key={p.feature}
            className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
              p.access ? 'bg-gray-50 hover:bg-gray-100' : 'bg-gray-50/50 opacity-60'
            }`}
          >
            <span className={`text-sm font-medium ${p.access ? 'text-gray-800' : 'text-gray-400'}`}>{p.feature}</span>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
              p.access ? 'bg-emerald-100' : 'bg-gray-200'
            }`}>
              {p.access
                ? <CheckCircle2 size={14} className="text-emerald-600" />
                : <XCircle size={14} className="text-gray-400" />
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Security Score Card ───────────────────────────────────────── */
function SecurityScore({ score = 72 }) {
  const level = score >= 80 ? { label: 'Excellent', color: 'text-emerald-600', ring: 'stroke-emerald-500' }
    : score >= 60 ? { label: 'Good', color: 'text-blue-600', ring: 'stroke-blue-500' }
    : { label: 'Needs Work', color: 'text-amber-600', ring: 'stroke-amber-500' };

  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const tips = [
    { done: true, text: 'Email verified', icon: <Mail size={14} /> },
    { done: true, text: '2FA method chosen', icon: <Smartphone size={14} /> },
    { done: false, text: 'Enable 2FA on login', icon: <Shield size={14} /> },
    { done: false, text: 'Use a strong password', icon: <Key size={14} /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 items-center">
      {/* Circle gauge */}
      <div className="relative flex-shrink-0">
        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" strokeWidth="8" stroke="#e5e7eb" />
          <circle
            cx="50"
            cy="50"
            r={r}
            fill="none"
            strokeWidth="8"
            className={level.ring}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} className={level.color} />
          <span className="text-base font-bold text-gray-900">Security Score</span>
        </div>
        <p className={`text-sm font-semibold mb-3 ${level.color}`}>{level.label}</p>
        <div className="space-y-2">
          {tips.map((tip, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                tip.done ? 'bg-emerald-500' : 'bg-gray-200'
              }`}>
                {tip.done
                  ? <Check size={10} className="text-white" />
                  : <X size={10} className="text-gray-400" />
                }
              </div>
              <span className={`text-xs font-medium ${tip.done ? 'text-gray-700' : 'text-gray-400'}`}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function SecurityPage() {
  const { user } = useAuth();
  const role = user?.role || 'entrepreneur';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
        <p className="text-gray-500 text-sm mt-1">Manage authentication, access control, and active sessions</p>
      </div>

      {/* Security Score */}
      <div className="mb-5">
        <SecurityScore score={72} />
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <LoginDemo />
        <PasswordStrengthSection />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SessionsSection />
        <PermissionsSection role={role} />
      </div>
    </div>
  );
}

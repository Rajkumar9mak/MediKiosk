import React, { useState } from 'react';
import {
  HeartPulse,
  ShieldCheck,
  Key,
  QrCode,
  ArrowRight,
  Sparkles,
  Phone,
  User,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowRightLeft
} from 'lucide-react';
import { PatientProfile } from './types';
import { DEMO_PATIENT_RAHUL, DEMO_PRESET_PATIENTS } from './patientData';
import PatientRegister from './PatientRegister';

interface PatientLoginProps {
  onPatientLogin: (patientProfile: PatientProfile) => void;
  onSwitchToDoctorLogin?: () => void;
}

export default function PatientLogin({
  onPatientLogin,
  onSwitchToDoctorLogin
}: PatientLoginProps) {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'abha'>('credentials');
  const [patientIdInput, setPatientIdInput] = useState('PT-2026-9812');
  const [passwordInput, setPasswordInput] = useState('patient123');
  const [abhaIdInput, setAbhaIdInput] = useState('91-4521-8892-1204');
  const [otpInput, setOtpInput] = useState('482103');
  const [otpSent, setOtpSent] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Match against presets or default demo
    const matched = DEMO_PRESET_PATIENTS.find(
      (p) =>
        p.profile.id.toLowerCase() === patientIdInput.toLowerCase() ||
        p.profile.mobile.includes(patientIdInput) ||
        p.profile.abhaId === patientIdInput
    );

    if (matched) {
      onPatientLogin(matched.profile);
    } else {
      onPatientLogin({
        ...DEMO_PATIENT_RAHUL,
        id: patientIdInput.trim() || 'PT-2026-9812'
      });
    }
  };

  const handleAbhaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
    } else {
      const matched = DEMO_PRESET_PATIENTS.find(
        (p) => p.profile.abhaId === abhaIdInput
      );
      onPatientLogin(matched ? matched.profile : DEMO_PATIENT_RAHUL);
    }
  };

  const handleSelectPreset = (profile: PatientProfile) => {
    onPatientLogin(profile);
  };

  return (
    <div className="min-h-screen bg-[#F7FAF9] flex flex-col justify-between p-4 sm:p-6 text-slate-900">
      {/* Top Header Bar */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900 block leading-tight">
              MediKiosk
            </span>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Your Digital Clinical History
            </span>
          </div>
        </div>

        {onSwitchToDoctorLogin && (
          <button
            type="button"
            onClick={onSwitchToDoctorLogin}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
          >
            <span>Doctor & Staff Login</span>
            <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-700" />
          </button>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto my-auto py-6">
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Panel: SIH Features Highlight */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.2),transparent)]" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 mb-6 text-emerald-100">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                <span>Smart India Hackathon • ABDM</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug mb-3">
                Patient Self-Service Clinical Intake
              </h1>
              <p className="text-xs text-emerald-100/90 leading-relaxed font-normal mb-6">
                Enter your personal patient login ID or scan ABHA to record symptoms via dual-mode voice and touch, upload prior records, and streamline your physician OPD visit.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>Dual-Mode Voice Speech & Touch Intake</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>OCR Ingestion of Prescriptions & Labs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>Red-Flag Emergency Priority Triage</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />
                  <span>AI Structured Summary for Doctor Review</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/15 mt-6 text-xs text-emerald-200">
              <span className="text-[10px] uppercase tracking-wider block opacity-70">
                Compliance & Security
              </span>
              <span className="font-semibold text-white">
                Ayushman Bharat Digital Mission (ABDM) • AES-256
              </span>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your personal health records and current case.
                </p>
              </div>

              {/* Login Tabs: Credentials vs ABHA */}
              <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setLoginMethod('credentials')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    loginMethod === 'credentials'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Personal Login ID
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('abha')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                    loginMethod === 'abha'
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login with ABHA
                </button>
              </div>

              {/* Method 1: Personal ID & Password (Requested in screenshot/prompt) */}
              {loginMethod === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Patient ID / Mobile / ABHA ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={patientIdInput}
                        onChange={(e) => setPatientIdInput(e.target.value)}
                        placeholder="e.g. PT-2026-9812 or 9876543210"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-medium text-slate-900 text-xs"
                      />
                      <User className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => alert('Demo password reset link sent via SMS to linked number.')}
                        className="text-[11px] text-emerald-700 hover:underline cursor-pointer font-semibold"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="•••••••••"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-medium text-slate-900 text-xs"
                      />
                      <Lock className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/25 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    Login
                  </button>
                </form>
              )}

              {/* Method 2: Login with ABHA (SIH Demo Requirement) */}
              {loginMethod === 'abha' && (
                <form onSubmit={handleAbhaSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      14-Digit ABHA ID / Aadhaar Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={abhaIdInput}
                        onChange={(e) => setAbhaIdInput(e.target.value)}
                        placeholder="e.g. 91-4521-8892-1204"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 font-mono text-slate-900 text-xs"
                      />
                      <QrCode className="h-4 w-4 text-slate-400 absolute right-3.5 top-3.5" />
                    </div>
                  </div>

                  {otpSent && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <label className="block text-[11px] font-bold text-emerald-900 uppercase tracking-wider mb-1">
                        Enter 6-Digit OTP sent to linked mobile (+91 ••••• 43210)
                      </label>
                      <input
                        type="text"
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg border border-emerald-300 bg-white font-mono text-center tracking-widest text-sm font-bold"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md shadow-emerald-700/25 cursor-pointer transition-all hover:translate-y-[-1px]"
                  >
                    {otpSent ? 'Verify OTP & Enter' : 'Generate ABDM OTP'}
                  </button>
                </form>
              )}

              {/* Register trigger */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600">New patient without an account?</span>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(true)}
                  className="font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  New Patient? Register
                </button>
              </div>

              {/* 1-Click Fast Demo Presets */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-600" /> Fast Demo Logins (SIH Evaluators):
                </span>
                <div className="space-y-2">
                  {DEMO_PRESET_PATIENTS.map((preset) => (
                    <button
                      key={preset.profile.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.profile)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors text-xs flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <span className="font-bold text-slate-800 group-hover:text-emerald-900 block leading-tight">
                          {preset.profile.name} ({preset.profile.age}y/o)
                        </span>
                        <span className="text-[11px] text-slate-500 truncate block max-w-[280px]">
                          {preset.caseSnippet}
                        </span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-700 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl w-full mx-auto text-center text-xs text-slate-500 py-2">
        <span>MediKiosk Intelligent Patient Intake Platform • Ayushman Bharat Digital Mission Compatible</span>
      </footer>

      {/* Registration Modal */}
      {showRegisterModal && (
        <PatientRegister
          onRegisterSuccess={(newPatient) => {
            setShowRegisterModal(false);
            onPatientLogin(newPatient);
          }}
          onClose={() => setShowRegisterModal(false)}
        />
      )}
    </div>
  );
}

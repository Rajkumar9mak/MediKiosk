import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Database,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { User } from '../types';

interface SettingsPanelProps {
  user: User | null;
  token: string;
}

export default function SettingsPanel({ user, token }: SettingsPanelProps) {
  const [sensitivity, setSensitivity] = useState<'Standard' | 'Aggressive' | 'Conservative'>('Standard');
  const [autoTriage, setAutoTriage] = useState(true);
  const [ocrEngine, setOcrEngine] = useState('Google Cloud Vision / Tesseract v5');
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const handleResetData = async () => {
    if (user?.role !== 'Admin') {
      alert('Only administrators can reset the operational database.');
      return;
    }
    if (!confirm('Are you sure you want to reset the operational dataset to initial volume?')) {
      return;
    }

    setResetting(true);
    setResetMsg(null);
    try {
      const res = await fetch('/api/simulation/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setResetMsg('Database successfully reset to seed volume.');
      } else {
        setResetMsg('Failed to reset database.');
      }
    } catch (e) {
      setResetMsg('Network error while resetting.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">MediKiosk System & Triage Configuration</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage clinical decision thresholds, kiosk hardware peripherals, and database connectivity
            </p>
          </div>
        </div>
      </div>

      {/* Kiosk Hardware & Status */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Cpu className="h-4 w-4 text-teal-600" />
          <span>Kiosk Peripheral & Node Status</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Touch Interface Panel</span>
              <p className="text-[11px] text-slate-500">Multi-touch capacitive display</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">OCR Scanner / Camera</span>
              <p className="text-[11px] text-slate-500">High-res macro document reader</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Calibrated
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Vital Signs Ingress Sensor</span>
              <p className="text-[11px] text-slate-500">Pulse Oximeter & Digital NIBP</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Online
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">PostgreSQL RDS Storage</span>
              <p className="text-[11px] text-slate-500">Health records & billing partition</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* AI & Clinical Triage Rules */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sliders className="h-4 w-4 text-purple-600" />
          <span>AI Clinical Anamnesis & Red Flag Engine</span>
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Red-Flag Sensitivity Threshold</label>
            <div className="grid grid-cols-3 gap-3">
              {(['Conservative', 'Standard', 'Aggressive'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSensitivity(lvl)}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer ${
                    sensitivity === lvl
                      ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              "Standard" uses standard SIH emergency triage parameters (SpO2 &lt; 94%, acute retrosternal chest pain, extreme hypertension).
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Automated Physician Alert Dispatch</span>
              <span className="text-[11px] text-slate-500">Notify on-duty emergency physicians when red flag is flagged</span>
            </div>
            <input
              type="checkbox"
              checked={autoTriage}
              onChange={(e) => setAutoTriage(e.target.checked)}
              className="h-4 w-4 accent-teal-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Admin Reset Option */}
      {user?.role === 'Admin' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-rose-800 flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="h-4 w-4 text-rose-600" />
            <span>Administrative Controls</span>
          </h2>
          <p className="text-xs text-slate-600">
            Reset the simulated operational database back to initial seed data volume (removes generated ticks).
          </p>

          <button
            type="button"
            onClick={handleResetData}
            disabled={resetting}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Operational Database to Seed'}</span>
          </button>

          {resetMsg && (
            <p className="text-xs font-semibold text-slate-800">{resetMsg}</p>
          )}
        </div>
      )}

    </div>
  );
}

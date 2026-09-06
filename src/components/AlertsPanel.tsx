import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  HeartPulse,
  Thermometer,
  Activity,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { CaseRecord } from '../case';

interface AlertsPanelProps {
  cases: CaseRecord[];
  onViewCase: (caseId: string) => void;
}

export default function AlertsPanel({ cases, onViewCase }: AlertsPanelProps) {
  const redFlags = cases.filter((c) => c.redFlag);
  const urgentCases = cases.filter((c) => !c.redFlag && c.urgency === 'Urgent');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
              EMERGENCY TRIAGE
            </span>
            <span className="text-xs text-slate-500 font-medium">• Clinical Red Flag Surveillance</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Clinical Red Flag Alerts & High Urgency Triage
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time algorithmic surveillance identifying life-threatening presentations and abnormal vital indicators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
            <ShieldAlert className="h-4 w-4" />
            <span>{redFlags.length} Active Red Flags</span>
          </span>
        </div>
      </div>

      {/* Red Flags List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-600" />
          <span>Critical Red-Flag Cases ({redFlags.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {redFlags.map((c) => (
            <div
              key={c.id}
              onClick={() => onViewCase(c.id)}
              className="bg-white border-2 border-rose-200 hover:border-rose-400 rounded-2xl p-5 shadow-xs transition-all cursor-pointer space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900">{c.patientName}</span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                    {c.urgency}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {c.patientAge}y • {c.patientGender} • Case ID: {c.id}
                </div>

                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 mt-3">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    Medical Warning Criteria:
                  </span>
                  <p className="text-xs font-bold text-rose-950 mt-1">
                    {c.redFlagReason}
                  </p>
                </div>

                <div className="mt-3 text-xs text-slate-700">
                  <strong>Chief Complaint:</strong> "{c.chiefComplaint}"
                </div>

                {c.vitals && (
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">BP</span>
                      <strong className="text-slate-800">{c.vitals.bp}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">SpO2</span>
                      <strong className={c.vitals.spO2 < 95 ? 'text-rose-600' : 'text-slate-800'}>{c.vitals.spO2}%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Pulse</span>
                      <strong className="text-slate-800">{c.vitals.pulse} bpm</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50">
                      <span className="text-[10px] text-slate-400 block">Temp</span>
                      <strong className="text-slate-800">{c.vitals.temp}°F</strong>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Arrived {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="font-bold text-rose-600 hover:underline flex items-center gap-1">
                  Open Triage Review <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Urgent Cases List */}
      {urgentCases.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>High-Priority Ambulatory Cases ({urgentCases.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {urgentCases.map((uc) => (
              <div
                key={uc.id}
                onClick={() => onViewCase(uc.id)}
                className="bg-white border border-amber-200 hover:border-amber-300 rounded-2xl p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{uc.patientName}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Urgent
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2">"{uc.chiefComplaint}"</p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{uc.patientAge}y • {uc.patientGender}</span>
                  <span className="font-semibold text-amber-700 hover:underline flex items-center gap-1">
                    Review Case <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

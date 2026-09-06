import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Stethoscope,
  Activity,
  Heart,
  Clock,
  User,
  ShieldCheck,
  FileText,
  ChevronRight,
  Printer,
  Share2
} from 'lucide-react';
import { CaseRecord } from '../case';

interface AISummaryPanelProps {
  cases: CaseRecord[];
  selectedCaseId?: string | null;
  onVerifyCase: (caseId: string) => void;
  onSelectCase: (caseId: string) => void;
}

export default function AISummaryPanel({
  cases,
  selectedCaseId,
  onVerifyCase,
  onSelectCase
}: AISummaryPanelProps) {
  // Find current active case
  const activeCase =
    cases.find((c) => c.id === selectedCaseId) ||
    cases.find((c) => c.aiStatus === 'Summary Ready') ||
    cases[0];

  const [verificationNotes, setVerificationNotes] = useState('');
  const [justVerified, setJustVerified] = useState(false);

  const handleVerify = () => {
    if (activeCase) {
      onVerifyCase(activeCase.id);
      setJustVerified(true);
      setTimeout(() => setJustVerified(false), 3000);
    }
  };

  if (!activeCase) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-xs">
        <Sparkles className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">No Clinical Cases Available</h3>
        <p className="text-xs text-slate-500 mt-1">Start a new patient case to generate an AI summary.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              PHYSICIAN CONSOLE
            </span>
            <span className="text-xs text-slate-500 font-medium">• Clinical Anamnesis Verification</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            AI Clinical Summary & Verification
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Structured history, clinical timeline, and synthesized physician review
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print EHR</span>
          </button>

          {activeCase.aiStatus !== 'Reviewed' ? (
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Verify & Sign Off</span>
            </button>
          ) : (
            <span className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Verified by Physician</span>
            </span>
          )}
        </div>
      </div>

      {justVerified && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Case {activeCase.id} verified and signed off. Marked as reviewed in clinical queue.</span>
        </div>
      )}

      {/* Main Split: Left Case Selector (4 cols) & Right AI Clinical Report (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Case Selector Sidebar */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Patient Cases</h3>
            <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {cases.length} Total
            </span>
          </div>

          <div className="space-y-2 max-h-[700px] overflow-y-auto">
            {cases.map((c) => {
              const isSelected = c.id === activeCase.id;
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{c.patientName}</span>
                    {c.redFlag ? (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        ⚠ Red Flag
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-500">{c.urgency}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                    {c.chiefComplaint}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>{c.patientAge}y • {c.patientGender}</span>
                    <span className={`font-semibold ${c.aiStatus === 'Reviewed' ? 'text-emerald-600' : 'text-teal-600'}`}>
                      {c.aiStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Clinical Summary Report Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Patient Card Header */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                  {activeCase.patientName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{activeCase.patientName}</h2>
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {activeCase.patientId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeCase.patientAge} years old • {activeCase.patientGender} • Case ID: {activeCase.id}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end gap-1">
                <span className="text-[11px] text-slate-400">Intake Time</span>
                <span className="text-xs font-semibold text-slate-700">
                  {new Date(activeCase.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Red Flag Warning Notice if applicable */}
            {activeCase.redFlag && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    High-Risk Medical Red Flag Alert
                  </h4>
                  <p className="text-xs font-medium mt-0.5">
                    {activeCase.redFlagReason || 'Immediate clinical review recommended.'}
                  </p>
                </div>
              </div>
            )}

            {/* Vitals Ribbon */}
            {activeCase.vitals && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Pressure</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{activeCase.vitals.bp}</span>
                  <span className="text-[10px] text-slate-500">mmHg</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pulse / Heart Rate</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{activeCase.vitals.pulse}</span>
                  <span className="text-[10px] text-slate-500">bpm</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Temperature</span>
                  <span className="text-sm font-bold text-slate-900 mt-0.5 block">{activeCase.vitals.temp}°F</span>
                  <span className="text-[10px] text-slate-500">oral</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Oxygen Sat (SpO2)</span>
                  <span className={`text-sm font-bold mt-0.5 block ${activeCase.vitals.spO2 < 95 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeCase.vitals.spO2}%
                  </span>
                  <span className="text-[10px] text-slate-500">ambient air</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Synthesis Section */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Clinical Anamnesis Summary</h3>
            </div>

            <div className="space-y-4">
              {/* Chief Complaint */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chief Complaint</h4>
                <p className="text-sm text-slate-800 font-semibold mt-1">
                  "{activeCase.chiefComplaint}"
                </p>
              </div>

              {/* Present Illness / Summary narrative */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">History of Present Illness (HPI)</h4>
                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {activeCase.historyOfPresentIllness || activeCase.clinicalSummary || 'Patient reported acute onset of symptoms. Structured anamnesis recorded through MediKiosk conversational interface.'}
                </p>
              </div>

              {/* Detected Symptoms */}
              {activeCase.symptoms && activeCase.symptoms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Symptoms</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {activeCase.symptoms.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Past History & Allergies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Comorbidities</h4>
                  <div className="text-xs text-slate-700 mt-1">
                    {activeCase.pastMedicalHistory && activeCase.pastMedicalHistory.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-0.5">
                        {activeCase.pastMedicalHistory.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No known chronic conditions</span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allergies & Contraindications</h4>
                  <div className="text-xs text-slate-700 mt-1">
                    {activeCase.allergies && activeCase.allergies.length > 0 ? (
                      <ul className="list-disc pl-4 space-y-0.5">
                        {activeCase.allergies.map((a) => (
                          <li key={a} className="text-rose-700 font-semibold">{a}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>None reported</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Differential Diagnoses & Recommended Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                    AI Differential Considerations
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {activeCase.differentialDiagnosis?.map((d) => (
                      <li key={d} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                        <span>{d}</span>
                      </li>
                    )) || <li>Clinical evaluation in progress</li>}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                    Recommended Clinical Actions
                  </h4>
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {activeCase.recommendedActions?.map((r) => (
                      <li key={r} className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                        <span>{r}</span>
                      </li>
                    )) || <li>Standard physician consultation</li>}
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Clinical History Timeline */}
          {activeCase.timeline && activeCase.timeline.length > 0 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                Patient Clinical Event Timeline
              </h3>
              <div className="mt-4 relative pl-5 border-l-2 border-teal-200 space-y-4 text-xs">
                {activeCase.timeline.map((t, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[27px] top-0.5 h-3 w-3 rounded-full ring-4 ring-white ${
                      t.status === 'Alert' ? 'bg-rose-500' : 'bg-teal-600'
                    }`} />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{t.event}</span>
                      <span className="text-[11px] font-mono text-slate-400">{t.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

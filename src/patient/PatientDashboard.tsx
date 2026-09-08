import React from 'react';
import {
  Stethoscope,
  FileText,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  User,
  HeartPulse,
  Activity,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { PatientActiveCase, PatientProfile, PatientTimelineEvent } from './types';
import { INITIAL_ACTIVE_CASE, DEMO_PATIENT_RAHUL, INITIAL_TIMELINE_EVENTS } from './patientData';
import { speakText } from './AccessibilityBar';

interface PatientDashboardProps {
  patient?: PatientProfile;
  activeCase?: PatientActiveCase;
  documentsCount?: number;
  consultationsCount?: number;
  timelineEvents?: PatientTimelineEvent[];
  onStartNewCase: () => void;
  onContinueCase: () => void;
  onNavigateTab: (tab: string) => void;
  highContrast?: boolean;
}

export default function PatientDashboard({
  patient = DEMO_PATIENT_RAHUL,
  activeCase = INITIAL_ACTIVE_CASE,
  documentsCount = 6,
  consultationsCount = 3,
  timelineEvents = INITIAL_TIMELINE_EVENTS,
  onStartNewCase,
  onContinueCase,
  onNavigateTab,
  highContrast = false
}: PatientDashboardProps) {
  const firstName = patient.name.split(' ')[0] || 'Patient';

  return (
    <div className="space-y-8">
      {/* 1. Greeting Banner with Prominent CTA */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border transition-all relative overflow-hidden ${
          highContrast
            ? 'bg-black text-amber-300 border-amber-400'
            : 'bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white shadow-lg'
        }`}
      >
        {/* Subtle decorative background ring */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
          <HeartPulse className="h-72 w-72" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur border border-white/20 mb-3 text-emerald-100">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
              <span>MediKiosk Clinical Portal • ABHA ID: {patient.abhaId}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Good morning, {firstName} 👋
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-xl font-normal leading-relaxed">
              Let's keep your medical history up to date. You can provide clinical history through voice or touch, upload medical documents, and generate a structured physician report.
            </p>
          </div>

          {/* LARGE PRIMARY BUTTON: + Start New Case */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={onStartNewCase}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-base font-extrabold shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-5 w-5 text-emerald-700 stroke-[3]" />
              <span>+ Start New Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Dashboard Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Case */}
        <div
          onClick={onContinueCase}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                🩺 Active Case
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">
              {activeCase.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Interview: {activeCase.progressPercentage}% Completed
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 hover:underline">
              [ Continue ]
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 2: Documents */}
        <div
          onClick={() => onNavigateTab('documents')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                📄 Documents
              </span>
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">
              {documentsCount} Uploaded
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              All scanned with AI OCR
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 hover:underline">
              [ Manage Documents ]
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 3: AI Summary */}
        <div
          onClick={() => onNavigateTab('aisummary')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                🤖 AI Summary
              </span>
              <Sparkles className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">
              Ready for Review
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Verified by patient consent
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 hover:underline">
              [ Inspect Summary ]
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 4: Consultations */}
        <div
          onClick={() => onNavigateTab('consultations')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                🏥 Consultations
              </span>
              <Calendar className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 leading-tight">
              {consultationsCount} Completed
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Dr. Verma & Dr. Wilson
            </p>
          </div>

          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 hover:underline">
              [ View Past Notes ]
            </span>
            <ChevronRight className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 3. MOST IMPORTANT SECTION — Medical History Progress (Core SIH Highlight) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
              <Activity className="h-3.5 w-3.5" />
              <span>SIH Intake Engine • Active Case Tracking</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Your Current Case: <span className="text-emerald-800">{activeCase.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Started {activeCase.startedAt} • Token #{activeCase.opdToken || 'OPD-104'}
            </p>
          </div>

          <button
            type="button"
            onClick={onContinueCase}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer transition-all self-start sm:self-center"
          >
            <span>Continue History Taking</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Bar Display */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              Medical History Completion
            </span>
            <span className="font-extrabold text-emerald-800 text-sm">
              {activeCase.progressPercentage}%
            </span>
          </div>

          {/* Styled progress bar */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              style={{ width: `${activeCase.progressPercentage}%` }}
              className="bg-emerald-600 h-full rounded-full transition-all duration-500 shadow-xs"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            3 of 4 core intake sections completed
          </span>
        </div>

        {/* Section Checklist (Matches exact text in user prompt) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {activeCase.sections.map((sec) => (
            <div
              key={sec.id}
              className={`p-3 rounded-2xl border text-left transition-all ${
                sec.status === 'completed'
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                  : sec.status === 'in_progress'
                  ? 'bg-amber-50/70 border-amber-300 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {sec.status === 'completed' && <span className="text-emerald-700 font-bold">✓</span>}
                {sec.status === 'in_progress' && <span className="text-amber-600 font-bold">◐</span>}
                {sec.status === 'pending' && <span className="text-slate-400 font-bold">○</span>}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {sec.status === 'completed' ? 'Done' : sec.status === 'in_progress' ? 'Active' : 'Pending'}
                </span>
              </div>
              <span className="text-xs font-bold block truncate">{sec.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Timeline: My Medical Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Journey Timeline */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                My Medical Journey
              </h3>
              <p className="text-xs text-slate-500">
                Chronological timeline automatically organized by MediKiosk
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              08 Sep 2026
            </span>
          </div>

          <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative pl-8 flex items-start justify-between gap-4">
                {/* Node indicator */}
                <div
                  className={`absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-white ${
                    evt.status === 'completed'
                      ? 'bg-emerald-600'
                      : evt.status === 'pending'
                      ? 'bg-slate-300'
                      : 'bg-amber-500'
                  }`}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {evt.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {evt.description}
                  </p>
                </div>

                {evt.badge && (
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {evt.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Emergency & Triage Widget */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-200/70 space-y-3">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Hospital OPD Queue
            </span>
            <div className="text-2xl font-black text-emerald-950 font-mono">
              Token #{activeCase.opdToken || 'OPD-104'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assigned to <strong>{activeCase.assignedDoctor || 'Dr. Rajesh Verma'}</strong> in General Medicine OPD (Room 4).
            </p>
            <div className="pt-2 border-t border-emerald-200 text-xs text-emerald-800 font-medium">
              Estimated wait: ~12 minutes
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              <span>ABDM Encrypted Session</span>
            </span>
            <p>
              Your health data is secured under the Ayushman Bharat Digital Mission guidelines and accessible only to authorized healthcare staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

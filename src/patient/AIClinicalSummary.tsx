import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Edit3,
  CheckCircle2,
  FileText,
  User,
  ArrowRight,
  ArrowLeft,
  Info,
  Clock,
  Send,
  Save
} from 'lucide-react';
import { PatientDocument } from './types';

interface AIClinicalSummaryProps {
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  chiefComplaint?: string;
  location?: string;
  painLevel?: number;
  duration?: string;
  symptoms?: string[];
  pastConditions?: string[];
  documents?: PatientDocument[];
  vitals?: { bp: string; pulse: number; temp: number; spO2: number };
  redFlag?: boolean;
  redFlagReason?: string;
  onConfirm?: (finalSummary: any) => void;
  onBack?: () => void;
  isStandaloneTab?: boolean;
  highContrast?: boolean;
}

export default function AIClinicalSummary({
  patientName = 'Rahul Verma',
  patientAge = 32,
  patientGender = 'Male',
  chiefComplaint = 'Fever for 3 days associated with frontal throbbing headache and fatigue',
  location = 'Head',
  painLevel = 6,
  duration = '3 Days',
  symptoms = ['Fever (101.4°F)', 'Throbbing Frontal Headache', 'Body Ache', 'Mild Loss of Appetite'],
  pastConditions = ['None reported'],
  documents = [],
  vitals = { bp: '122/78', pulse: 84, temp: 101.4, spO2: 98 },
  redFlag = false,
  redFlagReason,
  onConfirm,
  onBack,
  isStandaloneTab = false,
  highContrast = false
}: AIClinicalSummaryProps) {
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedComplaint, setEditedComplaint] = useState(chiefComplaint);
  const [editedHpi, setEditedHpi] = useState(
    `${patientAge}y/o ${patientGender.toLowerCase()} presents with ${chiefComplaint.toLowerCase()}. Onset ${duration} ago. Discomfort focused around ${location} with self-reported severity ${painLevel}/10. No vomiting or stiff neck noted.`
  );
  const [editedPastHistory, setEditedPastHistory] = useState(
    pastConditions.length > 0 ? pastConditions.join(', ') : 'No prior chronic conditions reported.'
  );
  const [editedMedications, setEditedMedications] = useState(
    'Tab. Paracetamol 650mg TDS (self-reported from recent prescription document)'
  );
  const [editedAllergies, setEditedAllergies] = useState('No known drug allergies reported (NKDA)');
  const [confirmed, setConfirmed] = useState(false);

  const handleSaveEdits = () => {
    setIsEditing(false);
  };

  const handleFinalConfirm = () => {
    setConfirmed(true);
    if (onConfirm) {
      onConfirm({
        chiefComplaint: editedComplaint,
        hpi: editedHpi,
        pastMedicalHistory: editedPastHistory,
        medications: editedMedications,
        allergies: editedAllergies,
        vitals,
        documents,
        redFlag,
        redFlagReason
      });
    }
  };

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border max-w-4xl mx-auto transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            <span>AI Clinical Synthesis • ABDM FHIR Profile</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Clinical Summary
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Structured patient history generated from your voice, touch responses, and uploaded documents.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Status: 🟢 Ready for Review</span>
          </span>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isEditing
                ? 'bg-emerald-700 text-white border-emerald-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            {isEditing ? <Save className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
            <span>{isEditing ? 'Done Editing' : 'Edit Information'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Medical Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3 mb-6">
        <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold block text-amber-950">
            Clinical Safety Notice (SIH Specification Requirement):
          </strong>
          The AI system does <strong>NOT</strong> diagnose the patient. This summary organizes your symptoms, documents, and vitals to assist your attending physician. The physician retains full clinical control, evaluation, and verification.
        </div>
      </div>

      {/* Red Flag Warning Box if applicable */}
      {redFlag && (
        <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-400 text-red-900 text-xs flex items-start gap-3 mb-6">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold block text-red-950 uppercase tracking-wider">
              ⚠️ Priority Clinical Triage Flag
            </strong>
            <span>{redFlagReason || 'Urgent clinical evaluation indicated. Priority ticket assigned in OPD queue.'}</span>
          </div>
        </div>
      )}

      {/* Patient Information Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Patient Name</span>
          <span className="font-bold text-slate-900">{patientName}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Demographics</span>
          <span className="font-bold text-slate-900">{patientAge} Yrs / {patientGender}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Vitals Checked</span>
          <span className="font-mono text-slate-800">
            BP {vitals.bp} | SpO2 {vitals.spO2}%
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Body Temperature</span>
          <span className={`font-bold font-mono ${vitals.temp >= 100.4 ? 'text-amber-600' : 'text-slate-900'}`}>
            {vitals.temp}°F ({vitals.temp >= 100.4 ? 'Febrile' : 'Normal'})
          </span>
        </div>
      </div>

      {/* Structured Clinical History Sections */}
      <div className="space-y-4 mb-8 text-xs">
        {/* 1. Chief Complaint */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Chief Complaint
            </span>
            <span className="text-[10px] text-slate-400 font-mono">CC</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedComplaint}
              onChange={(e) => setEditedComplaint(e.target.value)}
              className="w-full p-2 text-xs border border-emerald-400 rounded-lg focus:outline-none"
            />
          ) : (
            <p className="text-sm font-bold text-slate-900">{editedComplaint}</p>
          )}
        </div>

        {/* 2. History of Present Illness (HPI) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              History of Present Illness (HPI)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">HPI</span>
          </div>
          {isEditing ? (
            <textarea
              rows={3}
              value={editedHpi}
              onChange={(e) => setEditedHpi(e.target.value)}
              className="w-full p-2 text-xs border border-emerald-400 rounded-lg focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed font-normal">{editedHpi}</p>
          )}
        </div>

        {/* 3. Past Medical History */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Past Medical History
            </span>
            <span className="text-[10px] text-slate-400 font-mono">PMH</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedPastHistory}
              onChange={(e) => setEditedPastHistory(e.target.value)}
              className="w-full p-2 text-xs border border-emerald-400 rounded-lg focus:outline-none"
            />
          ) : (
            <p className="text-xs text-slate-800 font-medium">{editedPastHistory}</p>
          )}
        </div>

        {/* 4. Current Medications & Allergies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Current Medications
              </span>
              <span className="text-[10px] text-slate-400 font-mono">MEDS</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedMedications}
                onChange={(e) => setEditedMedications(e.target.value)}
                className="w-full p-2 text-xs border border-emerald-400 rounded-lg focus:outline-none"
              />
            ) : (
              <p className="text-xs text-slate-800 font-medium">{editedMedications}</p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Allergies (Adverse Drug Reactions)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ALLERGIES</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editedAllergies}
                onChange={(e) => setEditedAllergies(e.target.value)}
                className="w-full p-2 text-xs border border-emerald-400 rounded-lg focus:outline-none"
              />
            ) : (
              <p className="text-xs text-slate-800 font-medium">{editedAllergies}</p>
            )}
          </div>
        </div>

        {/* 5. Previous Investigations / Uploaded Reports */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Previous Investigations & Ingested Documents
            </span>
            <span className="text-[10px] text-slate-400 font-mono">OCR LABS</span>
          </div>

          <div className="space-y-1.5">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Complete Blood Count (CBC) — 06 Sep 2026</span>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                Platelets: 185k (Normal) • WBC: 11.2k
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Prior Clinic Prescription — 04 Sep 2026</span>
              </div>
              <span className="text-[11px] text-slate-600 font-mono">
                Tab Paracetamol 650mg TDS
              </span>
            </div>
          </div>
        </div>

        {/* 6. Important Clinical Finding Highlight */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              ⚠️ Important Clinical Finding
            </span>
          </div>
          <p className="text-xs text-amber-900">
            Temperature recorded: <strong>{vitals.temp}°F</strong> (Pyrexia). Associated with 3-day frontal cephalalgia. Red-flag symptoms for vector-borne fever and meningitis should be screened during physical consultation.
          </p>
        </div>
      </div>

      {/* Confirmation State Banner */}
      {confirmed && (
        <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 mb-6 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
          <div className="text-xs">
            <strong className="block font-bold">Summary Confirmed by Patient</strong>
            <span>This structured record has been routed to the attending physician's clinical queue.</span>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      {!isStandaloneTab && (
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinalConfirm}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-700/25 transition-all cursor-pointer hover:translate-y-[-1px]"
            >
              <Send className="h-4 w-4" />
              <span>Confirm & Route to Doctor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

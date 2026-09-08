import React, { useState } from 'react';
import {
  Calendar,
  Stethoscope,
  Pill,
  Clock,
  CheckCircle2,
  ChevronRight,
  Hospital,
  FileText,
  User,
  Plus
} from 'lucide-react';
import { ConsultationRecord } from './types';
import { INITIAL_CONSULTATIONS } from './patientData';

interface MyConsultationsProps {
  consultations?: ConsultationRecord[];
  onBookOrStartCase?: () => void;
  highContrast?: boolean;
}

export default function MyConsultations({
  consultations = INITIAL_CONSULTATIONS,
  onBookOrStartCase,
  highContrast = false
}: MyConsultationsProps) {
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRecord | null>(
    consultations[0] || null
  );

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-2">
            <Stethoscope className="h-3.5 w-3.5" />
            <span>Consultation History • MediKiosk OPD</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Consultations & Doctor Notes
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Past physician reviews, official diagnoses, and prescribed medication plans.
          </p>
        </div>

        {onBookOrStartCase && (
          <button
            type="button"
            onClick={onBookOrStartCase}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Start New Case Taking</span>
          </button>
        )}
      </div>

      {/* Consultations List & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Consultations cards */}
        <div className="lg:col-span-5 space-y-3">
          {consultations.map((c) => {
            const isSelected = selectedConsultation?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedConsultation(c)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-emerald-700" />
                    <span>{c.doctorName}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{c.date}</span>
                </div>

                <div className="text-xs text-slate-600 mb-2">
                  <span>{c.department}</span> • <span>{c.hospital}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800 block truncate">
                    Diagnosis: {c.diagnosis}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 text-[11px]">
                  <span className="text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-md">
                    {c.status}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    {c.prescriptions.length} Meds <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: Detailed View */}
        <div className="lg:col-span-7">
          {selectedConsultation ? (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedConsultation.doctorName}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {selectedConsultation.department} • {selectedConsultation.hospital}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700 block">
                    {selectedConsultation.date}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase bg-emerald-100 px-2 py-0.5 rounded-md">
                    {selectedConsultation.status}
                  </span>
                </div>
              </div>

              {/* Chief Complaint & Diagnosis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Presenting Complaint
                  </span>
                  <p className="font-semibold text-slate-800">{selectedConsultation.chiefComplaint}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Physician Diagnosis
                  </span>
                  <p className="font-bold text-emerald-900">{selectedConsultation.diagnosis}</p>
                </div>
              </div>

              {/* Prescriptions */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Pill className="h-4 w-4 text-emerald-700" />
                  <span>Prescribed Medicines ({selectedConsultation.prescriptions.length}):</span>
                </h4>
                <div className="space-y-2">
                  {selectedConsultation.prescriptions.map((rx, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{rx.medicine}</span>
                        <span className="text-slate-500">{rx.dosage}</span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {rx.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                <span>Digitally signed and archived in ABDM Personal Health Record (PHR).</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select a consultation from the list to view notes and prescriptions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

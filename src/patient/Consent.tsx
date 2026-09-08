import React, { useState } from 'react';
import { ShieldCheck, Lock, FileText, Check, ArrowRight, ArrowLeft, Info, KeyRound } from 'lucide-react';
import { speakText } from './AccessibilityBar';
import { IndianLanguage } from './types';

interface ConsentProps {
  language: IndianLanguage;
  patientName: string;
  onConsentGiven: () => void;
  onBack: () => void;
  highContrast?: boolean;
}

export default function Consent({
  language,
  patientName,
  onConsentGiven,
  onBack,
  highContrast = false
}: ConsentProps) {
  const [agreed, setAgreed] = useState(false);
  const [shareRecordsConsent, setShareRecordsConsent] = useState(true);

  const handleToggle = () => {
    const next = !agreed;
    setAgreed(next);
    if (next) {
      speakText('Consent granted. Proceeding with secure clinical history collection.', language);
    }
  };

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border max-w-3xl mx-auto transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Step Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-3">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Step 2 of 5 — ABDM & Clinical Consent</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Before We Begin
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Please review how your health data is gathered, encrypted, and shared with your attending physician under the Ayushman Bharat Digital Mission (ABDM) standards.
        </p>
      </div>

      {/* Consent Box */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              ABDM-Compliant Patient Data Capture Notice
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mt-1">
              MediKiosk will collect your medical history and documents to prepare your clinical record.
              Your information will be securely processed, stored using end-to-end encryption, and shared with the hospital/doctor only after your explicit consent.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">Encrypted Records</span>
              <span className="text-[11px] text-slate-500">AES-256 local & cloud security</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <KeyRound className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">ABHA Ecosystem</span>
              <span className="text-[11px] text-slate-500">Revocable consent manager</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
          <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Physician Verification Guarantee:</strong> The AI clinical assistant summarizes your inputs but does <em>not</em> make an autonomous medical diagnosis. Your doctor will review, adjust, and approve every record.
          </div>
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3 mb-8">
        <label className="flex items-start gap-3 p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-400 cursor-pointer bg-white transition-colors">
          <input
            type="checkbox"
            checked={agreed}
            onChange={handleToggle}
            className="mt-1 h-5 w-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
          />
          <div>
            <span className="text-sm font-bold text-slate-900 block">
              I understand and agree to MediKiosk's clinical data capture
            </span>
            <span className="text-xs text-slate-600">
              I authorize the digital kiosk to record my symptoms, process my uploaded documents, and prepare an AI summary for my doctor.
            </span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={shareRecordsConsent}
            onChange={(e) => setShareRecordsConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
          />
          <div className="text-xs text-slate-700">
            Allow temporary syncing with attending hospital OPD triage desk (Consent Artifact #ABDM-CONSENT-9812)
          </div>
        </label>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          disabled={!agreed}
          onClick={onConsentGiven}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-md ${
            agreed
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/25 cursor-pointer hover:translate-y-[-1px]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>Give Consent & Continue</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

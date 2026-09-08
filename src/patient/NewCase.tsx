import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  Printer,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import Consent from './Consent';
import ClinicalInterview from './ClinicalInterview';
import DocumentUpload from './DocumentUpload';
import AIClinicalSummary from './AIClinicalSummary';
import { IndianLanguage, PatientDocument } from './types';
import { CaseRecord } from '../case';

interface NewCaseProps {
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientId: string;
  onCaseCreated: (createdCase: CaseRecord) => void;
  onFinish: () => void;
  onSwitchToDoctorView?: () => void;
  audioGuidance: boolean;
  highContrast?: boolean;
}

export default function NewCase({
  patientName,
  patientAge,
  patientGender,
  patientId,
  onCaseCreated,
  onFinish,
  onSwitchToDoctorView,
  audioGuidance,
  highContrast = false
}: NewCaseProps) {
  // Steps: 1 (Language) -> 2 (Consent) -> 3 (Interview) -> 4 (Documents) -> 5 (Summary) -> 6 (Routing Success)
  const [step, setStep] = useState<number>(1);
  const [selectedLanguage, setSelectedLanguage] = useState<IndianLanguage>('en');

  // Collected Case Data
  const [interviewData, setInterviewData] = useState<{
    chiefComplaint: string;
    location: string;
    painLevel: number;
    duration: string;
    symptoms: string[];
    pastConditions: string[];
    vitals: { bp: string; pulse: number; temp: number; spO2: number };
    redFlag: boolean;
    redFlagReason?: string;
  }>({
    chiefComplaint: 'Fever for 3 days associated with frontal headache and body ache',
    location: 'Head',
    painLevel: 6,
    duration: '3 - 5 Days',
    symptoms: ['High Fever', 'Frontal Headache', 'Body Ache & Fatigue'],
    pastConditions: [],
    vitals: { bp: '122/78', pulse: 84, temp: 101.4, spO2: 98 },
    redFlag: false
  });

  const [uploadedDocs, setUploadedDocs] = useState<PatientDocument[]>([]);
  const [generatedToken, setGeneratedToken] = useState('OPD-104');

  // Step 1: Language Chosen
  const handleLanguageContinue = () => {
    setStep(2);
  };

  // Step 2: Consent Given
  const handleConsentContinue = () => {
    setStep(3);
  };

  // Step 3: Interview Completed
  const handleInterviewComplete = (data: typeof interviewData) => {
    setInterviewData(data);
    setStep(4);
  };

  // Step 4: Documents Uploaded
  const handleDocumentsContinue = (docs: PatientDocument[]) => {
    setUploadedDocs(docs);
    setStep(5);
  };

  // Step 5: Summary Confirmed -> Generate Case Record & Route to Hospital
  const handleSummaryConfirm = (finalSummary: any) => {
    const caseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `OPD-${Math.floor(100 + Math.random() * 900)}`;
    setGeneratedToken(token);

    const newCaseRecord: CaseRecord = {
      id: caseId,
      patientId,
      patientName,
      patientAge,
      patientGender,
      chiefComplaint: finalSummary.chiefComplaint || interviewData.chiefComplaint,
      createdAt: new Date().toISOString(),
      aiStatus: 'Summary Ready',
      redFlag: interviewData.redFlag,
      redFlagReason: interviewData.redFlagReason,
      urgency: interviewData.redFlag ? 'Urgent' : 'Routine',
      vitals: {
        bp: interviewData.vitals.bp,
        pulse: interviewData.vitals.pulse,
        temp: interviewData.vitals.temp,
        spO2: interviewData.vitals.spO2,
        respiratoryRate: 18
      },
      symptoms: interviewData.symptoms,
      historyOfPresentIllness: finalSummary.hpi,
      pastMedicalHistory: [finalSummary.pastMedicalHistory],
      allergies: [finalSummary.allergies],
      medications: [finalSummary.medications],
      clinicalSummary: `AI Summary prepared for ${patientName} (${patientAge}y/o). Patient presented with ${interviewData.chiefComplaint}. Temperature ${interviewData.vitals.temp}°F. Prior investigations verified. Ready for attending physician validation.`,
      differentialDiagnosis: [
        'Acute Febrile Illness',
        'Viral Syndrome with Cephalalgia',
        'Upper Respiratory Tract Infection'
      ],
      recommendedActions: [
        'Physical exam & vitals verification',
        'Review uploaded CBC report',
        'Evaluate hydration & paracetamol dosage'
      ],
      assignedDoctor: 'Dr. Rajesh Verma',
      department: 'General Medicine',
      documents: uploadedDocs.map((d) => ({
        id: d.id,
        name: d.name,
        type: d.type,
        uploadedAt: 'Just now',
        ocrExtracted: d.ocrProcessed,
        keyFindings: d.keyFindings
      })),
      timeline: [
        { time: 'Just now', event: 'Patient completed MediKiosk intake session', status: 'Completed' },
        { time: 'Just now', event: 'ABDM explicit consent granted', status: 'Completed' },
        { time: 'Just now', event: 'Dual-mode speech and touch symptoms recorded', status: 'Completed' },
        { time: 'Just now', event: 'Medical documents scanned & OCR processed', status: 'Completed' },
        { time: 'Just now', event: 'AI Clinical Summary prepared for physician validation', status: 'Completed' },
        { time: 'Next', event: `Queued for Dr. Rajesh Verma (Token #${token})`, status: 'In Progress' }
      ]
    };

    onCaseCreated(newCaseRecord);
    setStep(6);
  };

  const stepLabels = [
    'Language',
    'Consent',
    'Interview',
    'Documents',
    'AI Summary',
    'Routing'
  ];

  return (
    <div className="space-y-6">
      {/* Step Tracker Indicator */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-100 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < step;
            const isCurrent = stepNum === step;

            return (
              <React.Fragment key={lbl}>
                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-700 text-white ring-4 ring-emerald-100 shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-emerald-900 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {lbl}
                  </span>
                </div>
                {idx < stepLabels.length - 1 && (
                  <div className={`h-0.5 w-6 sm:w-12 shrink-0 ${isDone ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step 1: Language */}
      {step === 1 && (
        <LanguageSelector
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          onContinue={handleLanguageContinue}
          highContrast={highContrast}
        />
      )}

      {/* Step 2: Consent */}
      {step === 2 && (
        <Consent
          language={selectedLanguage}
          patientName={patientName}
          onConsentGiven={handleConsentContinue}
          onBack={() => setStep(1)}
          highContrast={highContrast}
        />
      )}

      {/* Step 3: Dual-mode Clinical Interview */}
      {step === 3 && (
        <ClinicalInterview
          language={selectedLanguage}
          patientName={patientName}
          audioGuidance={audioGuidance}
          onInterviewComplete={handleInterviewComplete}
          onBack={() => setStep(2)}
          highContrast={highContrast}
        />
      )}

      {/* Step 4: Medical Documents & OCR */}
      {step === 4 && (
        <DocumentUpload
          onContinue={handleDocumentsContinue}
          onBack={() => setStep(3)}
          highContrast={highContrast}
        />
      )}

      {/* Step 5: AI Clinical Summary */}
      {step === 5 && (
        <AIClinicalSummary
          patientName={patientName}
          patientAge={patientAge}
          patientGender={patientGender}
          chiefComplaint={interviewData.chiefComplaint}
          location={interviewData.location}
          painLevel={interviewData.painLevel}
          duration={interviewData.duration}
          symptoms={interviewData.symptoms}
          pastConditions={interviewData.pastConditions}
          documents={uploadedDocs}
          vitals={interviewData.vitals}
          redFlag={interviewData.redFlag}
          redFlagReason={interviewData.redFlagReason}
          onConfirm={handleSummaryConfirm}
          onBack={() => setStep(4)}
          highContrast={highContrast}
        />
      )}

      {/* Step 6: Success & Routing to Hospital/Doctor */}
      {step === 6 && (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-emerald-100 shadow-sm max-w-2xl mx-auto text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Case Successfully Routed
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Doctor Received Your Clinical Record
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
              Your voice and touch responses, OCR document findings, and structured summary have been synchronized to the physician's workstation.
            </p>
          </div>

          {/* Token Card */}
          <div className="p-6 rounded-3xl bg-emerald-50/70 border-2 border-emerald-300 text-slate-900 max-w-md mx-auto shadow-sm">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              Your Kiosk OPD Queue Token
            </span>
            <div className="text-4xl font-extrabold text-emerald-900 font-mono my-2 tracking-wider">
              #{generatedToken}
            </div>

            <div className="grid grid-cols-2 gap-3 text-left pt-4 mt-2 border-t border-emerald-200/80 text-xs">
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Assigned Doctor</span>
                <span className="font-bold text-slate-800">Dr. Rajesh Verma</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">OPD Room</span>
                <span className="font-bold text-slate-800">Room 4 • Gen Medicine</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">Est. Wait Time</span>
                <span className="font-bold text-emerald-700">~12 Minutes</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-slate-500 font-bold block">ABDM Consent</span>
                <span className="font-bold text-slate-800">Verified & Active</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={onFinish}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              Return to Patient Dashboard
            </button>

            {onSwitchToDoctorView && (
              <button
                type="button"
                onClick={onSwitchToDoctorView}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2"
              >
                <span>View in Doctor Portal</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

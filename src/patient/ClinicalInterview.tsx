import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Mic,
  Sliders,
  AlertTriangle,
  BellRing,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  PhoneCall,
  UserCheck,
  RotateCcw
} from 'lucide-react';
import VoiceInput from './VoiceInput';
import TouchQuestion, { PAIN_LOCATIONS, COMMON_SYMPTOMS } from './TouchQuestion';
import { IndianLanguage } from './types';
import { speakText } from './AccessibilityBar';

interface ClinicalInterviewProps {
  language: IndianLanguage;
  patientName: string;
  audioGuidance: boolean;
  onInterviewComplete: (data: {
    chiefComplaint: string;
    location: string;
    painLevel: number;
    duration: string;
    symptoms: string[];
    pastConditions: string[];
    vitals: { bp: string; pulse: number; temp: number; spO2: number };
    redFlag: boolean;
    redFlagReason?: string;
  }) => void;
  onBack: () => void;
  highContrast?: boolean;
}

export default function ClinicalInterview({
  language,
  patientName,
  audioGuidance,
  onInterviewComplete,
  onBack,
  highContrast = false
}: ClinicalInterviewProps) {
  // Input Mode: 'voice' | 'touch' | 'both'
  const [inputMode, setInputMode] = useState<'both' | 'voice' | 'touch'>('both');

  // Collected Medical State
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Head');
  const [painLevel, setPainLevel] = useState<number>(6);
  const [selectedDuration, setSelectedDuration] = useState('3 - 5 Days');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'High Fever',
    'Frontal Headache',
    'Body Ache & Fatigue'
  ]);
  const [pastConditions, setPastConditions] = useState<string[]>([]);
  const [vitals] = useState({
    bp: '122/78 mmHg',
    pulse: 84,
    temp: 101.4,
    spO2: 98
  });

  // Red Flag Alert Modal
  const [showRedFlagModal, setShowRedFlagModal] = useState(false);
  const [staffNotified, setStaffNotified] = useState(false);

  // Red flag evaluation
  const checkRedFlag = () => {
    const text = (voiceTranscript + ' ' + selectedSymptoms.join(' ')).toLowerCase();
    const isChestPain =
      selectedLocation === 'Chest' ||
      text.includes('chest pain') ||
      text.includes('tightness in chest') ||
      text.includes('heart attack');
    const isSevereBreathing =
      text.includes('breathlessness') || text.includes('shortness of breath') || vitals.spO2 < 94;
    const isHighFeverWithRash =
      vitals.temp >= 102 && (text.includes('rash') || selectedSymptoms.includes('Skin Rash / Red Spots'));
    const isExtremePain = painLevel >= 9;

    if (isChestPain) {
      return {
        flag: true,
        reason: 'Suspected Acute Coronary Syndrome (Severe chest pain/pressure flagged for immediate ECG)'
      };
    }
    if (isSevereBreathing) {
      return {
        flag: true,
        reason: 'Respiratory Distress Alert: Severe shortness of breath requires immediate clinical evaluation.'
      };
    }
    if (isHighFeverWithRash) {
      return {
        flag: true,
        reason: 'Febrile Exanthem Alert: High temperature with skin rash requires urgent triage.'
      };
    }
    if (isExtremePain) {
      return {
        flag: true,
        reason: 'High Pain Crisis: Pain rated 9+/10 indicates acute distress.'
      };
    }

    return { flag: false };
  };

  const redFlagState = checkRedFlag();

  // Trigger modal when a red flag is detected during intake
  useEffect(() => {
    if (redFlagState.flag && !staffNotified) {
      setShowRedFlagModal(true);
      if (audioGuidance) {
        speakText(
          'Priority warning. Your symptoms indicate you may require immediate medical triage. Please notify hospital staff now.',
          language
        );
      }
    }
  }, [selectedLocation, painLevel, selectedSymptoms, voiceTranscript]);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const toggleCondition = (cond: string) => {
    setPastConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleFinish = () => {
    const finalComplaint =
      voiceTranscript.trim() ||
      `${selectedLocation} discomfort with ${selectedSymptoms.join(', ') || 'generalized symptoms'} for ${selectedDuration}`;

    onInterviewComplete({
      chiefComplaint: finalComplaint,
      location: selectedLocation,
      painLevel,
      duration: selectedDuration,
      symptoms: selectedSymptoms,
      pastConditions,
      vitals,
      redFlag: redFlagState.flag,
      redFlagReason: redFlagState.reason
    });
  };

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border max-w-4xl mx-auto transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Red Flag Emergency Modal */}
      {showRedFlagModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-2 border-red-500 shadow-2xl max-w-md w-full p-6 text-slate-900 animate-in fade-in zoom-in duration-200">
            <div className="p-3.5 bg-red-100 text-red-600 rounded-2xl w-fit mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white mb-2">
              <BellRing className="h-3.5 w-3.5" /> Priority Triage Alert
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Immediate Medical Attention Recommended
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {redFlagState.reason || 'Your reported symptoms indicate an emergency threshold. Please do not wait in standard queue.'}
            </p>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 mb-6">
              <span className="text-xs font-bold text-red-900 block mb-1">
                Kiosk Action Protocol:
              </span>
              <p className="text-xs text-red-800">
                Hospital OPD triage nurse has been flagged. Emergency Bay 1 alerted.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setStaffNotified(true);
                  setShowRedFlagModal(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call / Notify Hospital Staff Now</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRedFlagModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                I am already in acute care / Continue Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Step 3 of 5 — Voice + Touch Clinical Interview</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Tell Us About Your Symptoms
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Speak into the microphone or select options directly on the screen.
          </p>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setInputMode('both')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'both' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Voice + Touch
          </button>
          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'voice' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Voice Only 🎙️
          </button>
          <button
            type="button"
            onClick={() => setInputMode('touch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === 'touch' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
            }`}
          >
            Touch Only 👆
          </button>
        </div>
      </div>

      {/* Red Flag Warning Ribbon (if detected) */}
      {redFlagState.flag && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-400 text-red-900 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <span className="font-bold block uppercase tracking-wider text-red-700">
              ⚠️ Priority Clinical Flag Active
            </span>
            <span className="text-red-900">{redFlagState.reason}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowRedFlagModal(true)}
            className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shrink-0 cursor-pointer hover:bg-red-700"
          >
            Emergency Alert
          </button>
        </div>
      )}

      {/* Dual Mode Panels */}
      <div className="grid grid-cols-1 gap-8 mb-8">
        {(inputMode === 'both' || inputMode === 'voice') && (
          <div className="p-6 rounded-2xl bg-emerald-50/40 border border-emerald-200/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                <Mic className="h-4 w-4 text-emerald-700" />
                <span>Voice Speech Input (Multi-lingual & Multi-accent)</span>
              </h3>
              <button
                type="button"
                onClick={() =>
                  speakText(
                    'Where are you experiencing pain or discomfort? Please speak after tapping the microphone.',
                    language
                  )
                }
                className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-1 font-semibold"
              >
                <Volume2 className="h-3.5 w-3.5" /> Read Prompt Aloud
              </button>
            </div>

            <VoiceInput
              language={language}
              onTranscriptChange={setVoiceTranscript}
              placeholder="E.g., I have severe throbbing headache and fever for 3 days with body ache..."
            />
          </div>
        )}

        {(inputMode === 'both' || inputMode === 'touch') && (
          <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-emerald-700" />
                <span>Touch-based Guided Assessment</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Adaptive Anatomic Questionnaire</span>
            </div>

            <TouchQuestion
              selectedLocation={selectedLocation}
              onLocationChange={setSelectedLocation}
              painLevel={painLevel}
              onPainLevelChange={setPainLevel}
              selectedDuration={selectedDuration}
              onDurationChange={setSelectedDuration}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={toggleSymptom}
              pastConditions={pastConditions}
              onToggleCondition={toggleCondition}
            />
          </div>
        )}
      </div>

      {/* Patient Input Summary Preview Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 mb-8 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">
              Primary Focus: {selectedLocation} ({painLevel}/10 Severity)
            </span>
            <span className="text-slate-500">
              Duration: {selectedDuration} • {selectedSymptoms.length} symptoms checked
            </span>
          </div>
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Vitals: BP {vitals.bp} | Pulse {vitals.pulse} bpm | Temp {vitals.temp}°F | SpO2 {vitals.spO2}%
        </div>
      </div>

      {/* Footer Navigation */}
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
          onClick={handleFinish}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-700/25 transition-all cursor-pointer hover:translate-y-[-1px]"
        >
          <span>Continue to Document Upload</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { Activity, Thermometer, ShieldAlert, Check } from 'lucide-react';

interface TouchQuestionProps {
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  painLevel: number;
  onPainLevelChange: (lvl: number) => void;
  selectedDuration: string;
  onDurationChange: (dur: string) => void;
  selectedSymptoms: string[];
  onToggleSymptom: (symptom: string) => void;
  pastConditions: string[];
  onToggleCondition: (cond: string) => void;
}

export const PAIN_LOCATIONS = [
  { id: 'Head', label: 'Head / Brain', icon: '🧠' },
  { id: 'Chest', label: 'Chest / Ribs', icon: '🫀' },
  { id: 'Abdomen', label: 'Abdomen / Stomach', icon: '🩺' },
  { id: 'Back', label: 'Back / Spine', icon: '🧍' },
  { id: 'Throat', label: 'Throat / Neck', icon: '🗣️' },
  { id: 'Limbs', label: 'Arms / Legs / Joints', icon: '🦵' }
];

export const DURATIONS = [
  'Just Started (<6 hrs)',
  '1 - 2 Days',
  '3 - 5 Days',
  '1 - 2 Weeks',
  'More than 1 Month'
];

export const COMMON_SYMPTOMS = [
  'High Fever',
  'Frontal Headache',
  'Chest Tightness / Pain',
  'Shortness of Breath',
  'Cough with Phlegm',
  'Nausea / Vomiting',
  'Chills & Shivering',
  'Body Ache & Fatigue',
  'Dizziness / Vertigo',
  'Skin Rash / Red Spots'
];

export const COMMON_CONDITIONS = [
  'Hypertension (High BP)',
  'Type 2 Diabetes',
  'Asthma / COPD',
  'Heart Disease',
  'Thyroid Disorder',
  'No Chronic Illness'
];

export default function TouchQuestion({
  selectedLocation,
  onLocationChange,
  painLevel,
  onPainLevelChange,
  selectedDuration,
  onDurationChange,
  selectedSymptoms,
  onToggleSymptom,
  pastConditions,
  onToggleCondition
}: TouchQuestionProps) {
  const getPainColor = (lvl: number) => {
    if (lvl <= 3) return 'text-emerald-600 bg-emerald-50 border-emerald-300';
    if (lvl <= 6) return 'text-amber-600 bg-amber-50 border-amber-300';
    if (lvl <= 8) return 'text-orange-600 bg-orange-50 border-orange-300';
    return 'text-red-600 bg-red-50 border-red-400';
  };

  const getPainLabel = (lvl: number) => {
    if (lvl === 0) return 'No Pain (0/10)';
    if (lvl <= 3) return `Mild Discomfort (${lvl}/10)`;
    if (lvl <= 6) return `Moderate Pain (${lvl}/10)`;
    if (lvl <= 8) return `Severe Pain (${lvl}/10)`;
    return `Critical / Unbearable Pain (${lvl}/10)`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Anatomic Pain Location */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          1. Where are you experiencing the primary discomfort?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PAIN_LOCATIONS.map((loc) => {
            const isSelected = selectedLocation === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => onLocationChange(loc.id)}
                className={`p-3.5 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-xs ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{loc.icon}</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                  {loc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Pain Intensity Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Pain Severity Scale (1 - 10)
          </label>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${getPainColor(painLevel)}`}>
            {getPainLabel(painLevel)}
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          value={painLevel}
          onChange={(e) => onPainLevelChange(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
        />

        <div className="flex justify-between text-[11px] text-slate-600 mt-1.5 font-medium">
          <span>0 — None</span>
          <span>3 — Mild</span>
          <span>6 — Moderate</span>
          <span>8 — Severe</span>
          <span className="text-red-700 font-bold">10 — Emergency</span>
        </div>
      </div>

      {/* 3. Duration */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          3. How long have you had these symptoms?
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((dur) => {
            const isSelected = selectedDuration === dur;
            return (
              <button
                key={dur}
                type="button"
                onClick={() => onDurationChange(dur)}
                className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {dur}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Symptom Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          4. Select any symptoms that apply:
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_SYMPTOMS.map((sym) => {
            const isSelected = selectedSymptoms.includes(sym);
            return (
              <button
                key={sym}
                type="button"
                onClick={() => onToggleSymptom(sym)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-emerald-700" />}
                <span>{sym}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Past Medical History */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          5. Past medical conditions:
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_CONDITIONS.map((cond) => {
            const isSelected = pastConditions.includes(cond);
            return (
              <button
                key={cond}
                type="button"
                onClick={() => onToggleCondition(cond)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                <span>{cond}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

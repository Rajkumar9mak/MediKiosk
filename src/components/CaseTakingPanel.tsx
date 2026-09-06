import React, { useState } from 'react';
import {
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Thermometer,
  Activity,
  ArrowRight,
  Sparkles,
  User,
  Clock,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { CaseRecord, CaseAIStatus } from '../case';

interface CaseTakingPanelProps {
  onCaseCreated: (newCase: CaseRecord) => void;
  onCancel?: () => void;
}

export default function CaseTakingPanel({ onCaseCreated, onCancel }: CaseTakingPanelProps) {
  // Step in conversational flow
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [duration, setDuration] = useState('Today');
  
  // Vitals
  const [bp, setBp] = useState('120/80');
  const [pulse, setPulse] = useState(76);
  const [temp, setTemp] = useState(98.6);
  const [spO2, setSpO2] = useState(98);

  // Symptoms Selection (Touch-based friendly)
  const commonSymptoms = [
    'Chest Pain / Tightness',
    'Shortness of Breath',
    'High Fever',
    'Severe Headache',
    'Cough with Phlegm',
    'Abdominal Pain',
    'Dizziness / Vertigo',
    'Nausea / Vomiting',
    'Joint / Muscle Ache',
    'Skin Rash / Petechiae'
  ];
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Medical History
  const [pastConditions, setPastConditions] = useState<string[]>([]);
  const commonPastConditions = ['Hypertension', 'Diabetes', 'Asthma / COPD', 'Heart Disease', 'Thyroid Disorder'];
  const [allergies, setAllergies] = useState('');

  // Toggle symptom
  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  // Toggle condition
  const toggleCondition = (cond: string) => {
    setPastConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  // Red Flag detection logic
  const isSuspectedRedFlag = () => {
    const complaintLower = chiefComplaint.toLowerCase();
    const hasChestPain = selectedSymptoms.some((s) => s.includes('Chest Pain')) || complaintLower.includes('chest pain') || complaintLower.includes('angina');
    const hasLowSpO2 = spO2 < 94;
    const hasHighFeverWithRash = (temp >= 102 && selectedSymptoms.some((s) => s.includes('Rash')));
    const hasExtremeBP = bp.startsWith('18') || bp.startsWith('19') || bp.startsWith('20') || bp.startsWith('80') || bp.startsWith('70');

    return hasChestPain || hasLowSpO2 || hasHighFeverWithRash || hasExtremeBP;
  };

  const getRedFlagReason = () => {
    if (selectedSymptoms.some((s) => s.includes('Chest Pain'))) {
      return 'Potential Acute Coronary Syndrome: Acute chest discomfort flagged for immediate cardiology ECG.';
    }
    if (spO2 < 94) {
      return `Hypoxia Warning: SpO2 reading is critically low (${spO2}%). Supplemental oxygen evaluation needed.`;
    }
    if (temp >= 102 && selectedSymptoms.some((s) => s.includes('Rash'))) {
      return 'Febrile Exanthem / Thrombocytopenia Alert: High grade fever with rash pattern.';
    }
    return 'Abnormal physiological vital signs outside ambulatory safety thresholds.';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !chiefComplaint) {
      alert('Please provide patient name and chief complaint.');
      return;
    }

    const redFlag = isSuspectedRedFlag();
    const newCaseId = `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const patientId = `PT${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: CaseRecord = {
      id: newCaseId,
      patientId,
      patientName,
      patientAge: Number(patientAge) || 45,
      patientGender,
      chiefComplaint: `${chiefComplaint} (Onset: ${duration})`,
      createdAt: new Date().toISOString(),
      aiStatus: 'Summary Ready',
      redFlag,
      redFlagReason: redFlag ? getRedFlagReason() : undefined,
      urgency: redFlag ? 'Emergency' : selectedSymptoms.length > 2 ? 'Urgent' : 'Routine',
      vitals: {
        bp,
        pulse: Number(pulse),
        temp: Number(temp),
        spO2: Number(spO2)
      },
      symptoms: selectedSymptoms,
      pastMedicalHistory: pastConditions,
      allergies: allergies ? [allergies] : ['No known drug allergies'],
      clinicalSummary: `Patient ${patientName}, ${patientAge}y ${patientGender}, presents with chief complaint of "${chiefComplaint}". Vitals: BP ${bp}, Pulse ${pulse} bpm, SpO2 ${spO2}%, Temp ${temp}°F. Identified symptoms: ${selectedSymptoms.join(', ') || 'None specified'}. MediKiosk intake processed.`,
      differentialDiagnosis: redFlag ? ['Acute Coronary Syndrome', 'Pulmonary Embolism', 'Emergency Observation'] : ['Primary Ambulatory Care', 'Outpatient Follow-up'],
      recommendedActions: redFlag ? ['Immediate Bedside ECG', 'Stat Troponin & CBC', 'Physician Priority Consult'] : ['Physician Consultation', 'Routine Lab Work']
    };

    onCaseCreated(newRecord);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Conversational Case Taking Kiosk</h1>
                <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                  Touch Mode
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Structured clinical history collection & automated AI red-flag detection
              </p>
            </div>
          </div>

          {/* Stepper indicators */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() => setCurrentStep(step)}
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentStep === step
                    ? 'bg-teal-600 text-white shadow-xs'
                    : currentStep > step
                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Patient Identity & Chief Complaint */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 1: Patient Demographics & Presenting Complaint</h2>
              <p className="text-xs text-slate-500">Record who is visiting and their primary reason for seeking medical care</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Age *</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 52"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Gender Selection (Touch Buttons) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Male', 'Female', 'Other'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setPatientGender(g)}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      patientGender === g
                        ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chief Complaint (in patient's own words) *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe symptoms, location, radiation, aggravating factors (e.g. Severe headache with vomiting since morning)..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Onset & Duration</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {['< 2 hours', 'Today (2-12 hrs)', '2 to 3 days', '> 1 week'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer ${
                      duration === d
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!patientName || !chiefComplaint) {
                    alert('Please enter patient name and complaint');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Continue to Symptoms & Vitals</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Touch-based Symptoms & Vitals */}
        {currentStep === 2 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 2: Symptoms Check & Vital Signs</h2>
              <p className="text-xs text-slate-500">Tap applicable symptoms and record triage vitals</p>
            </div>

            {/* Quick Symptom Chips */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Select Experienced Symptoms</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {commonSymptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  const isDangerous = sym.includes('Chest Pain') || sym.includes('Shortness');
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? isDangerous
                            ? 'bg-rose-50 text-rose-800 border-rose-300 shadow-xs'
                            : 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{sym}</span>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vital Signs Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Triage Physiological Vitals</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Blood Pressure</span>
                  <input
                    type="text"
                    value={bp}
                    onChange={(e) => setBp(e.target.value)}
                    className="w-full mt-1 font-bold text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                    placeholder="120/80"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">mmHg</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Heart Rate</span>
                  <input
                    type="number"
                    value={pulse}
                    onChange={(e) => setPulse(Number(e.target.value))}
                    className="w-full mt-1 font-bold text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">bpm</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Temperature</span>
                  <input
                    type="number"
                    step="0.1"
                    value={temp}
                    onChange={(e) => setTemp(Number(e.target.value))}
                    className="w-full mt-1 font-bold text-sm bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">°F</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Oxygen Sat (SpO2)</span>
                  <input
                    type="number"
                    value={spO2}
                    onChange={(e) => setSpO2(Number(e.target.value))}
                    className={`w-full mt-1 font-bold text-sm bg-white border rounded-lg px-2.5 py-1 ${
                      spO2 < 95 ? 'text-rose-600 border-rose-300' : 'text-slate-900 border-slate-200'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">%</span>
                </div>
              </div>
            </div>

            {/* Live Red Flag Warning Indicator */}
            {isSuspectedRedFlag() && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Live Medical Red-Flag Warning Detected
                  </h4>
                  <p className="text-xs mt-0.5">
                    {getRedFlagReason()} This case will automatically be flagged as high emergency upon intake completion.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>Medical History & Finalize</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Medical History & Final Intake Submission */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Step 3: Past History & Allergies</h2>
              <p className="text-xs text-slate-500">Known comorbidities and drug contraindications</p>
            </div>

            {/* Comorbidities */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Pre-existing Medical Conditions</label>
              <div className="flex flex-wrap gap-2">
                {commonPastConditions.map((cond) => {
                  const isSelected = pastConditions.includes(cond);
                  return (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondition(cond)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-50 text-teal-800 border-teal-300 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cond}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Known Allergies */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Known Allergies</label>
              <input
                type="text"
                placeholder="e.g. Penicillin, Sulfa drugs, Aspirin (Leave blank if none)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Intake Review Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Patient: {patientName || 'Anonymous'} ({patientAge}y, {patientGender})</span>
                <span className={isSuspectedRedFlag() ? 'text-rose-600' : 'text-teal-700'}>
                  {isSuspectedRedFlag() ? '⚠ Critical Priority' : 'Standard Routine'}
                </span>
              </div>
              <p className="text-slate-600">
                <strong>Complaint:</strong> {chiefComplaint} ({duration})
              </p>
              <p className="text-slate-600">
                <strong>Vitals:</strong> BP {bp} • Pulse {pulse} bpm • SpO2 {spO2}% • Temp {temp}°F
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ← Back
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Complete Intake & Synthesize AI Case</span>
              </button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}

/**
 * MediKiosk Clinical Case Types & Models
 * Supports structured patient history collection, AI clinical summaries,
 * and red-flag triage for the SIH Clinical History Platform.
 */

export type CaseAIStatus =
  | 'Awaiting Interview'
  | 'Interview Done'
  | 'Documents Uploaded'
  | 'Summary Ready'
  | 'Reviewed';

export interface VitalSigns {
  bp: string; // e.g. "120/80 mmHg"
  pulse: number; // bpm
  temp: number; // °F
  spO2: number; // %
  respiratoryRate?: number; // breaths/min
}

export interface ClinicalDocument {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology';
  uploadedAt: string;
  ocrExtracted: boolean;
  keyFindings?: string[];
}

export interface CaseRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  chiefComplaint: string;
  createdAt: string;
  aiStatus: CaseAIStatus;
  redFlag: boolean;
  redFlagReason?: string;
  urgency: 'Routine' | 'Urgent' | 'Emergency';
  vitals?: VitalSigns;
  symptoms: string[];
  historyOfPresentIllness?: string;
  pastMedicalHistory?: string[];
  allergies?: string[];
  medications?: string[];
  clinicalSummary?: string;
  differentialDiagnosis?: string[];
  recommendedActions?: string[];
  assignedDoctor?: string;
  department?: string;
  documents?: ClinicalDocument[];
  timeline?: { time: string; event: string; status?: string }[];
}

/**
 * Initial fallback cases matching the hospital database patient patterns
 */
export const INITIAL_CASES: CaseRecord[] = [
  {
    id: 'CASE-2026-0891',
    patientId: 'PT000104',
    patientName: 'Aarav Sharma',
    patientAge: 58,
    patientGender: 'Male',
    chiefComplaint: 'Acute retrosternal chest pain radiating to left jaw, diaphoresis for 45 mins',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    aiStatus: 'Summary Ready',
    redFlag: true,
    redFlagReason: 'Suspected Acute Coronary Syndrome (STEMI risk) — severe angina with diaphoresis & SpO2 93%',
    urgency: 'Emergency',
    vitals: { bp: '168/102', pulse: 108, temp: 98.4, spO2: 93, respiratoryRate: 24 },
    symptoms: ['Chest Pain (Pressure)', 'Left Arm/Jaw Radiation', 'Cold Sweating', 'Shortness of Breath'],
    historyOfPresentIllness: 'Sudden onset crushing chest pain while resting. No relief with sublingual nitrates taken at home. History of hypertension.',
    pastMedicalHistory: ['Hypertension (10 yrs)', 'Type 2 Diabetes', 'Hyperlipidemia'],
    allergies: ['Penicillin'],
    medications: ['Amlodipine 5mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
    clinicalSummary: '58M presents with classic signs of acute myocardial ischemia. High risk ECG criteria. Immediate cardiology consult and troponin test initiated.',
    differentialDiagnosis: ['Acute Myocardial Infarction', 'Aortic Dissection', 'Unstable Angina'],
    recommendedActions: ['Stat 12-lead ECG', 'Serum Troponin I & CK-MB', 'Dual Antiplatelet Therapy (DAPT) evaluation', 'Bedside Echocardiogram'],
    assignedDoctor: 'Dr. Sarah Wilson',
    department: 'Cardiology',
    documents: [
      { id: 'DOC-101', name: 'Prior_Echo_Report_2025.pdf', type: 'Lab Report', uploadedAt: '10 mins ago', ocrExtracted: true, keyFindings: ['LVEF 55%', 'Mild concentric LVH'] },
      { id: 'DOC-102', name: 'Prescription_Cardio_Sept.jpg', type: 'Prescription', uploadedAt: '8 mins ago', ocrExtracted: true, keyFindings: ['Amlodipine 5mg QD', 'Metformin 500mg BID'] }
    ],
    timeline: [
      { time: '17:30', event: 'Patient checked in at MediKiosk front-desk kiosk', status: 'Completed' },
      { time: '17:34', event: 'Touch-based conversational history taking completed', status: 'Completed' },
      { time: '17:38', event: 'Prior prescriptions scanned via OCR module', status: 'Completed' },
      { time: '17:41', event: 'AI Clinical Engine detected RED FLAG: ACS Warning', status: 'Alert' },
      { time: '17:42', event: 'Assigned to Cardiology Acute Triage Bay 1', status: 'In Progress' }
    ]
  },
  {
    id: 'CASE-2026-0892',
    patientId: 'PT000215',
    patientName: 'Priya Patel',
    patientAge: 34,
    patientGender: 'Female',
    chiefComplaint: 'Persistent high fever (103°F), severe body ache and retro-orbital pain for 4 days',
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    aiStatus: 'Summary Ready',
    redFlag: true,
    redFlagReason: 'Possible Dengue Hemorrhagic / Thrombocytopenia — Petechial rash noted with high fever',
    urgency: 'Urgent',
    vitals: { bp: '104/68', pulse: 96, temp: 103.1, spO2: 97, respiratoryRate: 20 },
    symptoms: ['High Grade Fever', 'Retro-orbital Headache', 'Severe Myalgia / Arthralgia', 'Mild Epistaxis'],
    historyOfPresentIllness: 'Fever began 4 days ago with chills. Developed small reddish spots on forearms this morning.',
    pastMedicalHistory: ['None reported'],
    allergies: ['No known drug allergies (NKDA)'],
    medications: ['Paracetamol 650mg SOS'],
    clinicalSummary: '34F presenting with acute febrile illness with vector-borne fever indicators. Thrombocytopenia risk warranting immediate CBC and NS1 antigen testing.',
    differentialDiagnosis: ['Dengue Fever', 'Malaria', 'Viral Exanthem', 'Leptospirosis'],
    recommendedActions: ['Complete Blood Count (Platelet focus)', 'Dengue NS1 Antigen & IgM/IgG', 'Peripheral Blood Smear for MP', 'Hydration protocol'],
    assignedDoctor: 'Dr. Rajesh Verma',
    department: 'General Medicine',
    documents: [
      { id: 'DOC-201', name: 'CBC_Lab_Report_Today.pdf', type: 'Lab Report', uploadedAt: '25 mins ago', ocrExtracted: true, keyFindings: ['Platelet count 85,000/uL', 'Hematocrit 44%'] }
    ],
    timeline: [
      { time: '17:00', event: 'Patient completed kiosk symptom assessment', status: 'Completed' },
      { time: '17:15', event: 'Lab document uploaded and processed by OCR', status: 'Completed' },
      { time: '17:22', event: 'AI summary synthesized with thrombocytopenia alert', status: 'Alert' }
    ]
  },
  {
    id: 'CASE-2026-0893',
    patientId: 'PT000342',
    patientName: 'Vikramaditya Rao',
    patientAge: 62,
    patientGender: 'Male',
    chiefComplaint: 'Follow-up for poorly controlled Type 2 Diabetes and tingling sensation in lower limbs',
    createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    aiStatus: 'Reviewed',
    redFlag: false,
    urgency: 'Routine',
    vitals: { bp: '132/84', pulse: 74, temp: 98.6, spO2: 98, respiratoryRate: 16 },
    symptoms: ['Bilateral Foot Numbness', 'Polyuria', 'Nocturia', 'Mild Fatigue'],
    historyOfPresentIllness: 'Gradual increase in glove-and-stocking paresthesia over 3 months. Fasting blood sugars consistently > 190 mg/dL.',
    pastMedicalHistory: ['T2DM (12 yrs)', 'Dyslipidemia'],
    allergies: ['Sulfa drugs'],
    medications: ['Metformin 1000mg BID', 'Glimepiride 2mg QD'],
    clinicalSummary: '62M with diabetic peripheral neuropathy secondary to sub-optimally managed diabetes. Physician verified glycemic adjustment needed.',
    differentialDiagnosis: ['Diabetic Peripheral Neuropathy', 'Vitamin B12 Deficiency', 'Lumbar Radiculopathy'],
    recommendedActions: ['HbA1c test', 'Serum Vitamin B12', 'Monofilament test', 'Consider adding Pregabalin / Methylcobalamin'],
    assignedDoctor: 'Dr. Sarah Wilson',
    department: 'Endocrinology',
    documents: [
      { id: 'DOC-301', name: 'Past_HbA1c_Records.pdf', type: 'Lab Report', uploadedAt: '1 hr ago', ocrExtracted: true, keyFindings: ['HbA1c 9.2%', 'Serum Creatinine 1.0 mg/dL'] }
    ],
    timeline: [
      { time: '16:05', event: 'Kiosk intake completed', status: 'Completed' },
      { time: '16:20', event: 'AI Summary generated and flagged for endocrinology review', status: 'Completed' },
      { time: '16:45', event: 'Reviewed and verified by Dr. Sarah Wilson', status: 'Reviewed' }
    ]
  },
  {
    id: 'CASE-2026-0894',
    patientId: 'PT000451',
    patientName: 'Meera Nambiar',
    patientAge: 27,
    patientGender: 'Female',
    chiefComplaint: 'Recurrent severe migraine with aura, visual scotoma, and nausea',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    aiStatus: 'Documents Uploaded',
    redFlag: false,
    urgency: 'Routine',
    vitals: { bp: '118/76', pulse: 78, temp: 98.2, spO2: 99, respiratoryRate: 14 },
    symptoms: ['Unilateral Throbbing Headache', 'Photophobia', 'Phonophobia', 'Nausea'],
    historyOfPresentIllness: 'Episodes occurring 2-3 times per week, lasting 6-8 hours. Triggered by screen time and irregular sleep.',
    pastMedicalHistory: ['Migraine without aura previously diagnosed in 2022'],
    allergies: ['None'],
    medications: ['Naproxen 500mg', 'Ondansetron 4mg'],
    clinicalSummary: '27F with chronic episodic migraine with visual aura. Pending AI synthesis of newly uploaded MRI report.',
    differentialDiagnosis: ['Migraine with Aura', 'Tension Headache', 'Secondary headache r/o'],
    recommendedActions: ['Review brain MRI', 'Prophylactic therapy discussion (Beta-blockers/Topiramate)', 'Headache diary review'],
    assignedDoctor: 'Dr. Ananya Sen',
    department: 'Neurology',
    documents: [
      { id: 'DOC-401', name: 'Brain_MRI_Report_Aug.pdf', type: 'Radiology', uploadedAt: '15 mins ago', ocrExtracted: true, keyFindings: ['Normal brain parenchyma', 'No acute infarct or intracranial hemorrhage'] }
    ],
    timeline: [
      { time: '15:10', event: 'Kiosk registration & symptom survey', status: 'Completed' },
      { time: '15:35', event: 'Brain MRI report uploaded and OCR processed', status: 'Completed' }
    ]
  },
  {
    id: 'CASE-2026-0895',
    patientId: 'PT000523',
    patientName: 'Devendra Joshi',
    patientAge: 46,
    patientGender: 'Male',
    chiefComplaint: 'Productive cough with yellowish sputum, mild dyspnea, and low-grade evening fever for 10 days',
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
    aiStatus: 'Interview Done',
    redFlag: false,
    urgency: 'Routine',
    vitals: { bp: '124/82', pulse: 84, temp: 99.8, spO2: 96, respiratoryRate: 18 },
    symptoms: ['Productive Cough', 'Low Grade Fever', 'Mild Exertional Dyspnea', 'Loss of Appetite'],
    historyOfPresentIllness: 'Smoker (15 pack-years). Cough aggravated over last week. No hemoptysis.',
    pastMedicalHistory: ['Mild COPD', 'Chronic Bronchitis'],
    allergies: ['Ciprofloxacin'],
    medications: ['Salbutamol Inhaler PRN'],
    clinicalSummary: '46M with subacute lower respiratory symptoms. Kiosk history completed; waiting for chest X-ray document upload.',
    differentialDiagnosis: ['Acute Exacerbation of Chronic Bronchitis', 'Community Acquired Pneumonia', 'Pulmonary Tuberculosis'],
    recommendedActions: ['Chest Radiograph (PA View)', 'Sputum for AFB / CBNAAT', 'Complete Hemogram'],
    assignedDoctor: 'Dr. Rajesh Verma',
    department: 'Pulmonology',
    documents: [],
    timeline: [
      { time: '14:00', event: 'Patient arrived at kiosk and initiated guided case taking', status: 'Completed' },
      { time: '14:25', event: 'Conversational clinical questions answered', status: 'Completed' }
    ]
  },
  {
    id: 'CASE-2026-0896',
    patientId: 'PT000639',
    patientName: 'Sunita Roy',
    patientAge: 71,
    patientGender: 'Female',
    chiefComplaint: 'Acute confusion, dysuria, and reduced oral intake over last 48 hours',
    createdAt: new Date(Date.now() - 310 * 60 * 1000).toISOString(),
    aiStatus: 'Summary Ready',
    redFlag: true,
    redFlagReason: 'Elderly patient with acute altered mental status + fever (101.8°F) — High risk Urosepsis',
    urgency: 'Urgent',
    vitals: { bp: '98/62', pulse: 112, temp: 101.8, spO2: 94, respiratoryRate: 22 },
    symptoms: ['Altered Mental Status / Delirium', 'Dysuria / Foul-smelling Urine', 'Fever with Chills', 'Lethargy'],
    historyOfPresentIllness: 'Brought by family due to increasing disorientation and refusal of food. No previous dementia.',
    pastMedicalHistory: ['Osteoarthritis', 'Hypertension'],
    allergies: ['None known'],
    medications: ['Telmisartan 40mg', 'Paracetamol'],
    clinicalSummary: '71F presenting with delirium secondary to suspected urinary tract infection / systemic inflammatory response. Prompt antibiotic therapy indicated.',
    differentialDiagnosis: ['Urosepsis', 'Acute Encephalopathy', 'Electrolyte Imbalance (Hyponatremia)'],
    recommendedActions: ['Urinalysis and Urine Culture', 'Blood Cultures x 2', 'Serum Electrolytes and Creatinine', 'Empirical IV Ceftriaxone'],
    assignedDoctor: 'Dr. Sarah Wilson',
    department: 'Geriatric / Emergency',
    documents: [
      { id: 'DOC-601', name: 'Urinalysis_Rapid_Dipstick.jpg', type: 'Lab Report', uploadedAt: '45 mins ago', ocrExtracted: true, keyFindings: ['Leukocyte Esterase +++', 'Nitrites Positive', 'WBC 30-40/HPF'] }
    ],
    timeline: [
      { time: '12:45', event: 'Arrived via ambulance intake', status: 'Completed' },
      { time: '13:00', event: 'MediKiosk triage assessment flagged critical sepsis criteria', status: 'Alert' }
    ]
  }
];

/**
 * Case helper utilities
 */
export function getStoredCases(): CaseRecord[] {
  try {
    const saved = localStorage.getItem('medikiosk_cases');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored cases, falling back to initial data', e);
  }
  return INITIAL_CASES;
}

export function saveStoredCases(cases: CaseRecord[]): void {
  try {
    localStorage.setItem('medikiosk_cases', JSON.stringify(cases));
  } catch (e) {
    console.error('Failed to save cases to localStorage', e);
  }
}

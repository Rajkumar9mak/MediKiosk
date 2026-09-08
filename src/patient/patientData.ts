import { PatientProfile, PatientActiveCase, ConsultationRecord, PatientDocument, PatientTimelineEvent } from './types';

export const DEMO_PATIENT_RAHUL: PatientProfile = {
  id: 'PT-2026-9812',
  abhaId: '91-4521-8892-1204',
  name: 'Rahul Verma',
  age: 32,
  gender: 'Male',
  mobile: '+91 98765 43210',
  bloodGroup: 'B+',
  address: 'H-42, Lajpat Nagar III, New Delhi 110024',
  emergencyContact: {
    name: 'Priya Verma',
    relation: 'Spouse',
    phone: '+91 98765 43211'
  },
  abhaStatus: 'Linked & Verified',
  insuranceNumber: 'PMJAY-DL-9823101',
  pmJayCard: 'Ayushman Golden Card (Active)'
};

export const DEMO_PRESET_PATIENTS: { profile: PatientProfile; description: string; caseSnippet: string }[] = [
  {
    profile: DEMO_PATIENT_RAHUL,
    description: 'Rahul Verma (32M) — Active Case: Fever & Headache (SIH Default Demo)',
    caseSnippet: 'Fever for 3 days with frontal throbbing headache and fatigue.'
  },
  {
    profile: {
      id: 'PT000104',
      abhaId: '82-9014-3321-7789',
      name: 'Aarav Sharma',
      age: 58,
      gender: 'Male',
      mobile: '+91 98112 34567',
      bloodGroup: 'O+',
      address: 'B-12, Green Park Extension, New Delhi',
      emergencyContact: {
        name: 'Sunita Sharma',
        relation: 'Spouse',
        phone: '+91 98112 34568'
      },
      abhaStatus: 'Linked & Verified',
      insuranceNumber: 'HSHIELD-CORP-4401'
    },
    description: 'Aarav Sharma (58M) — Priority Emergency Case (Angina / Cardiac Triage)',
    caseSnippet: 'Acute retrosternal chest pain radiating to left arm with cold sweats.'
  },
  {
    profile: {
      id: 'PT000215',
      abhaId: '94-1182-9903-4512',
      name: 'Priya Patel',
      age: 34,
      gender: 'Female',
      mobile: '+91 98250 88231',
      bloodGroup: 'A+',
      address: 'Sector 14, Gandhinagar, Gujarat',
      emergencyContact: {
        name: 'Kirit Patel',
        relation: 'Brother',
        phone: '+91 98250 88232'
      },
      abhaStatus: 'Linked & Verified',
      insuranceNumber: 'AURACARE-IND-7712'
    },
    description: 'Priya Patel (34F) — Febrile Case with Documents (Dengue Suspect)',
    caseSnippet: 'High fever (103°F) for 4 days with retro-orbital ache and low platelets.'
  }
];

export const INITIAL_ACTIVE_CASE: PatientActiveCase = {
  id: 'CASE-2026-RAHUL-01',
  title: 'Fever & Headache',
  startedAt: 'Today, 09:15 AM',
  progressPercentage: 75,
  sections: [
    { id: 'basic', label: 'Basic Information', status: 'completed' },
    { id: 'complaint', label: 'Chief Complaint', status: 'completed' },
    { id: 'history', label: 'Medical History', status: 'completed' },
    { id: 'family', label: 'Family History', status: 'in_progress' },
    { id: 'docs', label: 'Documents', status: 'pending' },
    { id: 'summary', label: 'AI Summary', status: 'pending' }
  ],
  chiefComplaint: 'Fever for 3 days associated with headache and generalized body weakness',
  symptoms: ['Fever (101.4°F)', 'Throbbing Frontal Headache', 'Body Ache', 'Mild Loss of Appetite'],
  duration: '3 Days',
  painLevel: 6,
  bodyLocation: 'Head',
  redFlagDetected: false,
  vitals: {
    bp: '122/78',
    pulse: 84,
    temp: 101.4,
    spO2: 98
  },
  assignedDoctor: 'Dr. Rajesh Verma',
  assignedDepartment: 'General Medicine',
  opdToken: 'OPD-104'
};

export const INITIAL_PATIENT_DOCUMENTS: PatientDocument[] = [
  {
    id: 'DOC-PAT-001',
    name: 'Blood_Test_CBC_Report_Sept.pdf',
    type: 'Lab Report',
    date: '06 Sep 2026',
    fileSize: '1.8 MB',
    ocrProcessed: true,
    hospital: 'Max Super Speciality Hospital',
    doctor: 'Dr. A. K. Mathur',
    keyFindings: [
      'WBC: 11,400 /uL (Mild leukocytosis)',
      'Platelet Count: 195,000 /uL (Normal)',
      'Hemoglobin: 14.2 g/dL',
      'ESR: 24 mm/hr'
    ]
  },
  {
    id: 'DOC-PAT-002',
    name: 'Previous_Prescription_Paracetamol.jpg',
    type: 'Prescription',
    date: '05 Sep 2026',
    fileSize: '840 KB',
    ocrProcessed: true,
    hospital: 'City Health Clinic',
    doctor: 'Dr. Neha Kapoor',
    keyFindings: [
      'Tab. Paracetamol 650mg TDS x 3 days',
      'Tab. Pantoprazole 40mg OD before breakfast',
      'Adequate oral rehydration advised'
    ]
  },
  {
    id: 'DOC-PAT-003',
    name: 'Discharge_Summary_Appendectomy_2024.pdf',
    type: 'Discharge Summary',
    date: '14 Nov 2024',
    fileSize: '3.4 MB',
    ocrProcessed: true,
    hospital: 'Fortis Escorts Hospital',
    doctor: 'Dr. S. K. Rastogi',
    keyFindings: [
      'Diagnosis: Acute Appendicitis',
      'Procedure: Laparoscopic Appendectomy (Uneventful)',
      'No surgical complications noted'
    ]
  },
  {
    id: 'DOC-PAT-004',
    name: 'Chest_XRay_PA_View.jpg',
    type: 'Radiology',
    date: '12 Jan 2025',
    fileSize: '4.1 MB',
    ocrProcessed: true,
    hospital: 'Dr. Lal Imaging Center',
    doctor: 'Dr. R. Bannerjee',
    keyFindings: [
      'Clear bilateral lung fields',
      'Normal cardiothoracic ratio',
      'Both costophrenic angles sharp'
    ]
  },
  {
    id: 'DOC-PAT-005',
    name: 'Lipid_Profile_Annual_Checkup.pdf',
    type: 'Lab Report',
    date: '28 Jan 2026',
    fileSize: '1.2 MB',
    ocrProcessed: true,
    hospital: 'Apex Diagnostics',
    doctor: 'Dr. V. Rao',
    keyFindings: [
      'Total Cholesterol: 188 mg/dL (Desirable)',
      'Triglycerides: 142 mg/dL',
      'HDL: 46 mg/dL',
      'LDL: 114 mg/dL'
    ]
  },
  {
    id: 'DOC-PAT-006',
    name: 'Allergy_Skin_Prick_Test.pdf',
    type: 'Lab Report',
    date: '10 Aug 2025',
    fileSize: '950 KB',
    ocrProcessed: true,
    hospital: 'Allergy & Asthma Institute',
    doctor: 'Dr. Maya Sengupta',
    keyFindings: [
      'Dust Mite Allergy (2+)',
      'No food allergies detected',
      'No penicillin allergy detected'
    ]
  }
];

export const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'CONS-901',
    date: '18 Jun 2026',
    doctorName: 'Dr. Rajesh Verma',
    department: 'General Medicine',
    hospital: 'MediKiosk Hub OPD',
    chiefComplaint: 'Seasonal viral flu and dry cough',
    diagnosis: 'Upper Respiratory Tract Infection (URTI)',
    prescriptions: [
      { medicine: 'Levocetirizine 5mg', dosage: '1 tab at night', duration: '5 days' },
      { medicine: 'Dextromethorphan Syrup', dosage: '10ml TDS', duration: '5 days' }
    ],
    status: 'Completed'
  },
  {
    id: 'CONS-844',
    date: '12 Jan 2026',
    doctorName: 'Dr. Sarah Wilson',
    department: 'Preventive Medicine',
    hospital: 'MediKiosk Hub OPD',
    chiefComplaint: 'Routine annual corporate executive health checkup',
    diagnosis: 'Healthy adult, recommended mild dietary sodium moderation',
    prescriptions: [
      { medicine: 'Vitamin D3 60k IU', dosage: '1 capsule weekly', duration: '8 weeks' }
    ],
    status: 'Completed'
  },
  {
    id: 'CONS-792',
    date: '04 Oct 2025',
    doctorName: 'Dr. Ananya Sen',
    department: 'Dermatology',
    hospital: 'MediKiosk Hub OPD',
    chiefComplaint: 'Eczematous rash on left forearm',
    diagnosis: 'Contact dermatitis',
    prescriptions: [
      { medicine: 'Mometasone Ointment 0.1%', dosage: 'Apply twice daily', duration: '7 days' }
    ],
    status: 'Completed'
  }
];

export const INITIAL_TIMELINE_EVENTS: PatientTimelineEvent[] = [
  {
    id: 'EVT-1',
    date: '08 Sep 2026',
    time: '09:15 AM',
    title: 'Case Started',
    description: 'Patient Rahul Verma checked into MediKiosk digital terminal.',
    status: 'completed'
  },
  {
    id: 'EVT-2',
    date: '08 Sep 2026',
    time: '09:22 AM',
    title: 'Medical Interview Completed',
    description: 'Dual-mode speech & touch intake for Fever & Headache recorded.',
    status: 'completed'
  },
  {
    id: 'EVT-3',
    date: '08 Sep 2026',
    time: '09:30 AM',
    title: '3 Documents Uploaded',
    description: 'CBC lab report and previous prescriptions ingested and OCR-verified.',
    status: 'completed'
  },
  {
    id: 'EVT-4',
    date: '08 Sep 2026',
    time: '09:35 AM',
    title: 'AI Summary Generated',
    description: 'Clinical structured history synthesized. Ready for patient review.',
    status: 'completed'
  },
  {
    id: 'EVT-5',
    date: 'Today',
    time: 'Pending',
    title: 'Doctor Review',
    description: 'Assigned to OPD Room 4 — Dr. Rajesh Verma (General Medicine).',
    status: 'pending',
    badge: 'Token #OPD-104'
  }
];

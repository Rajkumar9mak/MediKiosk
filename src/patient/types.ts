/**
 * MediKiosk Patient Portal Type Definitions
 * Designed for SIH Smart Patient Intake, ABDM compliance, and accessibility.
 */

export type IndianLanguage = 'en' | 'hi' | 'gu' | 'mr' | 'ta' | 'bn';

export interface AccessibilitySettings {
  audioGuidance: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  language: IndianLanguage;
}

export interface PatientProfile {
  id: string;
  abhaId: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  bloodGroup: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  abhaStatus: 'Linked & Verified' | 'Pending Verification';
  insuranceNumber?: string;
  pmJayCard?: string;
}

export interface PatientCaseSection {
  id: string;
  label: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface PatientActiveCase {
  id: string;
  title: string;
  startedAt: string;
  progressPercentage: number;
  sections: PatientCaseSection[];
  chiefComplaint: string;
  symptoms: string[];
  duration: string;
  painLevel: number; // 1-10
  bodyLocation?: string;
  redFlagDetected: boolean;
  redFlagWarning?: string;
  vitals?: {
    bp: string;
    pulse: number;
    temp: number;
    spO2: number;
  };
  assignedDoctor?: string;
  assignedDepartment?: string;
  opdToken?: string;
}

export interface ConsultationRecord {
  id: string;
  date: string;
  doctorName: string;
  department: string;
  hospital: string;
  chiefComplaint: string;
  diagnosis: string;
  prescriptions: { medicine: string; dosage: string; duration: string }[];
  followUpDate?: string;
  status: 'Completed' | 'Scheduled';
}

export interface PatientDocument {
  id: string;
  name: string;
  type: 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology';
  date: string;
  fileSize: string;
  ocrProcessed: boolean;
  hospital?: string;
  doctor?: string;
  keyFindings: string[];
}

export interface PatientTimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'alert' | 'pending';
  badge?: string;
}

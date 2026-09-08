import React, { useState, useEffect } from 'react';
import { User, Patient, Appointment } from './types';
import { CaseRecord, getStoredCases, saveStoredCases } from './case';

// Doctor / Staff Portal Components
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import PatientsPanel from './components/PatientsPanel';
import CaseTakingPanel from './components/CaseTakingPanel';
import DocumentsPanel from './components/DocumentsPanel';
import AISummaryPanel from './components/AISummaryPanel';
import AlertsPanel from './components/AlertsPanel';
import AnalyticsPanel from './components/AnalyticsPanel';
import SettingsPanel from './components/SettingsPanel';

// Patient Portal Components
import PatientLogin from './patient/PatientLogin';
import PatientLayout from './patient/PatientLayout';
import PatientDashboard from './patient/PatientDashboard';
import NewCase from './patient/NewCase';
import MedicalDocuments from './patient/MedicalDocuments';
import AIClinicalSummary from './patient/AIClinicalSummary';
import MyConsultations from './patient/MyConsultations';
import Alerts from './patient/Alerts';
import PatientProfileComponent from './patient/PatientProfile';
import {
  PatientProfile as PatientProfileType,
  AccessibilitySettings,
  PatientActiveCase,
  PatientDocument
} from './patient/types';
import {
  DEMO_PATIENT_RAHUL,
  INITIAL_ACTIVE_CASE,
  INITIAL_PATIENT_DOCUMENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_TIMELINE_EVENTS
} from './patient/patientData';

export default function App() {
  // Portal Mode: 'patient' (SIH primary patient-facing platform) or 'doctor' (hospital clinical review)
  const [portalMode, setPortalMode] = useState<'patient' | 'doctor'>(() => {
    return (localStorage.getItem('medikiosk_portal_mode') as 'patient' | 'doctor') || 'patient';
  });

  // Doctor session state
  const [token, setToken] = useState<string | null>(localStorage.getItem('sim_token'));
  const [user, setUser] = useState<User | null>(null);
  const [doctorActiveTab, setDoctorActiveTab] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Patient session state
  const [patientAuth, setPatientAuth] = useState<boolean>(() => {
    return localStorage.getItem('medikiosk_patient_auth') === 'true' || true; // true by default for instantaneous demo
  });
  const [patientProfile, setPatientProfile] = useState<PatientProfileType>(() => {
    try {
      const saved = localStorage.getItem('medikiosk_patient_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEMO_PATIENT_RAHUL;
  });
  const [patientTab, setPatientTab] = useState<string>('dashboard');
  const [activeCase, setActiveCase] = useState<PatientActiveCase>(INITIAL_ACTIVE_CASE);
  const [patientDocs, setPatientDocs] = useState<PatientDocument[]>(INITIAL_PATIENT_DOCUMENTS);
  const [patientTimeline, setPatientTimeline] = useState(INITIAL_TIMELINE_EVENTS);

  // Patient Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    audioGuidance: false,
    textSize: 'normal',
    highContrast: false,
    language: 'en'
  });

  // Shared Clinical Cases state (persisted in localStorage & synchronized across both portals)
  const [cases, setCases] = useState<CaseRecord[]>(() => getStoredCases());

  // Doctor Ingestion API Data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Switch Portal Handler
  const handleSwitchPortal = (mode: 'patient' | 'doctor') => {
    setPortalMode(mode);
    localStorage.setItem('medikiosk_portal_mode', mode);
  };

  // Patient Login & Logout
  const handlePatientLogin = (profile: PatientProfileType) => {
    setPatientProfile(profile);
    setPatientAuth(true);
    localStorage.setItem('medikiosk_patient_profile', JSON.stringify(profile));
    localStorage.setItem('medikiosk_patient_auth', 'true');
    setPatientTab('dashboard');
  };

  const handlePatientLogout = () => {
    setPatientAuth(false);
    localStorage.removeItem('medikiosk_patient_auth');
  };

  // Doctor Authenticate
  const handleDoctorLogin = async (username: string, pass: string) => {
    setAuthLoading(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('sim_token', data.token);
        setToken(data.token);
        setUser(data.user);
      } else {
        setLoginError(data.error || 'Authentication credential failure');
      }
    } catch (err) {
      setLoginError('Failed to contact hospital ingress server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDoctorLogout = () => {
    localStorage.removeItem('sim_token');
    setToken(null);
    setUser(null);
    setDoctorActiveTab('dashboard');
  };

  // Fetch current user details if token exists
  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        handleDoctorLogout();
      }
    } catch (err) {
      console.error('Session verify failed:', err);
    }
  };

  // Fetch quick metrics counters
  const fetchSummaryStats = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/analytics/summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data) setSummary(data);
      }
    } catch (err) {
      console.error('Core analytics fetch failed:', err);
    }
  };

  // Fetch patients pool
  const fetchPatients = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/patients?page=1&limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setPatients(data.data);
        }
      }
    } catch (err) {
      console.error('Patients fetch failed:', err);
    }
  };

  // Fetch appointments pool
  const fetchAppointments = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/appointments?page=1&limit=20', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.data) {
          setAppointments(data.data);
        }
      }
    } catch (err) {
      console.error('Appointments fetch failed:', err);
    }
  };

  // Case synchronization: updates both Doctor pool and Patient Active Case
  const handleCaseCreated = (newCase: CaseRecord) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    saveStoredCases(updated);
    setSelectedCaseId(newCase.id);

    // Update patient dashboard active case
    setActiveCase({
      id: newCase.id,
      title: newCase.chiefComplaint.slice(0, 32) + (newCase.chiefComplaint.length > 32 ? '...' : ''),
      startedAt: 'Just now',
      progressPercentage: 100,
      sections: [
        { id: 'basic', label: 'Basic Information', status: 'completed' },
        { id: 'complaint', label: 'Chief Complaint', status: 'completed' },
        { id: 'history', label: 'Medical History', status: 'completed' },
        { id: 'family', label: 'Family History', status: 'completed' },
        { id: 'docs', label: 'Documents', status: 'completed' },
        { id: 'summary', label: 'AI Summary', status: 'completed' }
      ],
      chiefComplaint: newCase.chiefComplaint,
      symptoms: newCase.symptoms,
      duration: 'Recent',
      painLevel: 6,
      redFlagDetected: newCase.redFlag,
      redFlagWarning: newCase.redFlagReason,
      vitals: newCase.vitals,
      assignedDoctor: newCase.assignedDoctor || 'Dr. Rajesh Verma',
      assignedDepartment: newCase.department || 'General Medicine',
      opdToken: 'OPD-104'
    });

    // Update patient timeline
    setPatientTimeline([
      {
        id: `EVT-${Date.now()}`,
        date: 'Today',
        time: 'Just now',
        title: 'New Clinical Intake Completed',
        description: `Case ${newCase.id} sent to ${newCase.assignedDoctor || 'Physician'} for review.`,
        status: 'completed',
        badge: 'Token #OPD-104'
      },
      ...patientTimeline
    ]);
  };

  const handleVerifyCase = (caseId: string) => {
    const updated = cases.map((c) =>
      c.id === caseId ? { ...c, aiStatus: 'Reviewed' as const } : c
    );
    setCases(updated);
    saveStoredCases(updated);
  };

  const handleViewDoctorCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setDoctorActiveTab('aisummary');
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchSummaryStats();
      fetchPatients();
      fetchAppointments();
    }
  }, [token]);

  // Periodic polling for doctor metrics
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchSummaryStats();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // =========================================================================
  // PORTAL 1: PATIENT DASHBOARD EXPERIENCE (SIH FOCUS)
  // =========================================================================
  if (portalMode === 'patient') {
    if (!patientAuth) {
      return (
        <PatientLogin
          onPatientLogin={handlePatientLogin}
          onSwitchToDoctorLogin={() => handleSwitchPortal('doctor')}
        />
      );
    }

    return (
      <PatientLayout
        activeTab={patientTab}
        onTabChange={setPatientTab}
        patient={patientProfile}
        accessibilitySettings={accessibility}
        onUpdateAccessibility={(newSettings) =>
          setAccessibility((prev) => ({ ...prev, ...newSettings }))
        }
        onLogout={handlePatientLogout}
        onSwitchToDoctorPortal={() => handleSwitchPortal('doctor')}
        onStartNewCase={() => setPatientTab('newcase')}
        alertsCount={activeCase.redFlagDetected ? 2 : 1}
      >
        {/* 1. Main Patient Dashboard */}
        {patientTab === 'dashboard' && (
          <PatientDashboard
            patient={patientProfile}
            activeCase={activeCase}
            documentsCount={patientDocs.length}
            consultationsCount={3}
            timelineEvents={patientTimeline}
            onStartNewCase={() => setPatientTab('newcase')}
            onContinueCase={() => setPatientTab('newcase')}
            onNavigateTab={(tab) => setPatientTab(tab)}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 2. My Health History */}
        {patientTab === 'history' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-emerald-100 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Clinical Case History & Health Records
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Structured clinical timeline for patient {patientProfile.name} (ABHA: {patientProfile.abhaId})
              </p>
            </div>
            <PatientDashboard
              patient={patientProfile}
              activeCase={activeCase}
              documentsCount={patientDocs.length}
              consultationsCount={3}
              timelineEvents={patientTimeline}
              onStartNewCase={() => setPatientTab('newcase')}
              onContinueCase={() => setPatientTab('newcase')}
              onNavigateTab={(tab) => setPatientTab(tab)}
              highContrast={accessibility.highContrast}
            />
          </div>
        )}

        {/* 3. Interactive 6-Step New Case Taking Wizard */}
        {patientTab === 'newcase' && (
          <NewCase
            patientName={patientProfile.name}
            patientAge={patientProfile.age}
            patientGender={patientProfile.gender}
            patientId={patientProfile.id}
            onCaseCreated={handleCaseCreated}
            onFinish={() => setPatientTab('dashboard')}
            onSwitchToDoctorView={() => {
              handleSwitchPortal('doctor');
              setDoctorActiveTab('aisummary');
            }}
            audioGuidance={accessibility.audioGuidance}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 4. Medical Documents Repository with OCR */}
        {patientTab === 'documents' && (
          <MedicalDocuments
            documents={patientDocs}
            onUploadNew={() => setPatientTab('newcase')}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 5. AI Clinical Summary */}
        {patientTab === 'aisummary' && (
          <AIClinicalSummary
            patientName={patientProfile.name}
            patientAge={patientProfile.age}
            patientGender={patientProfile.gender}
            chiefComplaint={activeCase.chiefComplaint}
            location={activeCase.bodyLocation || 'Head'}
            painLevel={activeCase.painLevel}
            duration={activeCase.duration}
            symptoms={activeCase.symptoms}
            vitals={activeCase.vitals}
            redFlag={activeCase.redFlagDetected}
            redFlagReason={activeCase.redFlagWarning}
            documents={patientDocs}
            isStandaloneTab
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 6. My Consultations & Prescriptions */}
        {patientTab === 'consultations' && (
          <MyConsultations
            onBookOrStartCase={() => setPatientTab('newcase')}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 7. Alerts & Red-Flag Triage Notices */}
        {patientTab === 'alerts' && (
          <Alerts
            redFlag={activeCase.redFlagDetected}
            redFlagReason={activeCase.redFlagWarning}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 8. Patient Profile & Digital ABHA Card */}
        {patientTab === 'profile' && (
          <PatientProfileComponent
            profile={patientProfile}
            highContrast={accessibility.highContrast}
          />
        )}

        {/* 9. Settings (Accessibility & Audio controls) */}
        {patientTab === 'settings' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-emerald-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
              Patient Accessibility & Language Settings
            </h2>
            <p className="text-xs text-slate-500">
              Configure voice assistant playback, visual contrast, text scaling, and language preferences.
            </p>
            <div className="pt-4">
              <PatientProfileComponent
                profile={patientProfile}
                highContrast={accessibility.highContrast}
              />
            </div>
          </div>
        )}
      </PatientLayout>
    );
  }

  // =========================================================================
  // PORTAL 2: DOCTOR / CLINICAL ANALYTICS PLATFORM (PRESERVED)
  // =========================================================================
  if (!token) {
    return (
      <Login
        onLogin={handleDoctorLogin}
        errorMsg={loginError}
        loading={authLoading}
        onSwitchToPatientLogin={() => handleSwitchPortal('patient')}
      />
    );
  }

  const redFlagCount = cases.filter((c) => c.redFlag).length;
  const pendingAICount = cases.filter(
    (c) =>
      c.aiStatus === 'Interview Done' ||
      c.aiStatus === 'Documents Uploaded' ||
      c.aiStatus === 'Summary Ready'
  ).length;

  return (
    <DashboardLayout
      activeTab={doctorActiveTab}
      onTabChange={setDoctorActiveTab}
      user={user}
      onLogout={handleDoctorLogout}
      redFlagCount={redFlagCount}
      pendingAICount={pendingAICount}
      onStartNewCase={() => setDoctorActiveTab('casetaking')}
      onSwitchToPatientPortal={() => handleSwitchPortal('patient')}
    >
      {/* 1. Dashboard Overview */}
      {doctorActiveTab === 'dashboard' && (
        <DashboardOverview
          patients={patients}
          appointments={appointments}
          cases={cases}
          onViewCase={handleViewDoctorCase}
          onNewCase={() => setDoctorActiveTab('casetaking')}
          summary={summary}
          user={user}
          loading={loading}
        />
      )}

      {/* 2. Patients Panel */}
      {doctorActiveTab === 'patients' && (
        <PatientsPanel
          token={token}
          userRole={user?.role || 'Guest'}
          onRefreshSummary={fetchSummaryStats}
        />
      )}

      {/* 3. Case Taking */}
      {doctorActiveTab === 'casetaking' && (
        <CaseTakingPanel
          onCaseCreated={handleCaseCreated}
          onCancel={() => setDoctorActiveTab('dashboard')}
        />
      )}

      {/* 4. Documents & OCR Extraction */}
      {doctorActiveTab === 'documents' && (
        <DocumentsPanel cases={cases} />
      )}

      {/* 5. AI Clinical Summary */}
      {doctorActiveTab === 'aisummary' && (
        <AISummaryPanel
          cases={cases}
          selectedCaseId={selectedCaseId}
          onVerifyCase={handleVerifyCase}
          onSelectCase={(id) => setSelectedCaseId(id)}
        />
      )}

      {/* 6. Medical Red-Flag Alerts */}
      {doctorActiveTab === 'alerts' && (
        <AlertsPanel
          cases={cases}
          onViewCase={handleViewDoctorCase}
        />
      )}

      {/* 7. Healthcare Analytics Hub */}
      {doctorActiveTab === 'analytics' && (
        <AnalyticsPanel
          token={token}
          userRole={user?.role || 'Guest'}
        />
      )}

      {/* 8. Settings */}
      {doctorActiveTab === 'settings' && (
        <SettingsPanel
          user={user}
          token={token}
        />
      )}
    </DashboardLayout>
  );
}

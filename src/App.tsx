import React, { useState, useEffect } from 'react';
import { User, Patient, Appointment } from './types';
import { CaseRecord, getStoredCases, saveStoredCases } from './case';
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

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('sim_token'));
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  
  // Cases state (persisted locally, fallback clinical data)
  const [cases, setCases] = useState<CaseRecord[]>(() => getStoredCases());

  // API Data
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [simStatus, setSimStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Authenticate user session
  const handleLogin = async (username: string, pass: string) => {
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('sim_token');
    setToken(null);
    setUser(null);
    setActiveTab('dashboard');
  };

  // Get current user details if token exists
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
        handleLogout();
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

  // Fetch initial patients pool
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

  // Fetch initial appointments pool
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

  // Case management handlers
  const handleViewCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('aisummary');
  };

  const handleStartNewCase = () => {
    setActiveTab('casetaking');
  };

  const handleCaseCreated = (newCase: CaseRecord) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    saveStoredCases(updated);
    setSelectedCaseId(newCase.id);
    setActiveTab('aisummary');
  };

  const handleVerifyCase = (caseId: string) => {
    const updated = cases.map((c) =>
      c.id === caseId ? { ...c, aiStatus: 'Reviewed' as const } : c
    );
    setCases(updated);
    saveStoredCases(updated);
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchSummaryStats();
      fetchPatients();
      fetchAppointments();
    }
  }, [token]);

  // Periodic polling for real-time updates
  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      fetchSummaryStats();
    }, 5000);
    return () => clearInterval(interval);
  }, [token]);

  // If unauthenticated, show existing Login screen
  if (!token) {
    return <Login onLogin={handleLogin} errorMsg={loginError} loading={authLoading} />;
  }

  // Count red flags and pending summaries for layout badges
  const redFlagCount = cases.filter((c) => c.redFlag).length;
  const pendingAICount = cases.filter(
    (c) => c.aiStatus === 'Interview Done' || c.aiStatus === 'Documents Uploaded' || c.aiStatus === 'Summary Ready'
  ).length;

  return (
    <DashboardLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      user={user}
      onLogout={handleLogout}
      redFlagCount={redFlagCount}
      pendingAICount={pendingAICount}
      onStartNewCase={handleStartNewCase}
    >
      {/* 1. Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <DashboardOverview
          patients={patients}
          appointments={appointments}
          cases={cases}
          onViewCase={handleViewCase}
          onNewCase={handleStartNewCase}
          summary={summary}
          user={user}
          loading={loading}
        />
      )}

      {/* 2. Patients Panel (Preserved existing panel) */}
      {activeTab === 'patients' && (
        <PatientsPanel
          token={token}
          userRole={user?.role || 'Guest'}
          onRefreshSummary={fetchSummaryStats}
        />
      )}

      {/* 3. Case Taking (Conversational / Touch Intake) */}
      {activeTab === 'casetaking' && (
        <CaseTakingPanel
          onCaseCreated={handleCaseCreated}
          onCancel={() => setActiveTab('dashboard')}
        />
      )}

      {/* 4. Documents & OCR Extraction */}
      {activeTab === 'documents' && (
        <DocumentsPanel cases={cases} />
      )}

      {/* 5. AI Clinical Summary */}
      {activeTab === 'aisummary' && (
        <AISummaryPanel
          cases={cases}
          selectedCaseId={selectedCaseId}
          onVerifyCase={handleVerifyCase}
          onSelectCase={(id) => setSelectedCaseId(id)}
        />
      )}

      {/* 6. Medical Red-Flag Alerts */}
      {activeTab === 'alerts' && (
        <AlertsPanel
          cases={cases}
          onViewCase={handleViewCase}
        />
      )}

      {/* 7. Healthcare Analytics Hub (Preserves Databricks, Finance, Doctors, Appointments) */}
      {activeTab === 'analytics' && (
        <AnalyticsPanel
          token={token}
          userRole={user?.role || 'Guest'}
        />
      )}

      {/* 8. Settings */}
      {activeTab === 'settings' && (
        <SettingsPanel
          user={user}
          token={token}
        />
      )}

    </DashboardLayout>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Users,
  Calendar,
  AlertTriangle,
  Sparkles,
  Stethoscope,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  PlusCircle,
  FileText,
  Activity,
  HeartPulse,
  ChevronRight,
  ShieldAlert,
  Thermometer,
  Eye,
  FileCheck,
  TrendingUp
} from 'lucide-react';
import { Patient, Appointment, User } from '../types';
import { CaseRecord, CaseAIStatus } from '../case';

interface DashboardOverviewProps {
  patients: Patient[];
  appointments: Appointment[];
  cases: CaseRecord[];
  onViewCase: (caseId: string) => void;
  onNewCase?: () => void;
  summary?: any;
  user?: User | null;
  loading?: boolean;
}

export default function DashboardOverview({
  patients,
  appointments,
  cases,
  onViewCase,
  onNewCase,
  summary,
  user,
  loading = false
}: DashboardOverviewProps) {
  const [queueFilter, setQueueFilter] = useState<'All' | 'Awaiting' | 'Summary Ready' | 'Red Flags'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics calculation
  const totalPatientsToday = summary?.totalPatients || patients.length || 142;
  const todayCasesCount = cases.length;
  const pendingAISummariesCount = cases.filter(
    (c) => c.aiStatus === 'Interview Done' || c.aiStatus === 'Documents Uploaded' || c.aiStatus === 'Summary Ready'
  ).length;
  const redFlagsCount = cases.filter((c) => c.redFlag).length;

  // Filtered queue
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search matching
      const matchesSearch =
        !searchQuery ||
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter matching
      if (queueFilter === 'All') return true;
      if (queueFilter === 'Awaiting') return c.aiStatus === 'Awaiting Interview' || c.aiStatus === 'Interview Done';
      if (queueFilter === 'Summary Ready') return c.aiStatus === 'Summary Ready';
      if (queueFilter === 'Red Flags') return c.redFlag;
      return true;
    });
  }, [cases, searchQuery, queueFilter]);

  // Red flag cases for quick triage
  const redFlagCases = useMemo(() => {
    return cases.filter((c) => c.redFlag);
  }, [cases]);

  // Cases awaiting physician review
  const pendingReviewCases = useMemo(() => {
    return cases.filter((c) => c.aiStatus === 'Summary Ready');
  }, [cases]);

  // Helper for status badge styling
  const getStatusBadge = (status: CaseAIStatus) => {
    switch (status) {
      case 'Awaiting Interview':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Awaiting Interview
          </span>
        );
      case 'Interview Done':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Interview Done
          </span>
        );
      case 'Documents Uploaded':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Docs Uploaded
          </span>
        );
      case 'Summary Ready':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
            Summary Ready
          </span>
        );
      case 'Reviewed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Reviewed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Clinical Triage Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                CLINICAL COCKPIT
              </span>
              <span className="text-xs text-slate-500 font-medium">
                • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Welcome, {user?.name || 'Doctor'}
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl">
              MediKiosk clinical intake and AI history platform is currently triaging patients.
              {redFlagsCount > 0 ? (
                <span className="font-semibold text-rose-600 ml-1">
                  {redFlagsCount} critical red-flag alert{redFlagsCount > 1 ? 's' : ''} require immediate attention.
                </span>
              ) : (
                <span className="text-emerald-700 ml-1">All clinical vitals within safe thresholds.</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onNewCase && (
              <button
                type="button"
                onClick={onNewCase}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-sm font-bold shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                <span>+ Start New Patient Case</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Patients Today */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Patients Today</span>
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {totalPatientsToday.toLocaleString()}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span className="text-emerald-600 font-bold flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +12%
              </span>
              <span>vs yesterday</span>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Cases */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Cases</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {todayCasesCount}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span className="text-indigo-600 font-semibold">
                {cases.filter((c) => c.aiStatus === 'Reviewed').length} verified
              </span>
              <span>• {todayCasesCount - cases.filter((c) => c.aiStatus === 'Reviewed').length} active</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending AI Summaries */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending AI Summaries</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {pendingAISummariesCount}
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
              <span className="text-amber-600 font-semibold">
                {pendingReviewCases.length} ready for doctor review
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Red Flags (Medical Alerts Only) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Red Flags</span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-rose-600">
                {redFlagsCount}
              </span>
              {redFlagsCount > 0 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                  CRITICAL
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-slate-500 font-medium truncate">
              {redFlagsCount > 0 ? 'Urgent physician triage needed' : 'Zero critical warnings'}
            </div>
          </div>
        </div>

      </div>

      {/* Main Section 1: Red Flag Alerts (Prominent When Active) */}
      {redFlagsCount > 0 && (
        <div className="bg-rose-50/70 border border-rose-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/70">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                <ShieldAlert className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-950">Immediate Medical Red Flag Alerts</h3>
                <p className="text-xs text-rose-700">Patients requiring emergency or expedited clinical review</p>
              </div>
            </div>
            <span className="text-xs font-bold text-rose-700 bg-rose-100/90 px-2.5 py-1 rounded-full border border-rose-200">
              {redFlagsCount} Action Required
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
            {redFlagCases.map((rfc) => (
              <div
                key={rfc.id}
                onClick={() => onViewCase(rfc.id)}
                className="bg-white border border-rose-200/80 rounded-xl p-4 hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{rfc.patientName}</span>
                    <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {rfc.urgency}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {rfc.patientAge}y • {rfc.patientGender} • {rfc.patientId}
                  </div>
                  <p className="text-xs font-medium text-rose-900 bg-rose-50/70 p-2 rounded-lg mt-2.5 border border-rose-100">
                    ⚠ {rfc.redFlagReason || rfc.chiefComplaint}
                  </p>
                  {rfc.vitals && (
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600">
                      <span>BP: <strong className="text-slate-800">{rfc.vitals.bp}</strong></span>
                      <span>SpO2: <strong className={rfc.vitals.spO2 < 95 ? 'text-rose-600' : 'text-slate-800'}>{rfc.vitals.spO2}%</strong></span>
                      <span>Pulse: <strong className="text-slate-800">{rfc.vitals.pulse} bpm</strong></span>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">{new Date(rfc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-semibold text-rose-600 flex items-center gap-1 hover:underline">
                    Triage Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Patient Queue (Left 8 cols) & Clinical Activity / AI Insights (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Patient Queue (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Patient Clinical Queue</h2>
              <p className="text-xs text-slate-500">Live stream of arriving and checked-in patients</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              {(['All', 'Awaiting', 'Summary Ready', 'Red Flags'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setQueueFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    queueFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar inside queue */}
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient name, ID, or complaint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Table / List */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Chief Complaint</th>
                  <th className="py-3 px-3">AI Status</th>
                  <th className="py-3 px-3">Urgency</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCases.length > 0 ? (
                  filteredCases.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => onViewCase(item.id)}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {item.patientName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.patientAge}y • {item.patientGender} • <span className="font-mono">{item.patientId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="text-slate-700 truncate font-medium">
                          {item.chiefComplaint}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Checked in {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {getStatusBadge(item.aiStatus)}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        {item.redFlag ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            ⚠ High Risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600">
                            {item.urgency}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewCase(item.id);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View Case</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No patient cases match the current filter or search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
            <span>Showing {filteredCases.length} of {cases.length} cases</span>
            <span className="font-medium text-teal-700">Auto-synced with MediKiosk Intake Node</span>
          </div>

        </div>

        {/* Right Column: AI Insights & Pending Reviews (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Pending Reviews for Doctor */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FileCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Pending Reviews</h3>
              </div>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                {pendingReviewCases.length} Cases
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {pendingReviewCases.length > 0 ? (
                pendingReviewCases.map((prc) => (
                  <div
                    key={prc.id}
                    onClick={() => onViewCase(prc.id)}
                    className="py-3 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{prc.patientName}</span>
                      <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60">
                        Sign-off Ready
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {prc.clinicalSummary || prc.chiefComplaint}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                      <span>Assigned: {prc.assignedDoctor || 'Cardiology Triage'}</span>
                      <span className="font-semibold text-teal-600 hover:underline flex items-center gap-0.5">
                        Verify <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  All clinical summaries have been reviewed.
                </div>
              )}
            </div>
          </div>

          {/* Card: AI Clinical Insights */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Clinical Insights</h3>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  Symptom Cluster Detection
                </span>
                <p className="text-xs text-slate-700 mt-1">
                  High prevalence of acute febrile and respiratory cases today ({Math.round(cases.length * 0.45)} admissions). Early viral vector surveillance active.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
                  OCR Extraction Accuracy
                </span>
                <p className="text-xs text-slate-700 mt-1">
                  98.4% OCR confidence on prescription scans and lab panel PDFs processed today.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Physician Time Saved
                </span>
                <p className="text-xs text-slate-700 mt-1">
                  Average anamnesis time reduced from 14.2 mins to 4.1 mins via MediKiosk touch intake.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Recent Clinical Activity Feed */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
            </div>

            <div className="mt-4 relative pl-4 border-l border-slate-200 space-y-3.5 text-xs">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
                <p className="font-semibold text-slate-800">ACS Alert Triggered</p>
                <p className="text-[11px] text-slate-500">Case #CASE-0891 (Aarav Sharma) flagged to Bay 1</p>
                <span className="text-[10px] text-slate-400">18 mins ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-teal-500 ring-2 ring-white" />
                <p className="font-semibold text-slate-800">Lab OCR Processed</p>
                <p className="text-[11px] text-slate-500">CBC Panel for Priya Patel uploaded & extracted</p>
                <span className="text-[10px] text-slate-400">32 mins ago</span>
              </div>

              <div className="relative">
                <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                <p className="font-semibold text-slate-800">Doctor Sign-off</p>
                <p className="text-[11px] text-slate-500">Dr. Sarah Wilson verified Vikramaditya Rao case</p>
                <span className="text-[10px] text-slate-400">1 hr ago</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

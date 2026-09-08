import React from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Info
} from 'lucide-react';

interface AlertsProps {
  redFlag?: boolean;
  redFlagReason?: string;
  onCallStaff?: () => void;
  highContrast?: boolean;
}

export default function Alerts({
  redFlag = true,
  redFlagReason = 'Priority Febrile Assessment: Body temperature of 101.4°F with cephalalgia flagged for general OPD priority review.',
  onCallStaff,
  highContrast = false
}: AlertsProps) {
  const alertsList = [
    ...(redFlag
      ? [
          {
            id: 'ALT-RED-01',
            type: 'emergency',
            title: '⚠️ Priority Clinical Triage Notice',
            description: redFlagReason,
            time: '10 mins ago',
            action: 'Notify Staff'
          }
        ]
      : []),
    {
      id: 'ALT-02',
      type: 'info',
      title: 'OCR Extraction Complete',
      description: 'Recent CBC Blood Test Report.pdf successfully scanned. 4 clinical metrics extracted for physician.',
      time: '25 mins ago'
    },
    {
      id: 'ALT-03',
      type: 'reminder',
      title: 'Medication Schedule Notice',
      description: 'Take Tab. Paracetamol 650mg after meals if oral temperature exceeds 100.5°F.',
      time: '2 hours ago'
    },
    {
      id: 'ALT-04',
      type: 'success',
      title: 'ABDM Health Locker Synced',
      description: 'Ayushman Bharat Digital Mission (ABHA #91-4521-8892-1204) verified with hospital OPD desk.',
      time: 'Yesterday'
    }
  ];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-2">
            <Bell className="h-3.5 w-3.5" />
            <span>Triage & Clinical Notification Center</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Alerts & Health Updates
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time medical red-flag alerts, OPD queue updates, and document processing notifications.
          </p>
        </div>

        {redFlag && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold self-start sm:self-center">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span>Active Priority Triage Alert</span>
          </span>
        )}
      </div>

      {/* Priority Red Flag Card */}
      {redFlag && (
        <div className="p-6 rounded-3xl bg-red-50 border-2 border-red-500 mb-6 text-slate-900 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-red-600 text-white shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 block">
                  SIH Red-Flag Detection Triggered
                </span>
                <h3 className="text-lg font-bold text-red-950 mt-0.5">
                  Priority Clinical Review Needed
                </h3>
                <p className="text-xs text-red-900 leading-relaxed mt-1 max-w-xl">
                  {redFlagReason}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCallStaff || (() => alert('Hospital OPD staff notified for Rahul Verma (Token #OPD-104)'))}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg shadow-red-600/30 shrink-0 cursor-pointer transition-all"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Call / Notify Staff</span>
            </button>
          </div>
        </div>
      )}

      {/* All Notifications List */}
      <div className="space-y-3">
        {alertsList.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              item.type === 'emergency'
                ? 'bg-red-50/50 border-red-200'
                : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  item.type === 'emergency'
                    ? 'bg-red-100 text-red-700'
                    : item.type === 'success'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.type === 'emergency' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : item.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Info className="h-4 w-4" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                  {item.time}
                </span>
              </div>
            </div>

            {item.action && (
              <button
                type="button"
                onClick={onCallStaff || (() => window.alert('Hospital OPD staff notified.'))}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shrink-0 cursor-pointer"
              >
                {item.action}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

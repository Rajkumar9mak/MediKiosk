import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  Award,
  Calendar,
  Database,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import AppointmentsPanel from './AppointmentsPanel';
import DoctorsPanel from './DoctorsPanel';
import FinanceReportPanel from './FinanceReportPanel';
import DatabricksLakePanel from './DatabricksLakePanel';
import { UserRole } from '../types';

interface AnalyticsPanelProps {
  token: string;
  userRole: UserRole | string;
}

export default function AnalyticsPanel({ token, userRole }: AnalyticsPanelProps) {
  const [subTab, setSubTab] = useState<'finance' | 'doctors' | 'appointments' | 'databricks'>('finance');

  const tabs = [
    { id: 'finance', label: 'Financial & Claims', icon: DollarSign },
    { id: 'doctors', label: 'Physician Registry & Utilization', icon: Award },
    { id: 'appointments', label: 'Appointment Schedules', icon: Calendar },
    { id: 'databricks', label: 'Databricks Medallion Lake', icon: Database },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              INTELLIGENCE & LAKE
            </span>
            <span className="text-xs text-slate-500 font-medium">• Clinical Operations Suite</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Healthcare Analytics & Medallion Data Engine
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Consolidated operational metrics, physician utilization, financial revenue streams, and Databricks lakehouse
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl gap-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Active Analytics Component */}
      <div className="min-w-0">
        {subTab === 'finance' && <FinanceReportPanel token={token} />}
        {subTab === 'doctors' && <DoctorsPanel token={token} />}
        {subTab === 'appointments' && <AppointmentsPanel token={token} userRole={userRole} />}
        {subTab === 'databricks' && <DatabricksLakePanel token={token} />}
      </div>

    </div>
  );
}

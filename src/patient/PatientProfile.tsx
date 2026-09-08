import React from 'react';
import {
  User,
  ShieldCheck,
  QrCode,
  CreditCard,
  Phone,
  Heart,
  MapPin,
  CheckCircle2,
  Lock,
  Share2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { PatientProfile as PatientProfileType } from './types';
import { DEMO_PATIENT_RAHUL } from './patientData';

interface PatientProfileProps {
  profile?: PatientProfileType;
  highContrast?: boolean;
}

export default function PatientProfile({
  profile = DEMO_PATIENT_RAHUL,
  highContrast = false
}: PatientProfileProps) {
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
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ayushman Bharat Digital Mission (ABDM) Profile</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Patient Identity & ABHA Health Card
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Your unique health identifier, linked medical insurance, and consent permissions.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-center">
          <CheckCircle2 className="h-4 w-4" />
          <span>ABHA Status: {profile.abhaStatus}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital ABHA Card */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white shadow-xl relative overflow-hidden">
            {/* Background emblem pattern */}
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <ShieldCheck className="h-48 w-48" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 backdrop-blur">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <span className="text-[10px] tracking-wider uppercase opacity-80 block font-bold">
                    National Health Authority
                  </span>
                  <span className="text-sm font-extrabold tracking-tight">
                    ABHA Digital Card
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                ABDM Verified
              </span>
            </div>

            {/* Profile Info in Card */}
            <div className="mb-6 relative z-10">
              <span className="text-[10px] uppercase text-emerald-200 block font-semibold">
                Patient Full Name
              </span>
              <h3 className="text-xl font-black tracking-tight">{profile.name}</h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                {profile.age} Yrs • {profile.gender} • Blood Group: {profile.bloodGroup}
              </p>
            </div>

            {/* ABHA Number */}
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 mb-6 relative z-10">
              <span className="text-[9px] uppercase tracking-wider text-emerald-200 font-bold block">
                ABHA Number
              </span>
              <span className="text-lg font-mono font-black tracking-widest block text-emerald-50">
                {profile.abhaId}
              </span>
              <span className="text-[10px] text-emerald-200/90 font-mono mt-0.5 block">
                Address: {profile.name.toLowerCase().replace(/\s+/g, '.')}@abdm
              </span>
            </div>

            {/* QR Code and Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-white/20 relative z-10 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl text-slate-900 shadow-md">
                  <QrCode className="h-8 w-8" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 block">Scan at Kiosk</span>
                  <span className="text-xs font-bold text-white">Instant OPD Check-in</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-emerald-200 block">Patient ID</span>
                <span className="font-mono font-bold text-xs">{profile.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Records */}
        <div className="lg:col-span-7 space-y-4">
          {/* Personal Demographics */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="h-4 w-4 text-emerald-700" />
              <span>Personal Demographics</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Registered Mobile</span>
                <span className="font-semibold text-slate-900">{profile.mobile}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Blood Group</span>
                <span className="font-semibold text-slate-900">{profile.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Gender</span>
                <span className="font-semibold text-slate-900">{profile.gender}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Residential Address</span>
                <span className="font-medium text-slate-800">{profile.address}</span>
              </div>
            </div>
          </div>

          {/* Healthcare Schemes & Insurance */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CreditCard className="h-4 w-4 text-emerald-700" />
              <span>Health Insurance & PM-JAY Scheme</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">PM-JAY Golden Card</span>
                <span className="font-bold text-emerald-800">{profile.pmJayCard || 'Ayushman Bharat Eligible'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Insurance Policy Ref</span>
                <span className="font-mono font-bold text-slate-800">{profile.insuranceNumber || 'Self-Pay / Cash'}</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-700" />
              <span>Emergency Primary Contact</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact Name</span>
                <span className="font-bold text-slate-900">{profile.emergencyContact.name}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Relationship</span>
                <span className="font-medium text-slate-700">{profile.emergencyContact.relation}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Emergency Phone</span>
                <span className="font-mono font-bold text-emerald-800">{profile.emergencyContact.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

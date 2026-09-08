import React, { useState } from 'react';
import {
  User,
  Phone,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { PatientProfile } from './types';

interface PatientRegisterProps {
  onRegisterSuccess: (newPatient: PatientProfile) => void;
  onClose: () => void;
}

export default function PatientRegister({ onRegisterSuccess, onClose }: PatientRegisterProps) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [abhaConsent, setAbhaConsent] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile) return;

    const randomAbha = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: PatientProfile = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaId: randomAbha,
      name: fullName,
      age: Number(age) || 28,
      gender,
      mobile: mobile.startsWith('+91') ? mobile : `+91 ${mobile}`,
      bloodGroup,
      address: 'New Delhi, India',
      emergencyContact: {
        name: 'Family Member',
        relation: 'Relative',
        phone: mobile
      },
      abhaStatus: 'Linked & Verified',
      insuranceNumber: 'PMJAY-ABHA-SELF'
    };

    onRegisterSuccess(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-slate-900">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <HeartPulse className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">New Patient Registration</h3>
              <p className="text-[11px] text-slate-500">Create ABHA ID & Patient Record</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Number (Aadhaar / ABHA Linked)
            </label>
            <input
              type="tel"
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="e.g. 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? parseInt(e.target.value, 10) : '')}
                placeholder="e.g. 32"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Blood Group
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="B+">B+</option>
              <option value="A+">A+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="B-">B-</option>
              <option value="A-">A-</option>
              <option value="O-">O-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={abhaConsent}
              onChange={(e) => setAbhaConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-emerald-600 rounded"
            />
            <span className="text-[11px] text-slate-600">
              Generate 14-digit ABHA ID under ABDM ecosystem and grant consent for clinical record processing.
            </span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
            >
              Create Account & Enter Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

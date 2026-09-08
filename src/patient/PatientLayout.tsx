import React, { useState } from 'react';
import {
  Home,
  Stethoscope,
  PlusCircle,
  FileText,
  Sparkles,
  Calendar,
  Bell,
  User,
  Settings,
  LogOut,
  HeartPulse,
  Menu,
  X,
  ArrowRightLeft,
  ChevronRight,
  ShieldCheck,
  Contrast
} from 'lucide-react';
import { PatientProfile, AccessibilitySettings } from './types';
import AccessibilityBar from './AccessibilityBar';

interface PatientLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  patient: PatientProfile;
  accessibilitySettings: AccessibilitySettings;
  onUpdateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  onLogout: () => void;
  onSwitchToDoctorPortal?: () => void;
  onStartNewCase: () => void;
  alertsCount?: number;
}

export default function PatientLayout({
  children,
  activeTab,
  onTabChange,
  patient,
  accessibilitySettings,
  onUpdateAccessibility,
  onLogout,
  onSwitchToDoctorPortal,
  onStartNewCase,
  alertsCount = 1
}: PatientLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'history', label: 'My Health History', icon: Stethoscope },
    { id: 'newcase', label: 'Start New Case', icon: PlusCircle, isHighlight: true },
    { id: 'documents', label: 'Medical Documents', icon: FileText },
    { id: 'aisummary', label: 'AI Clinical Summary', icon: Sparkles },
    { id: 'consultations', label: 'My Consultations', icon: Calendar },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertsCount },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: string) => {
    if (id === 'newcase') {
      onStartNewCase();
    } else {
      onTabChange(id);
    }
    setMobileMenuOpen(false);
  };

  // Font size class mapping for the entire patient container
  const getTextSizeClass = () => {
    if (accessibilitySettings.textSize === 'large') return 'text-[17px]';
    if (accessibilitySettings.textSize === 'xlarge') return 'text-[19px]';
    return 'text-sm';
  };

  return (
    <div
      className={`min-h-screen transition-all ${
        accessibilitySettings.highContrast
          ? 'bg-neutral-950 text-amber-200'
          : 'bg-[#F7FAF9] text-slate-900'
      } ${getTextSizeClass()}`}
    >
      {/* Top Banner: Quick Portal Switcher & Accessibility Bar */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-all ${
          accessibilitySettings.highContrast
            ? 'bg-black/90 border-amber-400 text-amber-300'
            : 'bg-white/95 border-emerald-100 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="h-9 w-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                  MediKiosk
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">
                  Patient Health Portal
                </span>
              </div>
            </div>
          </div>

          {/* Center Accessibility Bar */}
          <div className="hidden md:block">
            <AccessibilityBar
              settings={accessibilitySettings}
              onUpdateSettings={onUpdateAccessibility}
              compact
            />
          </div>

          {/* Right Header Controls: Switch to Doctor View + Patient Avatar */}
          <div className="flex items-center gap-3">
            {onSwitchToDoctorPortal && (
              <button
                type="button"
                onClick={onSwitchToDoctorPortal}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors shadow-2xs cursor-pointer"
                title="Switch role to Doctor / Hospital Staff Portal"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
                <span>Doctor Portal</span>
              </button>
            )}

            <div
              onClick={() => onTabChange('profile')}
              className="flex items-center gap-2.5 pl-2 cursor-pointer group"
            >
              <div className="h-8 w-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {patient.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block leading-tight">
                  {patient.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  ABHA Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* Sidebar for Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div
              className={`p-4 rounded-3xl border sticky top-22 transition-all ${
                accessibilitySettings.highContrast
                  ? 'bg-black border-amber-400'
                  : 'bg-white border-emerald-100 shadow-xs'
              }`}
            >
              {/* MediKiosk Patient Brand Badge */}
              <div className="px-3 py-2 mb-3 pb-3 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Navigation
                </span>
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> ABDM Patient Session
                </span>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isHighlight = item.isHighlight;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                        isHighlight
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 hover:scale-[1.01]'
                          : isActive
                          ? 'bg-emerald-50 text-emerald-900 font-extrabold'
                          : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 ${
                            isHighlight
                              ? 'text-white'
                              : isActive
                              ? 'text-emerald-700'
                              : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && item.badge > 0 && (
                        <span className="h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100 space-y-1">
                {onSwitchToDoctorPortal && (
                  <button
                    type="button"
                    onClick={onSwitchToDoctorPortal}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors cursor-pointer"
                  >
                    <ArrowRightLeft className="h-4 w-4 text-emerald-600" />
                    <span>Doctor / Hospital Portal</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/60 backdrop-blur-xs flex">
              <div className="w-72 bg-white h-full p-6 shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="h-6 w-6 text-emerald-700" />
                      <span className="font-bold text-base text-slate-900">MediKiosk</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <AccessibilityBar
                      settings={accessibilitySettings}
                      onUpdateSettings={onUpdateAccessibility}
                      compact
                    />
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const isHighlight = item.isHighlight;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            isHighlight
                              ? 'bg-emerald-700 text-white'
                              : isActive
                              ? 'bg-emerald-50 text-emerald-900 font-extrabold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {onSwitchToDoctorPortal && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onSwitchToDoctorPortal();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Switch to Doctor View</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

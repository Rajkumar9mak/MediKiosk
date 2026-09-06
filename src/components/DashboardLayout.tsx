import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Sparkles,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  PlusCircle,
  Menu,
  X,
  ShieldCheck,
  Activity,
  Heart,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';

interface DashboardLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  redFlagCount?: number;
  pendingAICount?: number;
  onStartNewCase?: () => void;
  children: React.ReactNode;
}

export default function DashboardLayout({
  activeTab,
  onTabChange,
  user,
  onLogout,
  redFlagCount = 0,
  pendingAICount = 0,
  onStartNewCase,
  children
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'casetaking', label: 'Case Taking', icon: Stethoscope, badge: 'Touch' },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'aisummary', label: 'AI Clinical Summary', icon: Sparkles, badge: pendingAICount > 0 ? `${pendingAICount} ready` : undefined, badgeColor: 'bg-teal-50 text-teal-700 border-teal-200' },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: redFlagCount > 0 ? `${redFlagCount} flags` : undefined, badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Branding */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div
                onClick={() => onTabChange('dashboard')}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-102 transition-transform">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-slate-900 tracking-tight">MediKiosk</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                      SIH Edition
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                    AI Clinical History & Patient Platform
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action & System Health */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Clinical Node Active</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 text-[11px]">PostgreSQL RDS</span>
              </div>

              {onStartNewCase && (
                <button
                  type="button"
                  onClick={onStartNewCase}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>+ Start New Patient Case</span>
                </button>
              )}
            </div>

            {/* Right Controls: Notifications & Profile */}
            <div className="flex items-center gap-3">
              
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {redFlagCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Clinical Alerts</h4>
                      <span className="text-[11px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        {redFlagCount} Red Flags
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                      {redFlagCount > 0 ? (
                        <div
                          onClick={() => {
                            onTabChange('alerts');
                            setShowNotifications(false);
                          }}
                          className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5">
                            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">Critical Medical Flags Present</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {redFlagCount} high-urgency patient cases require immediate physician review.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-500">
                          No active emergency red flags. System normal.
                        </div>
                      )}
                      {pendingAICount > 0 && (
                        <div
                          onClick={() => {
                            onTabChange('aisummary');
                            setShowNotifications(false);
                          }}
                          className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-2.5">
                            <Sparkles className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-slate-800">AI Summaries Synthesized</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                {pendingAICount} patient summaries are ready for doctor verification.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 px-4 border-t border-slate-100 text-center">
                      <button
                        onClick={() => {
                          onTabChange('alerts');
                          setShowNotifications(false);
                        }}
                        className="text-[11px] font-semibold text-teal-600 hover:text-teal-700"
                      >
                        View All System Notifications →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Chip */}
              {user && (
                <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-200">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-xl object-cover ring-2 ring-slate-100"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 uppercase">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    title="Sign out of MediKiosk session"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ml-1"
                    aria-label="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body: Responsive Sidebar + Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 min-h-0">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs self-start sticky top-22">
          
          <div className="space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Clinical Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 shadow-xs border border-teal-200/70 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </span>

                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Case Shortcut in Sidebar */}
          {onStartNewCase && (
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={onStartNewCase}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Start New Patient Case</span>
              </button>
            </div>
          )}

          {/* System Badge */}
          <div className="mt-auto pt-6">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Kiosk Protocol v2.4</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Smart India Hackathon Healthcare Triage & Case Taking System
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-900/40 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full shadow-2xl p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                      <Activity className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-base text-slate-900">MediKiosk</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                          isActive
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </span>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {user && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[10px] text-teal-600 font-semibold">{user.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-400 hover:text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Primary Page Canvas */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>

    </div>
  );
}

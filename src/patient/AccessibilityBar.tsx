import React from 'react';
import { Volume2, VolumeX, Contrast, Globe, Sparkles } from 'lucide-react';
import { AccessibilitySettings, IndianLanguage } from './types';

interface AccessibilityBarProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  compact?: boolean;
}

export const INDIAN_LANGUAGES: { code: IndianLanguage; label: string; nativeName: string; flag: string }[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' }
];

/**
 * Text-to-speech helper for kiosk accessibility
 */
export function speakText(text: string, lang: IndianLanguage = 'en') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'ta') utterance.lang = 'ta-IN';
    else if (lang === 'bn') utterance.lang = 'bn-IN';
    else if (lang === 'gu') utterance.lang = 'gu-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis unavailable:', err);
  }
}

export default function AccessibilityBar({ settings, onUpdateSettings, compact = false }: AccessibilityBarProps) {
  const handleToggleAudio = () => {
    const nextState = !settings.audioGuidance;
    onUpdateSettings({ audioGuidance: nextState });
    if (nextState) {
      speakText('Audio guidance enabled. MediKiosk will assist you with voice prompts.', settings.language);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleToggleContrast = () => {
    onUpdateSettings({ highContrast: !settings.highContrast });
  };

  const handleFontChange = (size: 'normal' | 'large' | 'xlarge') => {
    onUpdateSettings({ textSize: size });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as IndianLanguage;
    onUpdateSettings({ language: lang });
    if (settings.audioGuidance) {
      const selected = INDIAN_LANGUAGES.find((l) => l.code === lang);
      speakText(`Language changed to ${selected?.label || lang}`, lang);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/80 rounded-full px-3 py-1 text-xs text-emerald-900 shadow-sm backdrop-blur">
        <button
          type="button"
          onClick={handleToggleAudio}
          title="Toggle Audio Guidance"
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-colors ${
            settings.audioGuidance ? 'bg-emerald-600 text-white font-semibold' : 'hover:bg-emerald-100 text-emerald-800'
          }`}
        >
          {settings.audioGuidance ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          <span className="text-[11px] hidden sm:inline">Voice {settings.audioGuidance ? 'ON' : 'OFF'}</span>
        </button>

        <div className="h-3 w-px bg-emerald-300" />

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => handleFontChange('normal')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
              settings.textSize === 'normal' ? 'bg-emerald-700 text-white' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => handleFontChange('large')}
            className={`px-1.5 py-0.5 rounded text-xs font-bold ${
              settings.textSize === 'large' ? 'bg-emerald-700 text-white' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => handleFontChange('xlarge')}
            className={`px-1.5 py-0.5 rounded text-sm font-bold ${
              settings.textSize === 'xlarge' ? 'bg-emerald-700 text-white' : 'text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            A+
          </button>
        </div>

        <div className="h-3 w-px bg-emerald-300" />

        <button
          type="button"
          onClick={handleToggleContrast}
          title="Toggle High Contrast"
          className={`p-1 rounded-full transition-colors ${
            settings.highContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'hover:bg-emerald-100 text-emerald-800'
          }`}
        >
          <Contrast className="h-3.5 w-3.5" />
        </button>

        <div className="h-3 w-px bg-emerald-300" />

        <div className="flex items-center gap-1">
          <Globe className="h-3.5 w-3.5 text-emerald-700" />
          <select
            value={settings.language}
            onChange={handleLanguageChange}
            className="bg-transparent border-0 text-xs font-medium text-emerald-900 focus:ring-0 cursor-pointer pr-1 py-0"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.label})
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-3 rounded-2xl border transition-all ${
        settings.highContrast
          ? 'bg-black text-amber-300 border-amber-400'
          : 'bg-white border-emerald-100 shadow-sm text-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${settings.highContrast ? 'bg-amber-400 text-black' : 'bg-emerald-100 text-emerald-700'}`}>
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block">
              Patient Accessibility Bar
            </span>
            <span className="text-[11px] opacity-75">
              SIH Smart Multi-accent, TTS & High Contrast Assist
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Audio Mode */}
          <button
            type="button"
            onClick={handleToggleAudio}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              settings.audioGuidance
                ? settings.highContrast
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : settings.highContrast
                ? 'border-amber-400/50 text-amber-300 hover:bg-neutral-900'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {settings.audioGuidance ? <Volume2 className="h-4 w-4 text-emerald-300" /> : <VolumeX className="h-4 w-4 opacity-50" />}
            <span>Audio Guidance: <strong>{settings.audioGuidance ? 'ON' : 'OFF'}</strong></span>
          </button>

          {/* Font Size Scaling */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-slate-50/50">
            <span className="text-[10px] uppercase font-bold text-slate-500 px-1.5">Text Size</span>
            {(['normal', 'large', 'xlarge'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => handleFontChange(sz)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  settings.textSize === sz
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                {sz === 'normal' ? 'A−' : sz === 'large' ? 'A' : 'A+'}
              </button>
            ))}
          </div>

          {/* High Contrast */}
          <button
            type="button"
            onClick={handleToggleContrast}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              settings.highContrast
                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Contrast className="h-4 w-4" />
            <span>High Contrast: {settings.highContrast ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language Picker */}
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1 bg-white">
            <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              {INDIAN_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.nativeName} ({l.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

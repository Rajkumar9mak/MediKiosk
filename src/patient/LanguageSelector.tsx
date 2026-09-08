import React, { useState } from 'react';
import { Check, Globe, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import { IndianLanguage } from './types';
import { INDIAN_LANGUAGES, speakText } from './AccessibilityBar';

interface LanguageSelectorProps {
  selectedLanguage: IndianLanguage;
  onSelectLanguage: (lang: IndianLanguage) => void;
  onContinue: () => void;
  highContrast?: boolean;
}

const LANGUAGE_GREETINGS: Record<IndianLanguage, { greeting: string; phrase: string }> = {
  en: {
    greeting: 'Welcome to MediKiosk',
    phrase: 'Please speak or tap to share your clinical history with our AI assistant.'
  },
  hi: {
    greeting: 'मेडीकियोस्क में आपका स्वागत है',
    phrase: 'कृपया अपने स्वास्थ्य की जानकारी बोलकर या छूकर दर्ज करें।'
  },
  gu: {
    greeting: 'મેડીકિયોસ્ક માં આપનું સ્વાગત છે',
    phrase: 'કૃપા કરીને બોલીને અથવા ટૅપ કરીને તમારા લક્ષણો જણાવો.'
  },
  mr: {
    greeting: 'मेडीकियोस्क मध्ये आपले स्वागत आहे',
    phrase: 'कृपया बोलून किंवा स्पर्श करून तुमची आरोग्य माहिती सांगा.'
  },
  ta: {
    greeting: 'மெடிகியோஸ்க் வரவேற்கிறது',
    phrase: 'தயவுசெய்து உங்கள் மருத்துவ விவரங்களைப் பேசவும் அல்லது தொடவும்.'
  },
  bn: {
    greeting: 'মেডিকিয়স্কে আপনাকে স্বাগতম',
    phrase: 'দয়া করে কথা বলে বা স্পর্শ করে আপনার স্বাস্থ্য সংক্রান্ত তথ্য দিন।'
  }
};

export default function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
  highContrast = false
}: LanguageSelectorProps) {
  const [currentSelection, setCurrentSelection] = useState<IndianLanguage>(selectedLanguage);

  const handleSelect = (code: IndianLanguage) => {
    setCurrentSelection(code);
    onSelectLanguage(code);
    const item = LANGUAGE_GREETINGS[code];
    speakText(item.phrase, code);
  };

  const preview = LANGUAGE_GREETINGS[currentSelection];

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Step Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-3">
          <Globe className="h-3.5 w-3.5" />
          <span>Step 1 of 5 — Indian Language Selection</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Choose Your Preferred Language
        </h2>
        <p className="text-sm text-slate-600">
          MediKiosk supports multi-accent voice input and touch selection in 6 major Indian languages.
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
        {INDIAN_LANGUAGES.map((lang) => {
          const isSelected = currentSelection === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`relative p-5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[110px] ${
                isSelected
                  ? highContrast
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md ring-2 ring-amber-400'
                    : 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                  : highContrast
                  ? 'border-neutral-800 bg-neutral-900 text-slate-300 hover:border-amber-400/50'
                  : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{lang.flag}</span>
                {isSelected && (
                  <span className={`p-1 rounded-full ${highContrast ? 'bg-amber-400 text-black' : 'bg-emerald-600 text-white'}`}>
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
              <div>
                <span className="text-lg font-bold block text-slate-900 leading-tight">
                  {lang.nativeName}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {lang.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Audio Sample Box */}
      <div className="max-w-xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 flex items-start gap-3">
        <button
          type="button"
          onClick={() => speakText(preview.phrase, currentSelection)}
          className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-sm transition-colors cursor-pointer"
          title="Play voice pronunciation"
        >
          <Volume2 className="h-5 w-5" />
        </button>
        <div>
          <span className="text-xs font-semibold text-emerald-800 block mb-0.5 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Voice Preview:
          </span>
          <p className="text-sm font-semibold text-slate-900">
            {preview.greeting}
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            "{preview.phrase}"
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-base font-semibold shadow-lg shadow-emerald-700/25 transition-all cursor-pointer hover:translate-y-[-1px]"
        >
          <span>Continue with {INDIAN_LANGUAGES.find((l) => l.code === currentSelection)?.nativeName}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

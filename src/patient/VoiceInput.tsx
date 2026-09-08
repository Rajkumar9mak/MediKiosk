import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, Volume2, RotateCcw, Play } from 'lucide-react';
import { IndianLanguage } from './types';

interface VoiceInputProps {
  language: IndianLanguage;
  onTranscriptChange: (transcript: string) => void;
  placeholder?: string;
  autoStart?: boolean;
}

export default function VoiceInput({
  language,
  onTranscriptChange,
  placeholder = 'Tap microphone to speak or choose a sample utterance...',
  autoStart = false
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micSupported, setMicSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Sample phrases for quick demonstration during hackathons
  const sampleUtterances: Record<IndianLanguage, string[]> = {
    en: [
      'I have had a high fever and throbbing headache for the last 3 days.',
      'Sharp pain in my lower abdomen along with nausea since yesterday.',
      'Severe tightness in my chest radiating to my left arm and sweating.',
      'Productive cough with yellow phlegm and mild breathlessness.'
    ],
    hi: [
      'मुझे पिछले 3 दिनों से तेज बुखार और सिरदर्द है।',
      'कल से पेट के निचले हिस्से में तेज दर्द और उल्टी जैसा लग रहा है।',
      'सीने में भारीपन और बाएं हाथ में दर्द महसूस हो रहा है।',
      'खांसी के साथ कफ आ रहा है और सांस लेने में हल्की तकलीफ है।'
    ],
    gu: [
      'મને છેલ્લા 3 દિવસથી સખત તાવ અને માથાનો દુખાવો છે.',
      'ગઈકાલથી પેટમાં દુખાવો અને ઉબકા આવે છે.',
      'છાતીમાં ભારેપણું અને શ્વાસ લેવામાં તકલીફ છે.'
    ],
    mr: [
      'मला गेल्या 3 दिवसांपासून तीव्र ताप आणि डोकेदुखी आहे.',
      'कालपासून पोटात खूप दुखत आहे आणि मळमळ होत आहे.',
      'छातीत जडपणा जाणवत असून डाव्या हातात वेदना होत आहेत.'
    ],
    ta: [
      'கடந்த 3 நாட்களாக கடுமையான காய்ச்சலும் தலைவலியும் உள்ளது.',
      'நேற்றிலிருந்து கடுமையான வயிற்று வலி மற்றும் வாந்தி உணர்வு உள்ளது.'
    ],
    bn: [
      'গত ৩ দিন ধরে আমার তীব্র জ্বর এবং মাথায় যন্ত্রণা হচ্ছে।',
      'বুকে চাপ অনুভব করছি এবং শ্বাস নিতে কষ্ট হচ্ছে।'
    ]
  };

  useEffect(() => {
    // Detect Web Speech Recognition API
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMicSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set language locale
      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'gu') recognition.lang = 'gu-IN';
      else if (language === 'mr') recognition.lang = 'mr-IN';
      else if (language === 'ta') recognition.lang = 'ta-IN';
      else if (language === 'bn') recognition.lang = 'bn-IN';
      else recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        onTranscriptChange(currentText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('Speech recognition setup failed:', err);
      setMicSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          // Fallback simulation if browser mic access fails
          console.warn('Mic start failed, running simulation fallback', err);
          simulateAudioCapture();
        }
      } else {
        simulateAudioCapture();
      }
    }
  };

  // Simulation mode for environments without mic permissions
  const simulateAudioCapture = () => {
    const samples = sampleUtterances[language] || sampleUtterances.en;
    const picked = samples[Math.floor(Math.random() * samples.length)];
    let index = 0;
    const interval = setInterval(() => {
      if (index < picked.length) {
        const chunk = picked.slice(0, index + 3);
        setTranscript(chunk);
        onTranscriptChange(chunk);
        index += 3;
      } else {
        clearInterval(interval);
        setIsListening(false);
      }
    }, 45);
  };

  const handleApplySample = (text: string) => {
    setTranscript(text);
    onTranscriptChange(text);
  };

  const handleClear = () => {
    setTranscript('');
    onTranscriptChange('');
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Microphone Visualizer Circle */}
      <div className="relative mb-6">
        {/* Animated pulse rings when listening */}
        {isListening && (
          <>
            <span className="absolute -inset-4 rounded-full bg-emerald-400/20 animate-ping" />
            <span className="absolute -inset-8 rounded-full bg-emerald-400/10 animate-pulse" />
          </>
        )}

        <button
          type="button"
          onClick={toggleListening}
          className={`relative z-10 h-24 w-24 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer shadow-xl ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white scale-105 shadow-red-500/40 ring-4 ring-red-200'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 hover:scale-105'
          }`}
        >
          {isListening ? (
            <MicOff className="h-9 w-9 animate-pulse" />
          ) : (
            <Mic className="h-9 w-9" />
          )}
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
            {isListening ? 'Stop' : 'Tap to speak'}
          </span>
        </button>
      </div>

      {/* Live Audio Visualizer Equalizer */}
      {isListening && (
        <div className="flex items-center gap-1.5 mb-4 h-6">
          {[40, 70, 95, 60, 80, 100, 50, 85, 65, 45, 90, 75].map((height, i) => (
            <span
              key={i}
              style={{
                height: `${height}%`,
                animationDelay: `${i * 0.1}s`
              }}
              className="w-1 bg-emerald-500 rounded-full animate-bounce"
            />
          ))}
          <span className="text-xs font-semibold text-emerald-700 ml-2 animate-pulse">
            Listening in {language.toUpperCase()}...
          </span>
        </div>
      )}

      {/* Transcript Text Box */}
      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 relative shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> Speech Transcript
          </span>
          {transcript && (
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] text-slate-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-medium"
            >
              <RotateCcw className="h-3 w-3" /> Clear
            </button>
          )}
        </div>

        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptChange(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-slate-800 focus:outline-none resize-none placeholder:text-slate-400 font-normal"
        />
      </div>

      {/* Fast Demo Utterances */}
      <div className="w-full">
        <span className="text-[11px] font-semibold text-slate-500 block mb-2">
          💡 Tap a sample voice response to auto-fill:
        </span>
        <div className="flex flex-col gap-1.5">
          {(sampleUtterances[language] || sampleUtterances.en).slice(0, 3).map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplySample(sample)}
              className="text-left text-xs p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 transition-colors cursor-pointer flex items-center justify-between group"
            >
              <span className="truncate pr-2 font-medium">"{sample}"</span>
              <Play className="h-3 w-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  Zap,
  Eye
} from 'lucide-react';
import { PatientDocument } from './types';

interface DocumentUploadProps {
  onContinue: (documents: PatientDocument[]) => void;
  onBack: () => void;
  highContrast?: boolean;
}

const PRESET_SAMPLE_DOCS: PatientDocument[] = [
  {
    id: 'DOC-NEW-01',
    name: 'Recent_CBC_Blood_Test_Report.pdf',
    type: 'Lab Report',
    date: '06 Sep 2026',
    fileSize: '1.4 MB',
    ocrProcessed: true,
    hospital: 'MediKiosk Lab Services',
    doctor: 'Dr. V. K. Gupta',
    keyFindings: [
      'Platelet Count: 185,000 /uL (Normal)',
      'Total Leukocytes: 11,200 /uL (Mild elevation)',
      'Hemoglobin: 14.1 g/dL'
    ]
  },
  {
    id: 'DOC-NEW-02',
    name: 'Prior_Prescription_Paracetamol_Sept.jpg',
    type: 'Prescription',
    date: '04 Sep 2026',
    fileSize: '780 KB',
    ocrProcessed: true,
    hospital: 'Apollo Clinic',
    doctor: 'Dr. R. Bannerjee',
    keyFindings: [
      'Rx: Paracetamol 650mg TDS x 3 days',
      'Rx: Cetirizine 10mg OD',
      'Hydration 3L/day advised'
    ]
  },
  {
    id: 'DOC-NEW-03',
    name: 'Chest_Radiograph_Report.pdf',
    type: 'Radiology',
    date: '10 Aug 2025',
    fileSize: '2.8 MB',
    ocrProcessed: true,
    hospital: 'City Diagnostics Center',
    doctor: 'Dr. S. Nair',
    keyFindings: [
      'Normal lung parenchyma',
      'No pleural effusion or consolidation'
    ]
  }
];

export default function DocumentUpload({
  onContinue,
  onBack,
  highContrast = false
}: DocumentUploadProps) {
  const [selectedDocs, setSelectedDocs] = useState<PatientDocument[]>([
    PRESET_SAMPLE_DOCS[0],
    PRESET_SAMPLE_DOCS[1]
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleTogglePreset = (doc: PatientDocument) => {
    if (selectedDocs.some((d) => d.id === doc.id)) {
      setSelectedDocs(selectedDocs.filter((d) => d.id !== doc.id));
    } else {
      setSelectedDocs([...selectedDocs, doc]);
    }
  };

  const handleSimulateCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsScanning(true);
    setUploadFeedback('OCR Engine scanning document text and medication signatures...');

    setTimeout(() => {
      const newDoc: PatientDocument = {
        id: `DOC-CUST-${Date.now().toString().slice(-4)}`,
        name: file.name,
        type: file.name.toLowerCase().includes('rx') || file.name.toLowerCase().includes('presc') ? 'Prescription' : 'Lab Report',
        date: 'Today',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        ocrProcessed: true,
        hospital: 'Uploaded Clinical Record',
        keyFindings: [
          'Extracted Rx: Paracetamol 650mg TDS',
          'Document date stamped: 08 Sep 2026',
          'No severe contraindication flagged in OCR'
        ]
      };
      setSelectedDocs((prev) => [newDoc, ...prev]);
      setIsScanning(false);
      setUploadFeedback(null);
    }, 1200);
  };

  return (
    <div className={`p-6 sm:p-10 rounded-3xl border max-w-4xl mx-auto transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Step Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-3">
          <FileText className="h-3.5 w-3.5" />
          <span>Step 4 of 5 — Medical Documents & OCR Ingestion</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
          Upload Prior Medical Documents
        </h2>
        <p className="text-sm text-slate-600">
          Scan or upload previous prescriptions, lab reports, or discharge summaries. MediKiosk's OCR engine extracts key clinical data automatically.
        </p>
      </div>

      {/* Upload Drag & Drop Area */}
      <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-3xl p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition-all mb-8 relative">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleSimulateCustomUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-700 mb-3">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Drag & drop or tap to scan documents
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mb-3">
            Supports PDF, JPG, PNG (Prescriptions, CBC/Blood tests, Imaging, Discharge cards)
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-3 py-1.5 rounded-xl">
            <Sparkles className="h-3.5 w-3.5" /> Optical Character Recognition (OCR) Active
          </span>
        </div>
      </div>

      {/* Scanning status indicator */}
      {isScanning && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between mb-6 shadow-md animate-pulse">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <Zap className="h-5 w-5 text-amber-300 animate-spin" />
            <span>{uploadFeedback}</span>
          </div>
          <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-md uppercase font-bold">
            Processing
          </span>
        </div>
      )}

      {/* Fast Preset Samples */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quick-Select Sample Documents for Demo:
          </h4>
          <span className="text-[11px] text-slate-500">Tap to add or remove</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_SAMPLE_DOCS.map((doc) => {
            const isSelected = selectedDocs.some((d) => d.id === doc.id);
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleTogglePreset(doc)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                    {doc.type}
                  </span>
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-300" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {doc.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {doc.date} • {doc.fileSize}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Attached Documents List with OCR findings */}
      <div className="space-y-3 mb-8">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Attached Documents ({selectedDocs.length}):
        </h4>

        {selectedDocs.length === 0 ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
            No documents attached yet. You may proceed without documents or select a sample report above.
          </div>
        ) : (
          selectedDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 mt-0.5">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{doc.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" /> OCR Extracted
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {doc.type} • {doc.date} • {doc.hospital || 'Hospital Record'}
                  </span>

                  {/* Extracted findings pill list */}
                  {doc.keyFindings && doc.keyFindings.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {doc.keyFindings.map((finding, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                        >
                          ✓ {finding}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setSelectedDocs(selectedDocs.filter((d) => d.id !== doc.id))}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={() => onContinue(selectedDocs)}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-lg shadow-emerald-700/25 transition-all cursor-pointer hover:translate-y-[-1px]"
        >
          <span>Generate AI Clinical Summary</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Eye,
  FileCheck,
  Search,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { CaseRecord } from '../case';

interface DocumentsPanelProps {
  cases: CaseRecord[];
}

export default function DocumentsPanel({ cases }: DocumentsPanelProps) {
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 'DOC-101',
      name: 'Prior_Echo_Report_2025.pdf',
      patient: 'Aarav Sharma (PT000104)',
      type: 'Echocardiogram',
      size: '1.4 MB',
      uploadedAt: '25 mins ago',
      ocrConfidence: '99.1%',
      status: 'Extracted',
      extractedText: `ECHOCARDIOGRAPHY REPORT\nPatient: Aarav Sharma | Age: 58 | Sex: M\nFindings: Normal left ventricular size. LVEF estimated at 55%. Mild concentric LVH. No regional wall motion abnormality at rest. E/A ratio 0.8 suggestive of impaired LV relaxation.\nConclusion: Grade I Diastolic Dysfunction.`
    },
    {
      id: 'DOC-102',
      name: 'Prescription_Cardio_Sept.jpg',
      patient: 'Aarav Sharma (PT000104)',
      type: 'Prescription',
      size: '840 KB',
      uploadedAt: '20 mins ago',
      ocrConfidence: '97.8%',
      status: 'Extracted',
      extractedText: `Rx CLINICAL PRESCRIPTION\n1. Tab Amlodipine 5mg OD (Morning)\n2. Tab Metformin 500mg BD (Post meals)\n3. Tab Atorvastatin 20mg HS\nAdvice: Regular BP and sugar monitoring. Low salt, low saturated fat diet.`
    },
    {
      id: 'DOC-201',
      name: 'CBC_Lab_Report_Today.pdf',
      patient: 'Priya Patel (PT000215)',
      type: 'Hematology Lab',
      size: '2.1 MB',
      uploadedAt: '40 mins ago',
      ocrConfidence: '98.6%',
      status: 'Extracted',
      extractedText: `COMPLETE BLOOD HEMOGRAM\nPatient: Priya Patel | Age: 34 | Sex: F\nHb: 13.2 g/dL\nTotal Leucocyte Count (TLC): 3,400 /uL (Leukopenia)\nPlatelet Count: 85,000 /uL [CRITICAL LOW]\nPCV / Hematocrit: 44%\nPeripheral Smear: Normocytic normochromic with reduced platelets. Few reactive lymphocytes.`
    },
    {
      id: 'DOC-301',
      name: 'Past_HbA1c_Records.pdf',
      patient: 'Vikramaditya Rao (PT000342)',
      type: 'Biochemistry Lab',
      size: '950 KB',
      uploadedAt: '1.5 hrs ago',
      ocrConfidence: '99.4%',
      status: 'Extracted',
      extractedText: `DEPARTMENT OF CLINICAL BIOCHEMISTRY\nPatient: Vikramaditya Rao | Age: 62\nGlycated Hemoglobin (HbA1c): 9.2 % (Estimated Average Glucose: 217 mg/dL)\nSerum Fasting Blood Glucose: 194 mg/dL\nSerum Creatinine: 1.0 mg/dL\nUrine Microalbumin: 45 mg/L`
    }
  ]);

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setTimeout(() => {
        const newDoc = {
          id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
          name: file.name,
          patient: 'Newly Admitted Patient',
          type: 'Prescription',
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: 'Just now',
          ocrConfidence: '98.5%',
          status: 'Extracted',
          extractedText: `OCR EXTRACTION FOR ${file.name.toUpperCase()}\nDocument parsed via MediKiosk Tesseract-Medical OCR Engine.\nClinical entities detected: Antibiotic therapy, baseline vitals, lab reference markers.`
        };
        setUploadedFiles([newDoc, ...uploadedFiles]);
        setUploading(false);
      }, 1500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
              OCR & DOCUMENT REPOSITORY
            </span>
            <span className="text-xs text-slate-500 font-medium">• Medical Records Ingress</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Clinical Document Ingestion & Extraction
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Automatic text extraction from scanned physical prescriptions, lab reports & discharge summaries
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors shrink-0">
          <UploadCloud className="h-4 w-4" />
          <span>{uploading ? 'Processing OCR...' : '+ Upload Medical Document'}</span>
          <input type="file" className="hidden" onChange={handleSimulateUpload} disabled={uploading} />
        </label>
      </div>

      {/* Main Split: Documents List & OCR Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Document List (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Processed Records</h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              {uploadedFiles.length} Records
            </span>
          </div>

          <div className="space-y-3">
            {uploadedFiles.map((doc) => {
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/60 border-teal-300 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{doc.name}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.patient}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        OCR {doc.ocrConfidence}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-1">{doc.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Type: <strong className="text-slate-700">{doc.type}</strong></span>
                    <span>Size: {doc.size}</span>
                    <span className="text-teal-600 font-semibold hover:underline">View OCR Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* OCR Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                OCR Extracted Text & Entities
              </h3>
            </div>
          </div>

          {selectedDoc ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Document</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block">{selectedDoc.name}</span>
                <span className="text-[11px] text-slate-600 mt-0.5 block">Associated: {selectedDoc.patient}</span>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Parsed Content:</span>
                <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {selectedDoc.extractedText}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs">
                <strong>MediKiosk Clinical Pipeline:</strong> Extracted data has been embedded into the patient's AI Clinical Summary and cross-referenced with red-flag rules.
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <FileCheck className="h-10 w-10 text-slate-300 mx-auto" />
              <p>Select any uploaded document from the left to inspect extracted clinical data and entities.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

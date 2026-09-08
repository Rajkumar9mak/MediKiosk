import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Eye,
  Sparkles,
  Download,
  Filter,
  Plus,
  ShieldCheck,
  Calendar,
  X
} from 'lucide-react';
import { PatientDocument } from './types';
import { INITIAL_PATIENT_DOCUMENTS } from './patientData';

interface MedicalDocumentsProps {
  documents?: PatientDocument[];
  onUploadNew?: () => void;
  highContrast?: boolean;
}

export default function MedicalDocuments({
  documents: initialDocs = INITIAL_PATIENT_DOCUMENTS,
  onUploadNew,
  highContrast = false
}: MedicalDocumentsProps) {
  const [documents, setDocuments] = useState<PatientDocument[]>(initialDocs);
  const [activeTab, setActiveTab] = useState<'All' | 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Radiology'>('All');
  const [previewDoc, setPreviewDoc] = useState<PatientDocument | null>(null);

  const filteredDocs = activeTab === 'All'
    ? documents
    : documents.filter((d) => d.type === activeTab);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const newDoc: PatientDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: file.name,
      type: file.name.toLowerCase().includes('rx') ? 'Prescription' : 'Lab Report',
      date: '08 Sep 2026',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      ocrProcessed: true,
      hospital: 'MediKiosk Direct Scanner',
      doctor: 'Dr. Clinical Ingestion',
      keyFindings: [
        'Document scanned and parsed with OCR',
        'ABDM metadata extracted and linked'
      ]
    };
    setDocuments([newDoc, ...documents]);
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
      highContrast
        ? 'bg-black text-amber-300 border-amber-400'
        : 'bg-white border-emerald-100 shadow-sm'
    }`}>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-800 mb-2">
            <FileText className="h-3.5 w-3.5" />
            <span>Digital Health Locker • ABDM Integrated</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            My Medical Documents
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Prescriptions, diagnostic lab reports, and hospital summaries with automatic AI OCR data extraction.
          </p>
        </div>

        {/* Upload Button */}
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleSimulateUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ Upload Document</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {(['All', 'Prescription', 'Lab Report', 'Discharge Summary', 'Radiology'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'All' ? `All Records (${documents.length})` : tab}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {doc.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {doc.date} • {doc.fileSize}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3 w-3" /> Processed
                </span>
              </div>

              {/* Hospital & Doctor */}
              <div className="text-xs text-slate-600 mb-3 flex items-center gap-3">
                <span>🏥 {doc.hospital || 'Hospital Record'}</span>
                {doc.doctor && <span>👨‍⚕️ {doc.doctor}</span>}
              </div>

              {/* Key OCR Findings */}
              {doc.keyFindings && doc.keyFindings.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-emerald-600" /> Extracted Clinical Insights
                  </span>
                  {doc.keyFindings.slice(0, 3).map((f, i) => (
                    <p key={i} className="text-xs text-slate-700 font-medium">
                      • {f}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {doc.type}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewDoc(doc)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-semibold cursor-pointer transition-colors flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">{previewDoc.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 mb-6">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Document Type</span>
                  <span className="font-semibold text-slate-900">{previewDoc.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Date of Record</span>
                  <span className="font-semibold text-slate-900">{previewDoc.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Source Facility</span>
                  <span className="font-semibold text-slate-900">{previewDoc.hospital || 'Hospital OPD'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">OCR Status</span>
                  <span className="font-semibold text-emerald-700">✓ Verified & Indexed</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
                  Full Extracted Key Findings:
                </h4>
                <div className="space-y-1.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60">
                  {previewDoc.keyFindings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800 font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

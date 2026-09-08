
# MediKiosk — Exact Project Summary

### 1. One-Line Description

> MediKiosk is an AI-assisted healthcare platform that collects patient clinical history through conversational voice/touch interactions, organizes medical documents, generates a structured clinical summary, and enables physicians to review and verify the information before consultation.


### 2. Proposed Solution

```text
Patient
   ↓
Login / Registration
   ↓
Language Selection + Consent
   ↓
Conversational Clinical Interview
   ↓
Voice / Touch / Text
   ↓
Medical Document Upload
   ↓
OCR + Information Extraction
   ↓
AI Clinical Summary
   ↓
Patient Verification
   ↓
Doctor Review & Editing
   ↓
Verified Clinical History
```

### 3. Main Modules

#### 👤 Patient Module

* Patient registration/login
* Patient dashboard
* Language selection
* Consent
* Clinical history collection
* Voice interaction
* Touch-based questions
* Medical document upload
* AI clinical summary
* Patient verification
* Consultation history
* Alerts
* Accessibility settings

#### 👨‍⚕️ Doctor Module

* Doctor login
* Dashboard
* Patient queue
* Patient history
* AI-generated summary
* Medical documents
* Red-flag alerts
* Edit/verify clinical summary
* Consultation management
* Analytics

### 4. AI Module

```text
Patient Responses
       +
Medical Documents
       ↓
   AI Processing
       ↓
Structured Clinical History
       ↓
Red Flag Identification
       ↓
Doctor Review
```

**Important:** AI assists with collecting, organizing, and summarizing information. It does **not autonomously diagnose the patient**.

### 5. Key Features

| Feature             | Purpose                                     |
| ------------------- | ------------------------------------------- |
| 🎤 Voice Interview  | Easier history collection                   |
| 👆 Touch Questions  | Simple patient interaction                  |
| 🌐 Multilingual UI  | Reduce language barriers                    |
| 📄 Document Upload  | Digitize existing medical records           |
| 🔍 OCR              | Extract information from documents          |
| 🤖 AI Summary       | Convert information into structured history |
| 🚨 Red Flags        | Highlight potentially important information |
| 👨‍⚕️ Doctor Review | Human verification of AI output             |
| ♿ Accessibility     | Support different patient needs             |
| 📅 Timeline         | Organize medical history chronologically    |

### 6. Technology Stack

```text
Frontend
React + TypeScript + Vite + Tailwind CSS

Backend
Node.js + Express

Database
PostgreSQL

AI
AI Clinical Summarization
OCR / Clinical Information Extraction

Infrastructure
Docker + Docker Compose
```

### 7.Core Architecture

```text
                MEDIKIOSK
                    │
        ┌───────────┴───────────┐
        │                       │
     PATIENT                  DOCTOR
        │                       │
        ▼                       ▼
 Patient Dashboard        Doctor Dashboard
        │                       │
        ▼                       │
 Clinical Interview             │
 Voice / Touch / Text           │
        │                       │
        ▼                       │
 Medical Documents              │
        │                       │
        └──────────┬────────────┘
                   ▼
             AI PROCESSING
                   │
          ┌────────┴────────┐
          ▼                 ▼
   Clinical Summary    Red Flags
          │                 │
          └────────┬────────┘
                   ▼
             Doctor Review
                   │
                   ▼
        Verified Clinical History
```

### 8. Expected Impact

MediKiosk aims to:

* **Reduce** time spent collecting patient history
* **Improve** completeness of clinical information
* **Assist** doctors before consultation
* **Improve** accessibility for patients
* **Organize** scattered medical records
* **Highlight** potentially important information
* **Create** a structured digital patient history

### 9. Future Scope

* ABDM/ABHA integration
* More Indian regional languages
* Advanced OCR
* Hospital/clinic integration
* Secure consent management
* Interoperability with healthcare systems
* Sign-language assistance
* Mobile application
* Offline/low-connectivity support


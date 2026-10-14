# Convertify - All-In-One Document Conversion & PDF Toolkit

Platform web modern untuk manajemen dan manipulasi dokumen hybrid:
- **Client-Side (Zero-Knowledge Privacy):** Merge PDF, Split PDF, Image to PDF langsung di browser.
- **Async Backend:** PDF to Word, Compress PDF, Protect/Unlock PDF via FastAPI.
- **AI Document Assistant:** Chat with PDF.

## Struktur Direktori
- `/client`: Frontend Next.js (App Router), React 19, Tailwind CSS v4, Lucide React.
- `/server`: Backend Python FastAPI (PyMuPDF, pdf2docx, pypdf, Gemini AI).

## Cara Menjalankan

### 1. Frontend (Next.js)
```bash
cd client
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Backend (FastAPI)
```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
# Set GROQ_API_KEY in .env
python main.py
```
API berjalan di `http://localhost:8000`.

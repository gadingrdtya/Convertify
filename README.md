<div align="center">

# Convertify
### Modern All-in-One Document Studio & Hybrid PDF Toolkit

Solusi manajemen dan manipulasi dokumen modern dengan arsitektur hybrid (Client-side RAM + High-Speed FastAPI Micro-Worker) dilengkapi AI Document Copilot in-house.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Fitur Unggulan](#-fitur-unggulan) • [Katalog Modul](#-katalog-modul-dokumen) • [Arsitektur](#-arsitektur-teknologi) • [Menjalankan Lokal](#-panduan-instalasi-lokal) • [Deployment](#-panduan-deployment)

</div>

---

## 📌 Sekilas Convertify

**Convertify** dirancang untuk mengatasi masalah umum pada converter PDF konvensional: tata letak berantakan, font hasil konversi acak-acakan, kewajiban mendaftar yang membuang waktu, serta risiko privasi file pengguna. 

Convertify hadir dengan **32 modul dokumen**, sistem **kuota tamu harian instan**, pemrosesan berkas ringan langsung di memori browser pengguna, dan pipeline server berkecepatan tinggi tanpa jejak penyimpanan (*Zero-Retention Policy*).

---

## 🚀 Fitur Unggulan

### 1. 🎓 Times New Roman Word Formatting
Konverter PDF ke Word (`.docx`) dilengkapi normalisasi tipografi otomatis standar **Times New Roman** (ukuran, spasi, paragraf, dan tata letak tabel utuh). Hasil konversi siap pakai untuk skripsi, tesis, dan dokumen resmi tanpa perlu penataan ulang manual.

### 2. ⚡ Hybrid Processing Engine
- **Client-Side Browser Execution (`pdf-lib`, `jspdf`):** Penggabungan berkas (Merge), pemisahan halaman (Split), rotasi, penghapusan lembar, cap air, dan penomoran berjalan 100% di memori browser tanpa pernah mengunggah file ke server.
- **Server Micro-Workers (PyMuPDF, `pdf2docx`, `pypdf`):** Pemrosesan kompresi cerdas, konversi Word/Excel/PPT, dan enkripsi kata sandi AES dengan performa tinggi.

### 3. 🤖 In-House AI Document Copilot
Asisten dokumen cerdas terintegrasi langsung menggunakan model **Groq LLM**. Pengguna dapat mengajukan pertanyaan, mengekstrak kesimpulan klausul kontrak, membuat soal/kuis, atau merangkum isi berkas panjang tanpa biaya langganan tambahan.

### 4. 🛡️ Jaminan Privasi Zero-Retention
Dokumen yang diproses di server secara otomatis dihapus seketika setelah berkas hasil unduhan diserahkan kepada pengguna. Daemon background server membersihkan direktori temporary secara berkala setiap 30 menit.

### 5. 🎯 Alur Tamu Bebas Hambatan (Guest Quota)
Pengguna tamu dapat langsung menggunakan modul tanpa login dengan batas **4 konversi harian gratis**. Pengguna terdaftar mendapatkan kuota tidak terbatas.

---

## 📂 Katalog Modul Dokumen (30+ Alat)

| Kategori | Modul Tersedia |
| :--- | :--- |
| **PDF to Office & Formats** | PDF to Word (.docx), PDF to Excel (.xlsx), PDF to PPT (.pptx), PDF to JPG, PDF to PNG, PDF to TXT |
| **Office & Formats to PDF** | Word to PDF, Excel to PDF, PowerPoint to PDF, JPG/PNG to PDF, HTML to PDF |
| **Organisir Lembar** | Merge PDF, Split PDF, Rotate Pages (90°/180°), Delete Pages, Extract Pages |
| **Optimasi Ukuran** | Compress PDF (Low, Recommended, Extreme), PDF OCR, PDF to PDF/A (Standar Arsip ISO) |
| **Edit & Anotasi** | Edit PDF Text, Watermark PDF (Cap Air Kustom), Number Pages (Nomor Halaman Otomatis), Crop Margin, Flatten Layers |
| **Keamanan & Proteksi** | Kunci Kata Sandi AES (Protect), Buka Sandi (Unlock), Tanda Tangan Digital (Sign PDF) |
| **AI Document Suite** | AI Document Copilot (Q&A), AI Summarizer, AI Question Generator, AI Translator |

---

## 🛠️ Arsitektur Teknologi

```
Convertify/
├── client/                     # Frontend Next.js 15 (App Router)
│   ├── src/
│   │   ├── app/                # Layout, font (Plus Jakarta Sans), metadata, favicon
│   │   ├── components/         # Bento Grid, Workspace, AuthModal, Copilot, Navbar
│   │   ├── data/               # Metadata & registry 32 modul alat
│   │   ├── tools/              # Engine client-side (pdf-lib, jspdf)
│   │   └── utils/              # API router resolver & guest quota system
├── server/                     # Backend API (FastAPI)
│   ├── routers/                # Endpoint /convert, /optimize, /security, /ai
│   ├── services/               # Worker PyMuPDF, pdf2docx, pypdf, auto-cleanup
│   └── requirements.txt        # Dependensi Python
```

---

## 💻 Panduan Instalasi Lokal

### Prasyarat
- [Node.js](https://nodejs.org/) v18+ dan npm
- [Python](https://python.org/) v3.10+

### 1. Menjalankan Backend (FastAPI)
```bash
# Masuk ke direktori server
cd server

# Buat & aktifkan virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependensi
pip install -r requirements.txt

# Konfigurasi environment variables
copy .env.example .env
# Isi GROQ_API_KEY di dalam server/.env

# Jalankan server FastAPI
uvicorn main:app --reload --port 8000
```
Akses dokumentasi Swagger API di: `http://localhost:8000/docs`

### 2. Menjalankan Frontend (Next.js)
```bash
# Buka terminal baru, masuk ke direktori client
cd client

# Install dependensi
npm install

# Jalankan development server
npm run dev
```
Buka peramban di: `http://localhost:3000`

---

## 🌐 Panduan Deployment

### Backend (Railway)
1. Buat project baru di [Railway.app](https://railway.app) dari repository GitHub ini.
2. Atur **Root Directory** ke `server`.
3. Set **Start Command** ke: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Tambahkan Environment Variable: `GROQ_API_KEY`.
5. Di menu **Networking**, klik **Generate Domain** (contoh: `https://convertify-api.up.railway.app`).

### Frontend (Vercel)
1. Import repository GitHub di [Vercel](https://vercel.com).
2. Atur **Root Directory** ke `client`.
3. Tambahkan Environment Variable:
   - `NEXT_PUBLIC_API_URL` = URL domain backend Railway Anda.
4. Klik **Deploy**.

---

## 📄 Lisensi
Proyek ini didistribusikan di bawah lisensi [MIT License](LICENSE).
Semua pemrosesan dokumen aman, privat, dan bebas watermark.

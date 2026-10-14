import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from groq import Groq

router = APIRouter(prefix="/api/ai", tags=["AI"])

class AskPayload(BaseModel):
    documentText: str
    question: str

@router.post("/ask")
async def ask_pdf(payload: AskPayload):
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY belum dikonfigurasi di server/.env")

    try:
        client = Groq(api_key=api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Anda adalah 'Convertify AI Assistant', asisten in-house resmi platform Convertify. "
                        "ATURAN MUTLAK:\n"
                        "1. DILARANG KERAS menyebut atau merekomendasikan layanan/aplikasi kompetitor pihak ketiga "
                        "(seperti Adobe Acrobat, ILovePDF, Smallpdf, PDF2DOC, Google Docs, Microsoft Office desktop, dsb).\n"
                        "2. Jawab pertanyaan pengguna dengan solusi langsung menggunakan fitur yang tersedia di platform Convertify:\n"
                        "   - PDF to Word: Fitur 'PDF to Word (.docx)' di menu Konversi Convertify dengan opsi tipografi Times New Roman.\n"
                        "   - Word to PDF: Fitur 'Word to PDF' di menu Konversi Convertify.\n"
                        "   - Merge PDF: Fitur 'Merge PDF' untuk menggabungkan banyak file langsung di browser tanpa upload data.\n"
                        "   - Split PDF: Fitur 'Split PDF' untuk memotong rentang halaman tertentu.\n"
                        "   - Image to PDF: Mengubah berkas JPG/PNG jadi PDF di browser.\n"
                        "   - Compress PDF: Mengoptimalkan ukuran berkas (Extreme, Recommended, Low).\n"
                        "   - Protect & Unlock PDF: Menambah atau membuka proteksi kata sandi berkas.\n"
                        "3. Gaya komunikasi: Ringkas, jelas, solutif, profesional, dan ramah. "
                        "Gunakan Bahasa Indonesia jika pengguna bertanya dalam Bahasa Indonesia. "
                        "JANGAN gunakan emoji sama sekali. Fokus langsung pada langkah praktis di Convertify."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Konteks/Isi Dokumen (jika ada):\n{payload.documentText}\n\n"
                        f"Pertanyaan Pengguna:\n{payload.question}"
                    ),
                },
            ],
            model="openai/gpt-oss-20b",
            temperature=0.2,
        )
        answer = chat_completion.choices[0].message.content
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

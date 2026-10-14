from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import FileResponse
from services.pdf_service import compress_pdf

router = APIRouter(prefix="/api/optimize", tags=["Optimize"])

@router.post("/compress")
async def compress(
    file: UploadFile = File(...),
    level: str = Query("recommended", pattern="^(extreme|recommended|low)$"),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    output_path = compress_pdf(content, level=level)

    return FileResponse(
        path=str(output_path),
        filename=f"compressed_{file.filename}",
        media_type="application/pdf",
    )

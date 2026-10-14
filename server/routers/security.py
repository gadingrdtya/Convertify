from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from fastapi.responses import FileResponse
from services.pdf_service import protect_pdf, unlock_pdf

router = APIRouter(prefix="/api/security", tags=["Security"])

@router.post("/protect")
async def protect(file: UploadFile = File(...), password: str = Query(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    if not password:
        raise HTTPException(status_code=400, detail="Password cannot be empty.")

    content = await file.read()
    output_path = protect_pdf(content, password)

    return FileResponse(
        path=str(output_path),
        filename=f"protected_{file.filename}",
        media_type="application/pdf",
    )

@router.post("/unlock")
async def unlock(file: UploadFile = File(...), password: str = Query(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    output_path = unlock_pdf(content, password)

    return FileResponse(
        path=str(output_path),
        filename=f"unlocked_{file.filename}",
        media_type="application/pdf",
    )

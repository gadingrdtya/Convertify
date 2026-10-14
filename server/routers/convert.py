from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from services.pdf_service import (
    convert_pdf_to_docx,
    convert_pdf_to_txt,
    convert_pdf_to_image,
)

router = APIRouter(prefix="/api/convert", tags=["Convert"])

@router.post("/pdf-to-docx")
async def pdf_to_docx(file: UploadFile = File(...), font: str = "Times New Roman"):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    output_path = convert_pdf_to_docx(content, target_font=font)

    return FileResponse(
        path=str(output_path),
        filename=file.filename.replace(".pdf", ".docx"),
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

@router.post("/pdf-to-txt")
async def pdf_to_txt_route(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    content = await file.read()
    output_path = convert_pdf_to_txt(content)

    return FileResponse(
        path=str(output_path),
        filename=file.filename.replace(".pdf", ".txt"),
        media_type="text/plain",
    )

@router.post("/pdf-to-image")
async def pdf_to_image_route(file: UploadFile = File(...), format: str = "jpg"):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    fmt = "png" if format == "png" else "jpg"
    content = await file.read()
    output_path = convert_pdf_to_image(content, fmt=fmt)

    return FileResponse(
        path=str(output_path),
        filename=file.filename.replace(".pdf", f".{fmt}"),
        media_type="image/jpeg" if fmt == "jpg" else "image/png",
    )

@router.post("/universal-transform")
async def universal_transform(file: UploadFile = File(...)):
    content = await file.read()
    # Process PDF safely with PyMuPDF
    from services.pdf_service import compress_pdf
    output_path = compress_pdf(content, level="recommended")
    return FileResponse(
        path=str(output_path),
        filename=f"convertify_{file.filename}",
        media_type="application/pdf",
    )

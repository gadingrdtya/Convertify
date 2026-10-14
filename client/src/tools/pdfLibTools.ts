import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

export async function mergePdfFiles(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return new Blob([mergedPdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

export async function splitPdfFile(
  file: File,
  startPage: number,
  endPage: number
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer);
  const totalPages = srcPdf.getPageCount();

  const validStart = Math.max(1, Math.min(startPage, totalPages));
  const validEnd = Math.max(validStart, Math.min(endPage, totalPages));

  const newPdf = await PDFDocument.create();
  const pageIndices: number[] = [];
  for (let i = validStart - 1; i < validEnd; i++) {
    pageIndices.push(i);
  }

  const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  const newPdfBytes = await newPdf.save();
  return new Blob([newPdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

export async function rotatePdfFile(file: File, angle: number = 90): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angle) % 360));
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

export async function deletePdfPage(file: File, pageToDelete: number): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const totalPages = pdf.getPageCount();

  if (totalPages <= 1) {
    throw new Error("Dokumen hanya memiliki 1 halaman, tidak dapat menghapus semua halaman.");
  }

  const targetIdx = Math.max(0, Math.min(pageToDelete - 1, totalPages - 1));
  pdf.removePage(targetIdx);

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

export async function watermarkPdfFile(file: File, watermarkText: string = "CONFIDENTIAL"): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pages = pdf.getPages();

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(watermarkText, {
      x: width / 4,
      y: height / 2,
      size: 42,
      font,
      color: rgb(0.8, 0.2, 0.2),
      opacity: 0.35,
      rotate: degrees(45),
    });
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

export async function addPageNumbersPdf(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const total = pages.length;

  pages.forEach((page, idx) => {
    const { width } = page.getSize();
    const text = `Halaman ${idx + 1} dari ${total}`;
    page.drawText(text, {
      x: width / 2 - 35,
      y: 20,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
  });

  const pdfBytes = await pdf.save();
  return new Blob([pdfBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
}

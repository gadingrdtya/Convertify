import { jsPDF } from "jspdf";

export async function convertImagesToPdf(files: File[]): Promise<Blob> {
  const doc = new jsPDF();
  let isFirstPage = true;

  for (const file of files) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Create an HTML Image to inspect actual aspect ratio
    const imgElement = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement("img");
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });

    if (!isFirstPage) {
      doc.addPage();
    } else {
      isFirstPage = false;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Scale to fit page while keeping aspect ratio
    const ratio = Math.min(pageWidth / imgElement.width, pageHeight / imgElement.height);
    const finalWidth = imgElement.width * ratio;
    const finalHeight = imgElement.height * ratio;
    const x = (pageWidth - finalWidth) / 2;
    const y = (pageHeight - finalHeight) / 2;

    const imgType = file.type.includes("png") ? "PNG" : "JPEG";
    doc.addImage(dataUrl, imgType, x, y, finalWidth, finalHeight);
  }

  const pdfOutput = doc.output("blob");
  return pdfOutput;
}

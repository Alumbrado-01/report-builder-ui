import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  // Cargar plantilla y llenar datos
  async fillPdfFromTemplate(templateUrl: string, datos: {text: string, x: number, y: number, size?: number }[]): Promise<Uint8Array> {
    // Cargar archivo PDF como array buffer
    const existingPdfBytes = await fetch(templateUrl).then(res => res.arrayBuffer());

    // Cargar el PDF existente
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // Tomar la primera página (puedes adaptar para más páginas)
    const page = pdfDoc.getPage(0);

    // Fuente para escribir
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Agregar textos
    datos.forEach(item => {
      page.drawText(item.text, {
        x: item.x,
        y: page.getHeight() - item.y, // Origen en esquina inferior izquierda
        size: item.size ?? 12,
        font: font,
        color: rgb(0, 0, 0)
      });
    });

    // Guardar PDF como Uint8Array
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }

  // Abrir PDF en navegador
  openPdfInBrowser(pdfBytes: Uint8Array) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}

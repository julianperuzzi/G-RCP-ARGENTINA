import { validateDocument } from './portal.js';

const MAX_IMAGE_INPUT = 40 * 1024 * 1024;
const IMAGE_THRESHOLD = 1024 * 1024;
const MAX_EDGE = 2400;

export async function prepareFinanceDocument(file) {
  if (!file) throw new Error('Seleccioná un archivo.');
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error('Usá un PDF o una imagen JPG o PNG.');
  }
  if (file.type === 'application/pdf' || file.size < IMAGE_THRESHOLD) {
    validateDocument(file);
    return file;
  }
  if (file.size > MAX_IMAGE_INPUT) throw new Error('La imagen original debe pesar menos de 40 MB.');
  if (!globalThis.createImageBitmap) {
    validateDocument(file);
    return file;
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo procesar la imagen.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.86));
    if (!blob) throw new Error('No se pudo comprimir la imagen.');
    const compressed = new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
    const result = compressed.size < file.size ? compressed : file;
    validateDocument(result);
    return result;
  } catch (error) {
    if (error?.message?.startsWith('El archivo debe')) throw error;
    throw new Error('No se pudo procesar la imagen. Probá con un JPG o PDF más pequeño.');
  } finally {
    bitmap?.close();
  }
}

export const preparePortalDocument = prepareFinanceDocument;

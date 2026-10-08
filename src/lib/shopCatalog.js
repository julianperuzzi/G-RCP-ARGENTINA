export function stockLimit(value) {
  if (typeof value === 'number') return Number.isInteger(value) && value > 0 ? value : 0;
  const stock = String(value ?? '').trim().toLocaleLowerCase('es');
  if (stock === 'disponible' || stock === 'en stock') return Infinity;
  if (/^\d+$/.test(stock)) return Number(stock) || 0;
  return 0;
}

export const hasStock = (product) => stockLimit(product?.stock) > 0;

export function sellingPrice(product) {
  const price = Number(product?.precio);
  const discount = Number(product?.descuento);
  return discount > 0 && discount < price ? discount : price;
}

export function catalogProducts(rows) {
  return (rows || []).filter((row) => {
    const price = Number(row?.precio);
    return row && String(row.id || '').trim() && String(row.nombre || '').trim() &&
      Number.isFinite(price) && price > 0;
  }).map((row) => ({
    ...row,
    id: String(row.id).trim(),
    nombre: String(row.nombre).trim(),
    descripcion: String(row.descripcion || '').trim(),
    stock: String(row.stock || '').trim(),
  }));
}

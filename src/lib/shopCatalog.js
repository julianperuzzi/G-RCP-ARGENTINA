const moneyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

export function shopPrice(product) {
  const price = Number(product?.price_cents) || 0;
  const sale = Number(product?.sale_price_cents);
  return sale > 0 && sale < price ? sale : price;
}

export function formatShopPrice(cents) {
  return moneyFormatter.format((Number(cents) || 0) / 100);
}

export function shopDiscountPercent(product) {
  return product?.sale_price_cents && product.sale_price_cents < product.price_cents
    ? Math.round((1 - product.sale_price_cents / product.price_cents) * 100) : 0;
}

export function shopStockLimit(product) {
  if (!product || product.stock_mode === 'out_of_stock' || product.status !== 'published') return 0;
  if (product.stock_mode === 'available') return Infinity;
  return product.stock_mode === 'limited' ? Math.max(0, Number(product.stock_quantity) || 0) : 0;
}

export const shopCanOrder = (product) => shopStockLimit(product) > 0;

export function shopStockLabel(product) {
  if (!product || product.stock_mode === 'out_of_stock') return 'Sin stock';
  if (product.stock_mode === 'limited') return product.stock_quantity > 0
    ? `${product.stock_quantity} ${product.stock_quantity === 1 ? 'unidad' : 'unidades'}` : 'Sin stock';
  return 'Disponible';
}

export function shopCover(product) {
  return product?.images?.[0]?.url || product?.external_image_url || '';
}

export function shopMoneyToCents(value) {
  const valueText = String(value ?? '').trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(valueText)) return null;
  const cents = Math.round(Number(valueText) * 100);
  return Number.isSafeInteger(cents) && cents > 0 ? cents : null;
}

export function validateShopDraft(form) {
  const name = String(form.name || '').trim();
  const category = String(form.category || '').trim();
  const price = shopMoneyToCents(form.price);
  const sale = String(form.sale || '').trim() ? shopMoneyToCents(form.sale) : null;
  const stockQuantity = Number(form.stock_quantity);
  if (name.length < 2 || name.length > 180) throw new Error('El nombre debe tener entre 2 y 180 caracteres.');
  if (category.length < 2 || category.length > 80) throw new Error('Indicá una categoría válida.');
  if (price == null || price > 99999999999) throw new Error('Indicá un precio válido mayor que cero.');
  if (String(form.sale || '').trim() && (sale == null || sale >= price)) throw new Error('La oferta debe ser mayor que cero y menor que el precio normal.');
  if (!['available', 'limited', 'out_of_stock'].includes(form.stock_mode)) throw new Error('Elegí un estado de stock válido.');
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0 || stockQuantity > 1000000 || (form.stock_mode === 'limited' && stockQuantity === 0)) {
    throw new Error('Indicá una cantidad válida para el stock limitado.');
  }
  if (!['draft', 'published', 'archived'].includes(form.status)) throw new Error('Elegí un estado de publicación válido.');
  const url = String(form.external_image_url || '').trim();
  if (url && (!/^https:\/\/\S+$/i.test(url) || url.length > 2000)) throw new Error('La URL de la foto debe comenzar con https://.');
  return {
    sku: String(form.sku || '').trim() || null,
    name,
    category,
    summary: String(form.summary || '').trim(),
    description: String(form.description || '').trim(),
    price_cents: price,
    sale_price_cents: sale,
    stock_mode: form.stock_mode,
    stock_quantity: form.stock_mode === 'limited' ? stockQuantity : 0,
    status: form.status,
    featured: Boolean(form.featured),
    sort_order: Number(form.sort_order) || 0,
    external_image_url: url || null,
  };
}

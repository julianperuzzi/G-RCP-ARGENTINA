import { supabase } from './supabase';

export const SHOP_BUCKET = 'shop-images';
const PRODUCT_FIELDS = 'id,sku,name,category,summary,description,price_cents,sale_price_cents,stock_mode,stock_quantity,status,featured,sort_order,external_image_url,created_at,updated_at';
const ADMIN_FIELDS = `${PRODUCT_FIELDS},created_by,updated_by`;

export function shopImageUrl(path) {
  if (!path || !supabase) return '';
  return supabase.storage.from(SHOP_BUCKET).getPublicUrl(path).data.publicUrl;
}

async function readShopProducts(owner) {
  if (!supabase) throw new Error('La tienda todavía no está conectada.');
  const products = [];
  for (let from = 0; ; from += 100) {
    let query = supabase.from('shop_products').select(owner ? ADMIN_FIELDS : PRODUCT_FIELDS)
      .order('featured', { ascending: false }).order('sort_order').order('name').order('id')
      .range(from, from + 99);
    if (!owner) query = query.eq('status', 'published');
    const { data, error } = await query;
    if (error) throw error;
    if (!data.length) break;
    const ids = data.map((row) => row.id);
    const { data: images, error: imageError } = await supabase.from('shop_product_images')
      .select('id,product_id,file_path,alt_text,position').in('product_id', ids)
      .order('position').order('id');
    if (imageError) throw imageError;
    const imageMap = new Map(ids.map((id) => [id, []]));
    for (const image of images || []) imageMap.get(image.product_id)?.push({ ...image, url: shopImageUrl(image.file_path) });
    products.push(...data.map((row) => ({ ...row, images: imageMap.get(row.id) || [] })));
    if (data.length < 100) break;
  }
  return products;
}

export const listPublicShopProducts = () => readShopProducts(false);
export const listOwnerShopProducts = () => readShopProducts(true);

export async function saveShopProduct(payload, original) {
  if (!supabase) throw new Error('La tienda no está conectada.');
  const query = original
    ? supabase.from('shop_products').update(payload).eq('id', original.id).eq('updated_at', original.updated_at)
    : supabase.from('shop_products').insert(payload);
  const { data, error } = await query.select(ADMIN_FIELDS).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('El producto cambió en otra sesión o ya no tenés permiso. Actualizá el catálogo antes de guardar.');
  return data;
}

export async function prepareShopImage(file) {
  if (!file || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Usá una imagen JPG, PNG o WebP.');
  if (file.size > 15 * 1024 * 1024) throw new Error('La imagen original debe pesar menos de 15 MB.');
  if (!globalThis.createImageBitmap) {
    if (file.size > 5 * 1024 * 1024) throw new Error('La imagen supera 5 MB. Reducí su tamaño.');
    return file;
  }
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('No se pudo preparar la imagen.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.84));
    if (!blob || blob.size > 5 * 1024 * 1024) throw new Error('La imagen comprimida supera 5 MB. Usá otra foto.');
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
  } finally { bitmap?.close(); }
}

export async function uploadShopImage(product, file, position = 0) {
  const prepared = await prepareShopImage(file);
  const path = `${product.id}/${crypto.randomUUID()}.${prepared.type === 'image/jpeg' ? 'jpg' : prepared.type === 'image/png' ? 'png' : 'webp'}`;
  const { error: uploadError } = await supabase.storage.from(SHOP_BUCKET).upload(path, prepared, { contentType: prepared.type, upsert: false });
  if (uploadError) throw uploadError;
  const { data, error } = await supabase.from('shop_product_images').insert({ product_id: product.id, file_path: path, alt_text: product.name, position })
    .select('id,product_id,file_path,alt_text,position').single();
  if (error) {
    await supabase.storage.from(SHOP_BUCKET).remove([path]);
    throw error;
  }
  return { ...data, url: shopImageUrl(path) };
}

export async function removeShopImage(image) {
  const { error } = await supabase.from('shop_product_images').delete().eq('id', image.id);
  if (error) throw error;
  const { error: storageError } = await supabase.storage.from(SHOP_BUCKET).remove([image.file_path]);
  if (storageError) throw new Error('La foto se quitó del producto, pero el archivo sigue en Storage. Revisá el bucket shop-images.');
}

export async function loadShopAudit(productId) {
  const { data, error } = await supabase.from('shop_product_audit')
    .select('id,action,actor_id,happened_at,before_data,after_data')
    .eq('product_id', productId).order('happened_at', { ascending: false }).order('id', { ascending: false }).limit(30);
  if (error) throw error;
  return data || [];
}

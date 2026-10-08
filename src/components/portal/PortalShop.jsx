import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpRight, Archive, Camera, Check, Clock3, ImagePlus, Package, Pencil, Plus, RefreshCw, Search, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listOwnerShopProducts, loadShopAudit, removeShopImage, saveShopProduct, uploadShopImage } from '../../lib/shopApi';
import { formatShopPrice, shopCover, shopStockLabel, validateShopDraft } from '../../lib/shopCatalog';
import './portal-shop.css';

const DEMO_PRODUCTS = [
  { id: 'demo-shop-1', sku: 'EJ-RCP', name: 'Kit de práctica RCP · Ejemplo', category: 'Capacitación', summary: 'Material de práctica para jornadas de formación.', description: 'Producto ficticio de la demostración.', price_cents: 12000000, sale_price_cents: null, stock_mode: 'limited', stock_quantity: 8, status: 'published', featured: true, sort_order: 0, images: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'demo-shop-2', sku: 'EJ-TRAUMA', name: 'Kit de trauma · Ejemplo', category: 'Primeros auxilios', summary: 'Material de muestra.', description: 'Producto ficticio de la demostración.', price_cents: 4500000, sale_price_cents: null, stock_mode: 'out_of_stock', stock_quantity: 0, status: 'draft', featured: false, sort_order: 1, images: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];
const EMPTY = { sku: '', name: '', category: 'Equipamiento', summary: '', description: '', price: '', sale: '', stock_mode: 'out_of_stock', stock_quantity: '0', status: 'draft', featured: false, sort_order: '0', external_image_url: '' };
const STATUS = { draft: 'Borrador', published: 'Publicado', archived: 'Archivado' };
const dateLabel = (value) => value ? new Date(value).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' }) : '—';
function formFromProduct(product) {
  if (!product) return { ...EMPTY };
  return {
    sku: product.sku || '', name: product.name, category: product.category,
    summary: product.summary || '', description: product.description || '',
    price: (product.price_cents / 100).toString(), sale: product.sale_price_cents ? (product.sale_price_cents / 100).toString() : '',
    stock_mode: product.stock_mode, stock_quantity: String(product.stock_quantity),
    status: product.status, featured: product.featured, sort_order: String(product.sort_order),
    external_image_url: product.external_image_url || '',
  };
}

export default function PortalShop({ demo }) {
  const [products, setProducts] = useState(demo ? DEMO_PRODUCTS : []);
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!demo);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [audit, setAudit] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const reload = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    try { setProducts(await listOwnerShopProducts()); setError(''); }
    catch { setError('No pudimos cargar el catálogo. Comprobá la conexión y que la migración de tienda esté aplicada.'); }
    finally { setLoading(false); }
  }, [demo]);
  useEffect(() => { reload(); }, [reload]);
  const selected = products.find((row) => row.id === selectedId);
  useEffect(() => {
    if (!selectedId || demo) { setAudit([]); return; }
    let active = true;
    setAuditLoading(true);
    loadShopAudit(selectedId).then((rows) => { if (active) setAudit(rows); })
      .catch(() => { if (active) setAudit([]); }).finally(() => { if (active) setAuditLoading(false); });
    return () => { active = false; };
  }, [selectedId, products, demo]);
  const filtered = useMemo(() => products.filter((row) => (status === 'all' || row.status === status) &&
    `${row.name} ${row.sku || ''} ${row.category}`.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es'))), [products, status, search]);
  const counts = useMemo(() => ({ all: products.length, published: products.filter((row) => row.status === 'published').length,
    draft: products.filter((row) => row.status === 'draft').length, archived: products.filter((row) => row.status === 'archived').length }), [products]);
  function choose(product) { setSelectedId(product.id); setEditing(false); setForm(formFromProduct(product)); setError(''); setNotice(''); }
  function create() { setSelectedId(null); setForm({ ...EMPTY }); setEditing(true); setError(''); setNotice(''); }
  function setField(key, value) { setForm((current) => ({ ...current, [key]: value })); }
  async function perform(operation, success) {
    setBusy(true); setError(''); setNotice('');
    try { await operation(); if (!demo) await reload(); setNotice(success); }
    catch (failure) { setError(failure.code === '23505' ? 'Ya existe un producto con ese código SKU.' : failure.message || 'No pudimos guardar el producto.'); }
    finally { setBusy(false); }
  }
  function save(event) {
    event.preventDefault();
    let payload;
    try { payload = validateShopDraft(form); } catch (failure) { setError(failure.message); return; }
    perform(async () => {
      if (demo) {
        const next = { ...selected, ...payload, id: selected?.id || crypto.randomUUID(), updated_at: new Date().toISOString(), created_at: selected?.created_at || new Date().toISOString(), images: selected?.images || [] };
        setProducts((current) => selected ? current.map((row) => row.id === selected.id ? next : row) : [next, ...current]);
        setSelectedId(next.id);
      } else {
        const next = await saveShopProduct(payload, selected);
        setSelectedId(next.id);
      }
      setEditing(false);
    }, selected ? 'Producto actualizado.' : 'Producto creado. Podés cargar fotos y publicarlo cuando esté listo.');
  }
  function setProductStatus(product, nextStatus) {
    perform(async () => {
      if (demo) setProducts((current) => current.map((row) => row.id === product.id ? { ...row, status: nextStatus, updated_at: new Date().toISOString() } : row));
      else await saveShopProduct({ status: nextStatus }, product);
      if (selectedId === product.id) setForm((current) => ({ ...current, status: nextStatus }));
    }, nextStatus === 'published' ? 'Producto publicado en la tienda.' : nextStatus === 'archived' ? 'Producto archivado y retirado de la tienda.' : 'Producto guardado como borrador.');
  }
  async function addImages(event) {
    const files = [...(event.target.files || [])];
    event.target.value = '';
    if (!files.length || !selected) return;
    if (selected.images.length + files.length > 6) { setError('Cada producto admite hasta 6 fotos.'); return; }
    await perform(async () => {
      if (demo) {
        const images = files.map((file, index) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(file), alt_text: selected.name, position: selected.images.length + index }));
        setProducts((current) => current.map((row) => row.id === selected.id ? { ...row, images: [...row.images, ...images] } : row));
      } else {
        let uploaded = 0;
        try { for (const file of files) { await uploadShopImage(selected, file, selected.images.length + uploaded); uploaded++; } }
        catch (failure) { throw new Error(`${uploaded} foto(s) guardadas antes del error. Actualizá la ficha. ${failure.message}`); }
      }
    }, `${files.length} ${files.length === 1 ? 'foto agregada' : 'fotos agregadas'}.`);
  }
  function removeImage(image) {
    perform(async () => {
      if (demo) setProducts((current) => current.map((row) => row.id === selected.id ? { ...row, images: row.images.filter((item) => item.id !== image.id) } : row));
      else await removeShopImage(image);
    }, 'Foto retirada del producto.');
  }
  return <div className="portal-shop">
    <section className="portal-shop-intro"><div><span className="portal-shop-kicker">CATÁLOGO GRCP</span><h2>Productos listos para publicar.</h2><p>Administrá precios, disponibilidad y fotos desde aquí. Solo los productos publicados aparecen en la tienda pública.</p></div><div className="portal-shop-intro-actions"><Link to="/shop" target="_blank" rel="noopener noreferrer">Ver tienda <ArrowUpRight size={16} /></Link><button className="portal-button primary" type="button" onClick={create}><Plus size={17} /> Nuevo producto</button></div></section>
    <div className="portal-shop-stats">{[['all','Todos',Package],['published','Publicados',Check],['draft','Borradores',Clock3],['archived','Archivados',Archive]].map(([key,label,Icon]) => <button key={key} type="button" className={status === key ? 'active' : ''} onClick={() => setStatus(key)}><Icon size={18} /><strong>{counts[key]}</strong><span>{label}</span></button>)}</div>
    <div className="portal-shop-toolbar"><label><Search size={18} /><input aria-label="Buscar productos" placeholder="Buscar por nombre, SKU o categoría" value={search} onChange={(event) => setSearch(event.target.value)} /></label><button type="button" onClick={reload} disabled={busy || loading || demo} aria-label="Actualizar catálogo"><RefreshCw size={18} /></button></div>
    {error && <p className="portal-alert error" role="alert">{error}</p>}{notice && <p className="portal-alert success" role="status">{notice}</p>}
    {loading ? <p className="portal-shop-empty" role="status">Cargando productos…</p> : <div className="portal-shop-layout"><div className="portal-shop-list">{filtered.map((product) => <button key={product.id} type="button" className={`portal-shop-row ${selectedId === product.id ? 'selected' : ''}`} onClick={() => choose(product)}><span className="portal-shop-thumb">{shopCover(product) ? <img src={shopCover(product)} alt="" /> : <Camera size={22} />}</span><span className="portal-shop-row-copy"><strong>{product.name}</strong><small>{product.category} {product.sku ? `· ${product.sku}` : ''}</small><small>{shopStockLabel(product)} · {formatShopPrice(product.sale_price_cents || product.price_cents)}</small></span><span className={`portal-shop-status ${product.status}`}>{STATUS[product.status]}</span></button>)}{!filtered.length && <div className="portal-shop-empty"><Package size={28} /><h3>{products.length ? 'Sin resultados' : 'El catálogo todavía está vacío'}</h3><p>{products.length ? 'Probá otra búsqueda o filtro.' : 'Creá tu primer producto como borrador y agregale fotos antes de publicarlo.'}</p></div>}</div>
      <div className="portal-shop-detail">{editing ? <form onSubmit={save} className="portal-shop-form"><div className="portal-shop-panel-head"><div><span className="portal-shop-kicker">{selected ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}</span><h3>{selected?.name || 'Ficha del producto'}</h3></div><button type="button" onClick={() => { setEditing(false); setError(''); }} aria-label="Cerrar editor"><X size={20} /></button></div><div className="portal-shop-form-grid"><label className="wide">Nombre<input required maxLength={180} value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Ej. Kit de primeros auxilios" /></label><label>Categoría<input required maxLength={80} list="shop-categories" value={form.category} onChange={(event) => setField('category', event.target.value)} /><datalist id="shop-categories"><option value="Equipamiento" /><option value="Capacitación" /><option value="Primeros auxilios" /><option value="DEA y accesorios" /><option value="Rescate" /></datalist></label><label>Código SKU<input maxLength={60} value={form.sku} onChange={(event) => setField('sku', event.target.value)} placeholder="Opcional" /></label><label className="wide">Resumen<input maxLength={350} value={form.summary} onChange={(event) => setField('summary', event.target.value)} placeholder="Frase breve para el catálogo" /></label><label className="wide">Descripción<textarea maxLength={8000} rows={5} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Características, contenido, uso y medidas…" /></label><label>Precio normal (ARS)<input required inputMode="decimal" value={form.price} onChange={(event) => setField('price', event.target.value)} placeholder="120000" /></label><label>Precio de oferta (ARS)<input inputMode="decimal" value={form.sale} onChange={(event) => setField('sale', event.target.value)} placeholder="Opcional" /></label><label>Disponibilidad<select value={form.stock_mode} onChange={(event) => setField('stock_mode', event.target.value)}><option value="available">Disponible, sin cantidad fija</option><option value="limited">Cantidad limitada</option><option value="out_of_stock">Sin stock</option></select></label>{form.stock_mode === 'limited' && <label>Unidades disponibles<input type="number" min="1" max="1000000" value={form.stock_quantity} onChange={(event) => setField('stock_quantity', event.target.value)} /></label>}<label>Publicación<select value={form.status} onChange={(event) => setField('status', event.target.value)}><option value="draft">Borrador</option><option value="published">Publicado</option><option value="archived">Archivado</option></select></label><label>Orden<input type="number" value={form.sort_order} onChange={(event) => setField('sort_order', event.target.value)} /></label><label className="wide portal-shop-checkbox"><input type="checkbox" checked={form.featured} onChange={(event) => setField('featured', event.target.checked)} /> <Star size={16} /> Destacar producto en la tienda</label><label className="wide">URL de foto externa (opcional)<input type="url" maxLength={2000} value={form.external_image_url} onChange={(event) => setField('external_image_url', event.target.value)} placeholder="https://…" /><small>Para fotos nuevas, guardá el producto y usá “Agregar fotos” en su ficha.</small></label></div><div className="portal-shop-form-actions"><button className="portal-button primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar producto'}</button><button type="button" className="portal-button" onClick={() => setEditing(false)}>Cancelar</button></div></form> : selected ? <div className="portal-shop-product"><div className="portal-shop-panel-head"><div><span className="portal-shop-kicker">FICHA DEL PRODUCTO</span><h3>{selected.name}</h3></div><button type="button" onClick={() => setSelectedId(null)} aria-label="Cerrar detalle"><X size={20} /></button></div><div className="portal-shop-cover">{shopCover(selected) ? <img src={shopCover(selected)} alt={selected.name} /> : <Camera size={42} />}</div><div className="portal-shop-detail-meta"><span className={`portal-shop-status ${selected.status}`}>{STATUS[selected.status]}</span>{selected.featured && <span><Star size={13} /> Destacado</span>}</div><p>{selected.summary || 'Sin resumen.'}</p><dl><div><dt>Precio</dt><dd>{formatShopPrice(selected.price_cents)}</dd></div><div><dt>Oferta</dt><dd>{selected.sale_price_cents ? formatShopPrice(selected.sale_price_cents) : '—'}</dd></div><div><dt>Stock</dt><dd>{shopStockLabel(selected)}</dd></div><div><dt>Actualizado</dt><dd>{dateLabel(selected.updated_at)}</dd></div></dl><div className="portal-shop-detail-actions"><button type="button" className="portal-button primary" onClick={() => { setForm(formFromProduct(selected)); setEditing(true); }}><Pencil size={16} /> Editar</button>{selected.status !== 'published' && <button type="button" className="portal-button" disabled={busy} onClick={() => setProductStatus(selected, 'published')}>Publicar</button>}{selected.status === 'published' && <button type="button" className="portal-button" disabled={busy} onClick={() => setProductStatus(selected, 'draft')}>Retirar publicación</button>}{selected.status !== 'archived' && <button type="button" className="portal-button" disabled={busy} onClick={() => setProductStatus(selected, 'archived')}><Archive size={15} /> Archivar</button>}</div><div className="portal-shop-media"><div className="portal-shop-subhead"><h4>Fotos del producto <small>{selected.images.length}/6</small></h4><label className={busy || selected.images.length >= 6 ? 'disabled' : ''}><ImagePlus size={16} /> Agregar fotos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addImages} disabled={busy || selected.images.length >= 6} /></label></div>{!selected.images.length && <p>Sin fotos cargadas. Podés agregar hasta seis imágenes JPG, PNG o WebP; se comprimen antes de subirlas.</p>}<div className="portal-shop-media-grid">{selected.images.map((image) => <div key={image.id}><img src={image.url} alt={image.alt_text || selected.name} /><button type="button" disabled={busy} onClick={() => removeImage(image)} aria-label={`Quitar foto ${image.position + 1}`}><X size={14} /></button></div>)}</div></div><details className="portal-shop-audit"><summary>Historial de cambios</summary>{auditLoading ? <p>Cargando…</p> : !audit.length ? <p>Sin cambios registrados.</p> : <ol>{audit.map((entry) => <li key={entry.id}><strong>{entry.action === 'INSERT' ? 'Producto creado' : entry.before_data?.price_cents !== entry.after_data?.price_cents ? `Precio: ${formatShopPrice(entry.before_data.price_cents)} → ${formatShopPrice(entry.after_data.price_cents)}` : entry.before_data?.status !== entry.after_data?.status ? `Estado: ${STATUS[entry.before_data.status]} → ${STATUS[entry.after_data.status]}` : 'Producto actualizado'}</strong><small>{dateLabel(entry.happened_at)}</small></li>)}</ol>}</details></div> : <div className="portal-shop-empty portal-shop-select"><Package size={32} /><h3>Elegí un producto</h3><p>Seleccioná una ficha para ver precios, fotos, historial y opciones de edición.</p></div>}</div></div>}
    {demo && <p className="portal-shop-demo-note">Demostración: los cambios duran esta visita y no se publican en la tienda real.</p>}
  </div>;
}

PortalShop.propTypes = { demo: PropTypes.bool.isRequired };

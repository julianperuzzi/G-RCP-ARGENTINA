import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown, ArrowRight, HeartPulse, PackageSearch, RotateCw, Search, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import ProductCard from '../components/Shop/ProductCard';
import ProductModal from '../components/Shop/ProductModal';
import CartSidebar from '../components/Shop/CartSidebar';
import { listPublicShopProducts } from '../lib/shopApi';
import { formatShopPrice, shopCanOrder, shopCover, shopPrice, shopStockLimit } from '../lib/shopCatalog';
import '../components/Shop/shop.css';
import 'react-toastify/dist/ReactToastify.css';

const WHATSAPP_NUMBER = '5492645667981';
const CART_KEY = 'grcp-shop-cart-v1';
function savedCart() {
  try {
    const rows = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(rows) ? rows.filter((row) => typeof row.id === 'string' && Number.isInteger(row.quantity) && row.quantity > 0).slice(0, 50) : [];
  } catch { return []; }
}

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(savedCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todas');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [params, setParams] = useSearchParams();
  const selected = products.find((item) => item.id === params.get('producto')) || null;
  const closeProduct = useCallback(() => setParams((current) => { const next = new URLSearchParams(current); next.delete('producto'); return next; }, { replace: true }), [setParams]);
  const closeCart = useCallback(() => setCartOpen(false), []);
  useEffect(() => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* storage unavailable */ } }, [cart]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    listPublicShopProducts().then((rows) => { if (active) setProducts(rows); })
      .catch(() => { if (active) setError('No pudimos cargar los productos. Revisá tu conexión e intentá nuevamente.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [refresh]);
  const productMap = useMemo(() => new Map(products.map((row) => [row.id, row])), [products]);
  const cartLines = useMemo(() => cart.map((row) => {
    const product = productMap.get(row.id);
    return product ? { ...product, quantity: row.quantity } : null;
  }).filter(Boolean), [cart, productMap]);
  const cartUnits = cartLines.reduce((sum, row) => sum + row.quantity, 0);
  const categories = useMemo(() => ['Todas', ...new Set(products.map((row) => row.category))], [products]);
  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('es');
    const rows = products.filter((row) => (category === 'Todas' || row.category === category) &&
      `${row.name} ${row.summary} ${row.description} ${row.category} ${row.sku || ''}`.toLocaleLowerCase('es').includes(term));
    if (sort === 'price-asc') return [...rows].sort((a, b) => shopPrice(a) - shopPrice(b) || a.name.localeCompare(b.name));
    if (sort === 'price-desc') return [...rows].sort((a, b) => shopPrice(b) - shopPrice(a) || a.name.localeCompare(b.name));
    if (sort === 'name') return [...rows].sort((a, b) => a.name.localeCompare(b.name));
    return rows;
  }, [products, query, category, sort]);
  const featured = products.find((row) => row.featured && shopCanOrder(row)) || products.find(shopCanOrder);

  function addToCart(product) {
    if (!shopCanOrder(product)) { toast.error('Este producto no está disponible en este momento.'); return; }
    const existing = cart.find((row) => row.id === product.id);
    if ((existing?.quantity || 0) + 1 > shopStockLimit(product)) { toast.error('No hay más unidades disponibles.'); return; }
    setCart((current) => existing ? current.map((row) => row.id === product.id ? { ...row, quantity: row.quantity + 1 } : row) : [...current, { id: product.id, quantity: 1 }]);
    toast.success(`${product.name} agregado al carrito.`);
  }
  function updateQuantity(id, quantity) {
    const product = productMap.get(id);
    if (!product) return;
    setCart((current) => current.map((row) => row.id === id ? { ...row, quantity: Math.max(1, Math.min(quantity, shopStockLimit(product))) } : row));
  }
  async function sendInquiry() {
    if (checking || !cartLines.length) return;
    setChecking(true);
    try {
      const latest = await listPublicShopProducts();
      const latestMap = new Map(latest.map((row) => [row.id, row]));
      const changed = cartLines.some((line) => {
        const current = latestMap.get(line.id);
        return !current || !shopCanOrder(current) || line.quantity > shopStockLimit(current) || shopPrice(line) !== shopPrice(current);
      });
      setProducts(latest);
      if (changed) { toast.info('Cambió el precio o la disponibilidad de un producto. Revisá el carrito actualizado antes de consultar.'); return; }
      const total = cartLines.reduce((sum, line) => sum + shopPrice(line) * line.quantity, 0);
      const lines = cartLines.map((line, index) => `${index + 1}. ${line.name} × ${line.quantity} — ${formatShopPrice(shopPrice(line) * line.quantity)} (${formatShopPrice(shopPrice(line))} c/u)`);
      const message = `Hola, quiero consultar por estos productos de la tienda GRCP:\n\n${lines.join('\n')}\n\nTotal estimado: ${formatShopPrice(total)}\n\n¿Me confirman disponibilidad, entrega e importe final?`;
      window.location.assign(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`);
    } catch { toast.error('No pudimos confirmar el catálogo. Intentá otra vez antes de enviar la consulta.'); }
    finally { setChecking(false); }
  }
  function openProduct(product) { setParams((current) => { const next = new URLSearchParams(current); next.set('producto', product.id); return next; }); }

  return <div className="shop-page">
    <div className="shop-announcement"><ShieldCheck size={15} /><span>Equipamiento seleccionado para estar mejor preparados. Atención directa de GRCP Argentina.</span></div>
    <section className="shop-hero"><div className="shop-container shop-hero-grid">
      <div className="shop-hero-copy"><span className="shop-eyebrow"><Sparkles size={15} /> TIENDA GRCP ARGENTINA</span><h1>Prepararse cambia <em>todo.</em></h1><p>Encontrá equipamiento para capacitación, prevención y respuesta. Elegí lo que necesitás y coordiná tu compra directamente con nuestro equipo.</p><div className="shop-hero-actions"><a className="shop-primary-button" href="#productos">Explorar catálogo <ArrowDown size={18} /></a><span>Sin pago en línea · Consulta por WhatsApp</span></div></div>
      <div className="shop-hero-art" aria-hidden="true"><div className="shop-hero-orbit orbit-one" /><div className="shop-hero-orbit orbit-two" /><HeartPulse className="shop-hero-heart" size={118} strokeWidth={1} /><span className="shop-hero-word">LISTOS<br />PARA<br />ACTUAR.</span><span className="shop-hero-stamp">GRCP<br />ARGENTINA</span></div>
    </div></section>
    {featured && !loading && <section className="shop-container shop-featured" aria-label="Producto destacado"><div className="shop-featured-image">{shopCover(featured) ? <img src={shopCover(featured)} alt={featured.images?.[0]?.alt_text || featured.name} /> : <HeartPulse size={72} strokeWidth={1.2} />}</div><div className="shop-featured-copy"><span className="shop-eyebrow">UNA ELECCIÓN PARA ESTAR PREPARADOS</span><h2>{featured.name}</h2><p>{featured.summary || featured.description}</p><div><strong>{formatShopPrice(shopPrice(featured))}</strong><button type="button" onClick={() => openProduct(featured)}>Conocer producto <ArrowRight size={18} /></button></div></div></section>}
    <section className="shop-container shop-catalog" id="productos" aria-labelledby="shop-catalog-title"><div className="shop-section-heading"><div><span className="shop-eyebrow">EQUIPAMIENTO Y RECURSOS</span><h2 id="shop-catalog-title">Explorá el catálogo</h2><p>Productos disponibles para consultar con nuestro equipo.</p></div><button type="button" className="shop-cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${cartUnits} productos`}><ShoppingBag size={21} /><span>Mi carrito</span><b>{cartUnits}</b></button></div>
      <div className="shop-controls"><label className="shop-search"><Search size={19} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar productos, categorías…" aria-label="Buscar productos" /></label><label className="shop-sort"><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar productos"><option value="featured">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre</option></select></label></div>
      {!!products.length && <div className="shop-categories" role="group" aria-label="Filtrar por categoría">{categories.map((item) => <button key={item} type="button" className={item === category ? 'active' : ''} aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>}
      <div className="shop-results" aria-live="polite">{!loading && !error && !!products.length && `${visibleProducts.length} ${visibleProducts.length === 1 ? 'producto' : 'productos'}`}</div>
      {loading ? <div className="shop-loading" role="status"><div className="shop-loader" /><p>Cargando catálogo…</p></div> : error ? <div className="shop-empty" role="alert"><PackageSearch size={47} /><h3>El catálogo no está disponible</h3><p>{error}</p><button type="button" className="shop-outline-button" onClick={() => setRefresh((value) => value + 1)}>Reintentar <RotateCw size={16} /></button></div> : !products.length ? <div className="shop-empty"><HeartPulse size={47} /><h3>Estamos preparando el catálogo</h3><p>GRCP está revisando los productos antes de publicarlos. Volvé pronto o escribinos para consultar lo que necesitás.</p><a className="shop-outline-button" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Hablar con GRCP <ArrowRight size={16} /></a></div> : !visibleProducts.length ? <div className="shop-empty"><Search size={43} /><h3>No encontramos productos</h3><p>Probá con otra búsqueda o elegí una categoría diferente.</p><button type="button" className="shop-outline-button" onClick={() => { setQuery(''); setCategory('Todas'); }}>Ver todo el catálogo</button></div> : <div className="shop-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onSelect={openProduct} onAddToCart={addToCart} />)}</div>}
    </section>
    <section className="shop-help"><div className="shop-container"><HeartPulse size={34} /><div><h2>¿Necesitás ayuda para elegir?</h2><p>Contanos qué equipamiento buscás y te orientamos personalmente.</p></div><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">Hablar con GRCP <ArrowRight size={18} /></a></div></section>
    <ProductModal product={selected} onClose={closeProduct} onAddToCart={addToCart} />
    <CartSidebar isOpen={cartOpen} onClose={closeCart} cart={cartLines} removeFromCart={(id) => setCart((current) => current.filter((row) => row.id !== id))} updateQuantity={updateQuantity} handleWhatsAppOrder={sendInquiry} checking={checking} />
    <ToastContainer position="bottom-right" autoClose={3500} />
  </div>;
}

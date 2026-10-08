import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, HeartPulse, ShieldCheck, X } from 'lucide-react';
import { formatShopPrice, shopCanOrder, shopCover, shopDiscountPercent, shopPrice, shopStockLabel } from '../../lib/shopCatalog';

export default function ProductModal({ product, onClose, onAddToCart }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => { setImageIndex(0); }, [product?.id]);
  useEffect(() => {
    if (!product) return;
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...(dialogRef.current?.querySelectorAll('button:not(:disabled),a[href]') || [])];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.(); };
  }, [product, onClose]);
  if (!product) return null;
  const images = product.images?.length ? product.images : shopCover(product) ? [{ url: shopCover(product), alt_text: product.name }] : [];
  const image = images[imageIndex] || images[0];
  const available = shopCanOrder(product);
  const discount = shopDiscountPercent(product);
  return <div className="shop-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="shop-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="shop-product-title">
      <button ref={closeRef} type="button" className="shop-modal-close" onClick={onClose} aria-label="Cerrar detalle"><X size={21} /></button>
      <div className="shop-modal-gallery">
        <div className="shop-modal-image">{image ? <img src={image.url} alt={image.alt_text || product.name} /> : <span className="shop-image-placeholder"><HeartPulse size={64} strokeWidth={1.2} /><small>GRCP Argentina</small></span>}</div>
        {images.length > 1 && <div className="shop-modal-thumbs" aria-label="Fotos del producto">{images.map((item, index) => <button key={item.id || index} type="button" className={index === imageIndex ? 'active' : ''} onClick={() => setImageIndex(index)} aria-label={`Ver foto ${index + 1}`} aria-pressed={index === imageIndex}><img src={item.url} alt="" /></button>)}</div>}
      </div>
      <div className="shop-modal-info">
        <span className="shop-eyebrow">{product.category}</span>
        <h2 id="shop-product-title">{product.name}</h2>
        <span className={available ? 'shop-stock available' : 'shop-stock'}>{shopStockLabel(product)}</span>
        {product.summary && <p className="shop-modal-summary">{product.summary}</p>}
        {product.description && <div className="shop-modal-description"><h3>Acerca de este producto</h3><p>{product.description}</p></div>}
        {product.sku && <p className="shop-modal-sku">Código: {product.sku}</p>}
        <div className="shop-modal-buy">
          {discount > 0 && <span className="shop-price-old">{formatShopPrice(product.price_cents)} <em>{discount}% menos</em></span>}
          <strong>{formatShopPrice(shopPrice(product))}</strong>
          <button type="button" className="shop-primary-button" onClick={() => { onAddToCart(product); onClose(); }} disabled={!available}>{available ? <>Agregar al carrito <ArrowRight size={18} /></> : 'Sin stock por ahora'}</button>
          <small><ShieldCheck size={16} /> Coordinás la compra con GRCP por WhatsApp. No se cobra en el sitio.</small>
        </div>
      </div>
    </section>
  </div>;
}

ProductModal.propTypes = { product: PropTypes.object, onClose: PropTypes.func.isRequired, onAddToCart: PropTypes.func.isRequired };

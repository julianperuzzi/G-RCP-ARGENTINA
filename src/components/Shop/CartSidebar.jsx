import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ArrowRight, HeartPulse, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatShopPrice, shopCover, shopPrice, shopStockLimit } from '../../lib/shopCatalog';

export default function CartSidebar({ isOpen, onClose, cart, removeFromCart, updateQuantity, handleWhatsAppOrder, checking }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...(panelRef.current?.querySelectorAll('button:not(:disabled),a[href]') || [])];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.(); };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const units = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + shopPrice(item) * item.quantity, 0);
  return <div className="shop-cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <aside className="shop-cart" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="shop-cart-title">
      <div className="shop-cart-header"><div><span className="shop-eyebrow">TU SELECCIÓN</span><h2 id="shop-cart-title">Mi carrito <small>{units}</small></h2></div><button ref={closeRef} type="button" onClick={onClose} className="shop-cart-close" aria-label="Cerrar carrito"><X size={22} /></button></div>
      <div className="shop-cart-items">
        {!cart.length ? <div className="shop-cart-empty"><ShoppingBag size={42} strokeWidth={1.4} /><h3>Tu carrito está vacío</h3><p>Explorá el catálogo y elegí los productos que te interesan.</p><button type="button" className="shop-outline-button" onClick={onClose}>Explorar productos <ArrowRight size={16} /></button></div> : cart.map((item) => <article key={item.id} className="shop-cart-item">
          <div className="shop-cart-item-image">{shopCover(item) ? <img src={shopCover(item)} alt="" /> : <HeartPulse size={25} />}</div>
          <div className="shop-cart-item-details"><span>{item.category}</span><h3>{item.name}</h3><strong>{formatShopPrice(shopPrice(item))}</strong><div className="shop-cart-quantity"><button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label={`Restar ${item.name}`} disabled={item.quantity <= 1}><Minus size={15} /></button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label={`Sumar ${item.name}`} disabled={item.quantity >= shopStockLimit(item)}><Plus size={15} /></button></div></div>
          <button type="button" className="shop-cart-remove" onClick={() => removeFromCart(item.id)} aria-label={`Quitar ${item.name}`}><Trash2 size={17} /></button>
        </article>)}
      </div>
      {!!cart.length && <div className="shop-cart-footer"><div className="shop-cart-total"><span>Total estimado</span><strong>{formatShopPrice(total)}</strong></div><p>Confirmaremos disponibilidad, entrega e importe final al conversar por WhatsApp.</p><button type="button" className="shop-primary-button" onClick={handleWhatsAppOrder} disabled={checking}>{checking ? 'Comprobando precios y stock…' : <>Consultar pedido por WhatsApp <ArrowRight size={18} /></>}</button><small>No se realiza ningún pago en este sitio.</small></div>}
    </aside>
  </div>;
}

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired, cart: PropTypes.array.isRequired,
  removeFromCart: PropTypes.func.isRequired, updateQuantity: PropTypes.func.isRequired,
  handleWhatsAppOrder: PropTypes.func.isRequired, checking: PropTypes.bool.isRequired,
};

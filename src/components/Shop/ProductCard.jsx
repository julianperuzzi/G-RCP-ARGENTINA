import PropTypes from 'prop-types';
import { ArrowUpRight, HeartPulse, Plus } from 'lucide-react';
import { formatShopPrice, shopCanOrder, shopCover, shopDiscountPercent, shopPrice, shopStockLabel } from '../../lib/shopCatalog';

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const image = shopCover(product);
  const discount = shopDiscountPercent(product);
  const available = shopCanOrder(product);
  return <article className="shop-card">
    <button type="button" className="shop-card-visual" onClick={() => onSelect(product)} aria-label={`Ver detalles de ${product.name}`}>
      {image ? <img src={image} alt={product.images?.[0]?.alt_text || product.name} loading="lazy" /> : <span className="shop-image-placeholder"><HeartPulse size={48} strokeWidth={1.35} /><small>GRCP Argentina</small></span>}
      {discount > 0 && <span className="shop-offer-tag">-{discount}%</span>}
      {product.featured && <span className="shop-feature-tag">DESTACADO</span>}
      <span className="shop-image-action">Ver producto <ArrowUpRight size={16} /></span>
    </button>
    <div className="shop-card-content">
      <div className="shop-card-meta"><span>{product.category}</span><span className={available ? 'shop-stock available' : 'shop-stock'}>{shopStockLabel(product)}</span></div>
      <h2>{product.name}</h2>
      <p>{product.summary || product.description || 'Consultá los detalles y hacenos tu pedido.'}</p>
      <div className="shop-card-bottom">
        <div className="shop-card-price"><strong>{formatShopPrice(shopPrice(product))}</strong>{discount > 0 && <s>{formatShopPrice(product.price_cents)}</s>}</div>
        <button type="button" className="shop-add-button" onClick={() => onAddToCart(product)} disabled={!available} aria-label={available ? `Agregar ${product.name} al carrito` : `${product.name} sin stock`}>
          <Plus size={21} />
        </button>
      </div>
    </div>
  </article>;
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

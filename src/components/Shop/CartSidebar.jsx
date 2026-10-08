import { ShoppingCart, Minus, Plus, X, Shield, Phone } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';
import { sellingPrice, stockLimit } from '../../lib/shopCatalog';

export default function CartSidebar({ isOpen, onClose, cart, removeFromCart, updateQuantity, handleWhatsAppOrder }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement;
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { onClose(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...panelRef.current.querySelectorAll('button:not(:disabled),a[href]')];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown); previousFocus?.focus?.(); };
  }, [isOpen, onClose]);
  const total = cart.reduce((sum, item) => {
    const price = sellingPrice(item);
    return sum + price * item.quantity;
  }, 0);
  if (!isOpen) return null;

  return (
    <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="cart-title" className="fixed inset-y-0 right-0 w-full sm:w-1/2 max-w-xl bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-2xl z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b px-8 py-6 flex justify-between items-center bg-white/80 backdrop-blur-lg">
          <h2 id="cart-title" className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-green-500" />
            Carrito
          </h2>
          <button ref={closeRef} onClick={onClose} className="text-gray-500 hover:text-red-500" aria-label="Cerrar carrito">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-20 h-20 mb-4 text-gray-300" />
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-2">Agrega productos para comenzar tu pedido.</p>
            </div>
          ) : (
            cart.map((item) => {
              const price = sellingPrice(item);
              return (
                <div key={item.id} className="flex gap-4 bg-white/80 p-4 rounded-xl mb-4 shadow hover:shadow-lg transition-all">
                  <img src={item.img_url} alt={item.nombre} className="w-20 h-20 object-cover rounded-xl border border-gray-200" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-blue-700 text-lg">{item.nombre}</h3>
                      <p className="text-green-600 font-bold text-base">${price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                        aria-label={`Restar ${item.nombre}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-full p-1"
                        aria-label={`Sumar ${item.nombre}`}
                        disabled={item.quantity >= stockLimit(item.stock)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-100 rounded-full p-1 self-start" aria-label={`Eliminar ${item.nombre}`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-8 py-6 space-y-4 bg-white/80 backdrop-blur-lg">
            <div className="flex justify-between font-bold text-xl">
              <span>Total:</span>
              <span className="text-green-600">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 flex items-center justify-center gap-3 text-lg font-bold shadow-lg transition-all"
            >
              <Phone className="w-5 h-5" /> Enviar pedido por WhatsApp
            </button>
            <div className="text-center text-xs text-gray-500 mt-2">
              <Shield className="w-4 h-4 inline mr-1" /> El pedido se confirma por WhatsApp; no se cobra en esta página.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

CartSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  cart: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    img_url: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    descuento: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateQuantity: PropTypes.func.isRequired,
  handleWhatsAppOrder: PropTypes.func.isRequired,
};

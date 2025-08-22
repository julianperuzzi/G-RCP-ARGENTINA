import { ShoppingCart, Minus, Plus, X, Shield, Phone } from "lucide-react";

export default function CartSidebar({ isOpen, onClose, cart, removeFromCart, updateQuantity, handleWhatsAppOrder }) {
  const total = cart.reduce((sum, item) => {
    const price = item.descuento && item.descuento !== "" ? parseFloat(item.descuento) : parseFloat(item.precio);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform z-50 ${
      isOpen ? "translate-x-0" : "translate-x-full"
    }`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Carrito</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => {
              const price = item.descuento && item.descuento !== "" ? parseFloat(item.descuento) : parseFloat(item.precio);
              return (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg mb-3">
                  <img src={item.img_url} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.nombre}</h4>
                    <p className="text-green-600 font-bold">${price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t px-6 py-4 space-y-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${total.toLocaleString()}</span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Enviar por WhatsApp
            </button>
            <div className="text-center text-xs text-gray-500">
              <Shield className="w-4 h-4 inline" /> Compra segura
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

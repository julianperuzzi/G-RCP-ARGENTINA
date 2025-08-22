import { useState } from "react";
import { Minus, Plus, X, Package, Truck } from "lucide-react";

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);
  if (!isOpen || !product) return null;

  const isOutOfStock = parseInt(product.stock) === 0;
  const maxStock = parseInt(product.stock);
  const hasDiscount = product.descuento && product.descuento !== "";
  const finalPrice = hasDiscount ? parseFloat(product.descuento) : parseFloat(product.precio);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Detalles del Producto</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Imagen */}
          <div className="relative">
            <img
              src={product.img_url}
              alt={product.nombre}
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>

          {/* Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{product.nombre}</h3>
            <p className="text-gray-600">{product.descripcion}</p>
            <p className="text-sm text-gray-700">{product.especificaciones}</p>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <Package className="w-4 h-4" /> Stock: {product.stock}
              <Truck className="w-4 h-4 text-green-600" /> Envío gratis
            </div>

            <div className="text-2xl font-bold text-green-600">
              ${finalPrice.toLocaleString()}
            </div>

            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}>
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-3 rounded-lg font-medium ${
                isOutOfStock
                  ? "bg-gray-300 text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

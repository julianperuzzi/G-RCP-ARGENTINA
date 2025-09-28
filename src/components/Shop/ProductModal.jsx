import { useEffect } from "react";
import { X, Package, Truck, AlertTriangle, Tag, Plus } from "lucide-react";

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  // Reset error cuando cambia el producto
  useEffect(() => {}, [product]);

  if (!isOpen || !product) return null;

  const isOutOfStock = parseInt(product.stock) === 0;
  const hasDiscount = product.descuento && product.descuento !== "" && !isNaN(parseFloat(product.descuento));
  const finalPrice = hasDiscount ? parseFloat(product.descuento) : parseFloat(product.precio);
  const originalPrice = parseFloat(product.precio);
  const discountPercentage = hasDiscount ? Math.round((1 - finalPrice / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      onAddToCart(product, 1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-blue-100 animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-2xl font-extrabold text-blue-700 flex items-center gap-2">
            {hasDiscount && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow">
                <Tag className="w-4 h-4" /> Oferta
              </span>
            )}
            {product.nombre}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 grid md:grid-cols-2 gap-10 items-center">
          {/* Imagen */}
          <div className="relative group flex items-center justify-center">
            <img
              src={product.img_url}
              alt={product.nombre}
              className="w-full h-72 md:h-80 object-cover rounded-2xl shadow-xl border-2 border-blue-100 group-hover:scale-[1.03] transition-transform duration-300"
            />
            {hasDiscount && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold shadow-lg">
                -{discountPercentage}%
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-2xl">
                <span className="text-white font-bold text-xl">Sin Stock</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-700 mb-2 text-base font-medium">{product.descripcion}</p>
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-xl">{product.especificaciones}</p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" /> 
                <span className={isOutOfStock ? "text-red-500 font-bold" : "text-gray-700"}>
                  Stock: {product.stock}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" /> 
                <span className="text-green-600 font-semibold">Envío gratis</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-4xl font-extrabold text-green-600 drop-shadow">
                ${finalPrice.toLocaleString()}
              </div>
              {hasDiscount && (
                <div className="text-gray-400 line-through text-lg">
                  ${originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Botón agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg
                ${isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"}
              `}
            >
              {isOutOfStock ? (
                <>
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Sin Stock
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

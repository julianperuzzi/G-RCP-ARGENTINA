import { Plus, Package, Star } from "lucide-react";

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const isOutOfStock = parseInt(product.stock) === 0;
  const hasDiscount = product.descuento && product.descuento !== "";
  const finalPrice = hasDiscount ? parseFloat(product.descuento) : parseFloat(product.precio);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.precio) - parseFloat(product.descuento)) / parseFloat(product.precio)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img
          src={product.img_url}
          alt={product.nombre}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{discountPercent}%
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Sin Stock</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
          <Package className="w-3 h-3 inline mr-1" />
          Stock: {product.stock}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">{product.nombre}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.descripcion}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-sm">${parseFloat(product.precio).toLocaleString()}</span>
                <span className="text-green-600 font-bold text-lg">${finalPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-lg">${finalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onSelect(product)}
            className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => onAddToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

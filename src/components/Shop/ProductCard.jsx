import { Plus, Package, Star } from "lucide-react";

export default function ProductCard({ product, onSelect, onAddToCart }) {
  const isOutOfStock = parseInt(product.stock) === 0;
  const hasDiscount = product.descuento && product.descuento !== "";
  const finalPrice = hasDiscount ? parseFloat(product.descuento) : parseFloat(product.precio);
  const discountPercent = hasDiscount
    ? Math.round(((parseFloat(product.precio) - parseFloat(product.descuento)) / parseFloat(product.precio)) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col relative">
      <div className="relative">
        <img
          src={product.img_url}
          alt={product.nombre}
          className="w-full h-56 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
        />
        {hasDiscount && (
          <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <span>Oferta</span>
            <span className="ml-1">-{discountPercent}%</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-t-2xl">
            <span className="text-white font-bold text-lg">Sin Stock</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs shadow flex items-center gap-1 border border-gray-200">
          <Package className="w-4 h-4 inline mr-1" />
          <span className="font-semibold">Stock: {product.stock}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-extrabold text-lg text-gray-900 mb-1 line-clamp-2">{product.nombre}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.descripcion}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-base">${parseFloat(product.precio).toLocaleString()}</span>
                <span className="text-green-600 font-bold text-xl">${finalPrice.toLocaleString()}</span>
              </>
            ) : (
              <span className="text-blue-700 font-bold text-xl">${finalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onSelect(product)}
            className="flex-1 px-3 py-2 border border-orange-400 text-white rounded-lg hover:bg-orange-500 bg-orange-400 transition-colors text-sm font-semibold"
          >
            Ver Detalles
          </button>
          <button
            onClick={() => onAddToCart(product, 1)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center justify-center gap-1 transition-all
              ${isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-400 active:scale-95"}
            `}
            aria-label="Agregar al carrito"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

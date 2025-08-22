import React, { useState } from "react";

export default function ProductDetail({ product, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div className="border p-4 rounded-lg shadow">
      <img src={product.img_url} alt={product.nombre} className="w-full h-64 object-cover rounded mb-4" />
      <h2 className="text-2xl font-bold">{product.nombre}</h2>
      <p className="mt-2">{product.descripcion}</p>
      <p className="mt-2 text-gray-700 font-medium">{product.especificaciones}</p>
      <div className="flex items-center gap-4 mt-2">
        {product.descuento ? (
          <>
            <span className="line-through text-gray-400">${product.precio}</span>
            <span className="text-green-600 font-bold">${product.descuento}</span>
          </>
        ) : <span className="font-bold">${product.precio}</span>}
      </div>
      <div className="flex items-center mt-4 gap-2">
        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="w-16 border rounded p-1" />
        <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

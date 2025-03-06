

import React from 'react';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
        <button
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
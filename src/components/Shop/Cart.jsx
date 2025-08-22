import React from "react";

export default function Cart({ cart, removeFromCart, handleWhatsAppOrder }) {
  const total = cart.reduce((sum, p) => sum + (p.descuento || p.precio) * p.quantity, 0);

  return (
    <div className="mt-8 border-t pt-4">
      <h2 className="text-2xl font-bold mb-2">Carrito</h2>
      {cart.length === 0 ? <p className="text-gray-500">El carrito está vacío</p> : (
        <>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center mb-2">
              <span>{item.nombre} x {item.quantity}</span>
              <span>${(item.descuento || item.precio) * item.quantity}</span>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500">X</button>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>${total}</span>
          </div>
          <button onClick={handleWhatsAppOrder} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full">
            Enviar Pedido por WhatsApp
          </button>
        </>
      )}
    </div>
  );
}

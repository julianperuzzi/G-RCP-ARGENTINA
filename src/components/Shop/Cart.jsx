import React from 'react';
import { FaPlus, FaMinus, FaWhatsapp } from 'react-icons/fa'; // Iconos de React Icons

const Cart = ({ cart, removeFromCart, updateQuantity }) => {
  // Calcular el total basado en las cantidades
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Función para enviar el carrito por WhatsApp
  const sendCartViaWhatsApp = () => {
    const phoneNumber = '5492645636968'; // Número de teléfono en formato internacional
    const message = `¡Hola! Quiero realizar la siguiente compra:\n\n${cart
      .map(
        (item) =>
          `- ${item.name} (Cantidad: ${item.quantity}) - $${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join('\n')}\n\n*Total: $${total.toFixed(2)}*`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-gray-700">El carrito está vacío.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-700">${item.price.toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                >
                  <FaMinus />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="text-lg font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-600"
              >
                Eliminar
              </button>
            </div>
          ))}
          <div className="border-t pt-4">
            <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
            <button
              onClick={sendCartViaWhatsApp}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
            >
              <FaWhatsapp className="mr-2" />
              Enviar pedido por WhatsApp
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
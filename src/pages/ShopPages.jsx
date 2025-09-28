import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ShoppingCart, Package, Search } from "lucide-react";
import ProductCard from "../components/Shop/ProductCard";
import ProductModal from "../components/Shop/ProductModal";
import CartSidebar from "../components/Shop/CartSidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvpq02Wi3p_u4SMi9C1FBZ_yozKV8rqno8XX-3jzsD3TKD7bAQKntkci1wwrQgnxP3Rv99REuusbUL/pub?gid=0&single=true&output=csv";
const WHATSAPP_NUMBER = "+5492645667981";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar productos
  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (results) => {
        setProducts(results.data);
        setFilteredProducts(results.data);
        setLoading(false);
      },
    });
  }, []);

  // Filtrar
  useEffect(() => {
    setFilteredProducts(
      products.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, products]);

  // Carrito
  const addToCart = (product, qty = 1) => {
    const exist = cart.find((i) => i.id === product.id);
    if (exist) {
      setCart(
        cart.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + qty } : i
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    // Mostrar mensaje de confirmación
    toast.success(`¡${product.nombre} agregado al carrito!`, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };
  const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));
  const updateQuantity = (id, q) =>
    setCart(cart.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, q) } : i)));

  const handleWhatsAppOrder = () => {
    const total = cart.reduce((s, i) => {
      const price = i.descuento && i.descuento !== "" ? parseFloat(i.descuento) : parseFloat(i.precio);
      return s + price * i.quantity;
    }, 0);

    const message = cart
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.nombre} (x${i.quantity}) - $${i.precio}`
      )
      .join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Pedido:\n${message}\n\nTOTAL: $${total}`
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-slate-900">
      {/* Header mejorado */}
      <header className="bg-white/90 shadow-lg sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight flex items-center gap-2">
            <span className="text-blue-600">Mi</span> Tienda Online
          </h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-3 rounded-full shadow transition-all duration-200
              ${cart.length > 0 ? "bg-green-500 animate-[pulse_0.7s_ease-in-out]" : "bg-blue-600 hover:bg-blue-700"}
            `}
            aria-label="Abrir carrito"
            style={{ boxShadow: cart.length > 0 ? "0 0 0 6px #22c55e33" : undefined }}
          >
            <ShoppingCart size={28} className={`${cart.length > 0 ? "text-white drop-shadow-lg" : "text-white"}`} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-bounce border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
          </div>
        </div>
      </header>

      {/* Main con loading mejorado */}
      <main className="max-w-7xl mx-auto px-2 md:px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <span className="text-blue-700 font-semibold">Cargando productos...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={setSelectedProduct}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Package className="w-16 h-16 mx-auto text-blue-200 mb-4" />
            <p className="text-xl text-blue-700 font-semibold">No se encontraron productos</p>
            <p className="text-blue-400 mt-2">Intenta con otra búsqueda</p>
          </div>
        )}
      </main>

      {/* Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {/* Carrito */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        handleWhatsAppOrder={handleWhatsAppOrder}
      />

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

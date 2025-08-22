import { useEffect, useState } from "react";
import Papa from "papaparse";
import { ShoppingCart, Package } from "lucide-react";
import ProductCard from "../components/Shop/ProductCard";
import ProductModal from "../components/Shop/ProductModal";
import CartSidebar from "../components/Shop/CartSidebar";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvpq02Wi3p_u4SMi9C1FBZ_yozKV8rqno8XX-3jzsD3TKD7bAQKntkci1wwrQgnxP3Rv99REuusbUL/pub?output=csv";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tienda Online</h1>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-blue-600 text-white rounded-lg"
          >
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </button>
        </div>
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center">Cargando productos...</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p>No se encontraron productos</p>
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}

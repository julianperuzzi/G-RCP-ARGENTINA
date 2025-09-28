import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaMapMarkerAlt, FaPlus, FaTimes, FaCheckCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MapaDEA = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ubicacionDEA, setUbicacionDEA] = useState('');
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out' });
  }, []);

  const abrirWhatsApp = () => {
    if (!ubicacionDEA.trim()) {
      alert('Por favor, ingresa la ubicación del DEA.');
      return;
    }
    const mensaje = `Hola, te contacto para informarte sobre la ubicación de un DEA. La dirección es: *${ubicacionDEA}*. Agradezco tu atención. Saludos.`;
    const numero = '5492645636968';
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    setMensajeEnviado(true);
    setUbicacionDEA('');
    setTimeout(() => setMensajeEnviado(false), 4000); // Oculta el mensaje después de 4s
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-start px-4 py-8">
      {/* Header tipo Uber */}
      <header className="w-full flex items-center justify-between mb-8 px-2 max-w-4xl">
        <h1
          className="text-4xl font-extrabold text-gray-900 flex items-center gap-2"
          data-aos="fade-down"
        >
          <FaMapMarkerAlt className="text-orange-500 animate-bounce" />
          DEAs en Argentina
        </h1>
        <button
          className={`rounded-full p-3 shadow-lg transition-all duration-300 ${mostrarFormulario ? 'bg-gray-200' : 'bg-orange-500 hover:bg-orange-600'} text-white`}
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          aria-label={mostrarFormulario ? 'Cerrar formulario' : 'Agregar DEA'}
        >
          {mostrarFormulario ? <FaTimes className="text-xl text-orange-500" /> : <FaPlus className="text-xl" />}
        </button>
      </header>

      {/* Mapa con efecto glass */}
      <div
        className="rounded-3xl overflow-hidden shadow-2xl mb-10 border border-orange-200 bg-white bg-opacity-70 backdrop-blur-lg max-w-6xl w-full"
        data-aos="fade-up"
        style={{ height: '75vh' }} // Aumenta la altura del contenedor
      >
        <iframe
          title="Mapa de Desfibriladores"
          src="https://www.google.com/maps/d/u/0/embed?mid=1kjiWpPktBA6XDvOoF_z9Ulabi1uBR6I&ehbc=2E312F&noprof=1"
          style={{ border: 0, width: '100%', height: '100%' }} // El iframe ocupa todo el contenedor
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
          className="w-full h-full"
        />
      </div>

      {/* CTA para agregar DEA */}
      {!mostrarFormulario && (
        <div className="text-center mb-8" data-aos="fade-up">
          <p className="text-lg text-gray-700 mb-2 font-medium">
            ¿Conoces la ubicación de un DEA? ¡Compártela y ayuda a salvar vidas!
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 text-lg"
            onClick={() => setMostrarFormulario(true)}
          >
            <FaPlus className="inline mr-2" />
            Agregar DEA
          </button>
        </div>
      )}

      {/* Formulario flotante tipo Uber */}
      {mostrarFormulario && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          style={{ animation: 'fadeIn 0.3s' }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            data-aos="zoom-in"
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-orange-500 text-2xl"
              onClick={() => setMostrarFormulario(false)}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" />
              Agregar ubicación de DEA
            </h2>
            <form>
              <label className="block mb-6">
                <span className="text-gray-700 font-semibold">
                  Dirección exacta o referencia del DEA:
                </span>
                <input
                  type="text"
                  value={ubicacionDEA}
                  onChange={(e) => setUbicacionDEA(e.target.value)}
                  className="block w-full mt-2 p-3 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500 text-lg"
                  placeholder="Ej: Av. Libertador 123 norte, Capital, San Juan"
                  required
                  autoFocus
                />
              </label>
              <button
                type="button"
                onClick={abrirWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center w-full transition duration-300 text-lg shadow-md"
              >
                <FaWhatsapp className="mr-2 text-xl" />
                Enviar por WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mensaje de éxito flotante */}
      {mensajeEnviado && (
        <div
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-100 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50"
          data-aos="fade-up"
        >
          <FaCheckCircle className="text-green-500 text-2xl" />
          <span className="font-semibold">
            ¡Gracias por compartir la ubicación del DEA!
          </span>
        </div>
      )}
    </div>
  );
};

export default MapaDEA;
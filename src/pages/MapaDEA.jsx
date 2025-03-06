import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa'; // Iconos de React Icons
import AOS from 'aos';
import 'aos/dist/aos.css'; // Animaciones al hacer scroll

const MapaDEA = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ubicacionDEA, setUbicacionDEA] = useState('');
  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  // Inicializar AOS para animaciones
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Función para abrir WhatsApp con el mensaje predefinido
  const abrirWhatsApp = () => {
    if (!ubicacionDEA.trim()) {
      alert('Por favor, ingresa la ubicación del DEA.');
      return;
    }

    const mensaje = `Hola, te contacto para informarte sobre la ubicación de un DEA. La dirección es: *${ubicacionDEA}*. Agradezco tu atención. Saludos.`;
    const numero = '5492645636968'; // Número de teléfono en formato internacional

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
    setMensajeEnviado(true);
    setUbicacionDEA('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título Principal */}
      <h1
        className="text-4xl font-bold text-center mt-8 mb-6"
        data-aos="fade-down"
      >
        Geolocalización de DEAs en Argentina{' '}
        <FaMapMarkerAlt className="inline text-orange-500" />
      </h1>

      {/* Mapa de DEAs */}
      <div
        className="rounded-lg overflow-hidden shadow-lg mb-8"
        data-aos="fade-up"
      >
        <iframe
          title="Mapa de Desfibriladores"
          src="https://www.google.com/maps/d/u/0/embed?mid=1kjiWpPktBA6XDvOoF_z9Ulabi1uBR6I&ehbc=2E312F&noprof=1"
          style={{ border: 0 }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
          className="w-full h-[60vh]"
        />
      </div>

      {/* Sección para agregar DEA */}
      <div className="text-center mb-8" data-aos="fade-up">
        <p className="text-lg text-gray-700 mb-4">
          Si tienes información sobre otro DEA, ¡compártela con nosotros!
        </p>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? 'Ocultar formulario' : 'Agregar DEA'}
        </button>
      </div>

      {/* Formulario para agregar la ubicación del DEA */}
      {mostrarFormulario && (
        <div
          className="bg-gray-100 p-6 rounded-lg shadow-md mx-auto max-w-2xl"
          data-aos="fade-up"
        >
          <form>
            <label className="block mb-4">
              <span className="text-gray-700 font-semibold">
                Ubicación del DEA:
              </span>
              <input
                type="text"
                value={ubicacionDEA}
                onChange={(e) => setUbicacionDEA(e.target.value)}
                className="block w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ingresa la dirección del DEA"
                required
              />
            </label>
            <button
              type="button"
              onClick={abrirWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center w-full transition duration-300"
            >
              <FaWhatsapp className="mr-2" />
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* Mensaje de éxito */}
      {mensajeEnviado && (
        <div
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mt-6 rounded-lg mx-auto max-w-2xl"
          data-aos="fade-up"
        >
          <p>¡Gracias por compartir la ubicación del DEA! Nos pondremos en contacto contigo pronto.</p>
        </div>
      )}
    </div>
  );
};

export default MapaDEA;
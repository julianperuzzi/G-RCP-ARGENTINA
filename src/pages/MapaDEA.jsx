import React, { useState } from 'react';

const MapaDEA = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ubicacionDEA, setUbicacionDEA] = useState('');

  // Función para abrir WhatsApp con el mensaje predefinido
  const abrirWhatsApp = () => {
    const mensaje = `Hola, te contacto para informarte sobre la ubicación de un DEA. La dirección es: ${ubicacionDEA}. Agradezco tu atención. Saludos.`;

    const numero = '5492645667981'; // Número de teléfono en formato internacional

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8 mb-6">Geolocalización de DEA en Argentina</h1>
      
      <iframe
        title="Mapa de Desfibriladores"
        src="https://www.google.com/maps/d/u/0/embed?mid=1kjiWpPktBA6XDvOoF_z9Ulabi1uBR6I&ehbc=2E312F&noprof=1"
        width="90%"
        height="500"
        style={{ border: 0 }}
        allowFullScreen=""
        aria-hidden="false"
        tabIndex="0"
        className="mx-auto block"
      ></iframe>

      <button
        className="bg-orange-500 text-white font-bold py-2 px-4 my-4 ml-8"
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? 'Ocultar formulario' : 'Agregar DEA'}
      </button>

      {/* Formulario para agregar la ubicación del DEA */}
      {mostrarFormulario && (
        <form className="bg-gray-100 p-6 mb-6 mx-4">
          <label className="block mb-4">
            Ubicación del DEA:
            <input
              type="text"
              value={ubicacionDEA}
              onChange={(e) => setUbicacionDEA(e.target.value)}
              className="block w-full mt-1 p-3 border-gray-300  focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ingresa la ubicación del DEA"
            />
          </label>
          <button
            type="button"
            onClick={abrirWhatsApp}
            className="bg-green-500 text-white font-bold py-2 px-4 "
          >
            Enviar por WhatsApp
          </button>
        </form>
      )}
    </div>
  );
};

export default MapaDEA;

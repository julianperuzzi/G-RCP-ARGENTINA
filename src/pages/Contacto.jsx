import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'; // Importa el icono de WhatsApp

const Contacto = () => {
  const form = useRef();
  const [enviado, setEnviado] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_gdyf4jl', 'template_y0xgfug', form.current, {
        publicKey: '__jb6l56CCCKzd3nK',
      })
      .then(
        () => {
          console.log('SUCCESS!');
          setEnviado(true);
          setTimeout(() => {
            setEnviado(false);
            form.current.reset();
          }, 3000); // 5000 milliseconds = 5 seconds
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div className="container mx-auto py-8 relative px-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-center mb-6">Comunicate con Nosotros</h1>
      <div className="backdrop absolute top-0 left-0 w-full h-full bg-gray-600 bg-opacity-50 z-10" style={{ display: enviado ? 'block' : 'none' }}></div>
      {enviado && (
        <div className="mensaje-enviado absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-lime-400 p-6 rounded-md shadow-lg z-20">
          <p className="text-2xl text-white">¡Mensaje enviado correctamente!</p>
        </div>
      )}
      <form ref={form} onSubmit={sendEmail} className="max-w-md mx-auto relative z-0">
        <div className="mb-4">
          <label htmlFor="user_name" className="block text-gray-700 font-bold mb-2">Nombre</label>
          <input id="user_name" type="text" name="user_name" className="border border-gray-300 rounded-md py-2 px-4 w-full" required />
        </div>
        <div className="mb-4">
          <label htmlFor="user_email" className="block text-gray-700 font-bold mb-2">Correo electrónico</label>
          <input id="user_email" type="email" name="user_email" className="border border-gray-300 rounded-md py-2 px-4 w-full" required />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 font-bold mb-2">Mensaje</label>
          <textarea id="message" name="message" className="border border-gray-300 rounded-md py-2 px-4 w-full h-32" required></textarea>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md inline-flex items-center"> 
          Enviar Mensaje
        </button>
      </form>

      {/* Sección de contacto por WhatsApp */}
      <div className="text-center mt-8">
      <p className="mb-4 text-gray-700">o</p>
        <p className="mb-4 text-gray-700">¿Prefieres contactarnos por WhatsApp?</p>
        <a href="https://wa.me/+5492645667981" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md inline-block">
          <FontAwesomeIcon icon={faWhatsapp} className="mr-2" /> {/* Icono de WhatsApp */}
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Contacto;

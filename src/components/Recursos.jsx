import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Recursos = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="Recursos" className="px-4 py-4 mt-10 bg-gradient-to-r from-slate-900 to-gray-900 text-white shadow-2xl">
      <div className='lg:w-2/3 mx-auto lg:my-8 my-4' data-aos="fade-up">
        <h2 className="text-4xl text-center font-bold mb-16">Nuestros Recursos</h2>
      </div>

      <div className='lg:w-2/3 mx-auto lg:my-8 my-4' data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Aprende RCP con Nosotros</h2>
        <p className="text-lg mb-4 text-gray-300">Aprende las técnicas de Reanimación Cardiopulmonar (RCP) con nuestros contenidos.</p>
        <Link to="/rcp" className="bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 inline-block transition-all duration-300 ease-in-out shadow-lg">
          Aprende RCP
        </Link>
      </div>

      <div className='lg:w-2/3 mx-auto lg:my-8 my-4 border-t-2 border-gray-700 pt-4' data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Mapa de DEA Argentina</h2>
        <p className="text-lg mb-4 text-gray-300">Geolocaliza todos los DEA de Argentina</p>
        <Link to="/mapadea" className="bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 inline-block transition-all duration-300 ease-in-out shadow-lg">
          Mapa DEA ARG
        </Link>
      </div>

      <div className='lg:w-2/3 mx-auto lg:my-8 my-4 border-t-2 border-gray-700 pt-4' data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Biblioteca De Primeros Auxilios</h2>
        <p className="text-lg mb-4 text-gray-300">Aquí encontrarás toda la teoría necesaria para aprender primeros auxilios y cómo actuar en situaciones de emergencia.</p>
        <Link to="/Biblioteca" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 transition-all duration-300 ease-in-out shadow-lg">
          Explorar Biblioteca
        </Link>
      </div>

      <div className='lg:w-2/3 mx-auto lg:my-8 my-4 border-t-2 border-gray-700 pt-4' data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">Ritmo RCP</h2>
        <p className="text-lg mb-4 text-gray-300">Utiliza este recurso para practicar RCP, escuchando un tono o música para encontrar el ritmo correcto</p>
        <Link to="/practica-rcp" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 transition-all duration-300 ease-in-out shadow-lg">
          Ritmo RCP
        </Link>
      </div>
    </section>
  );
};

export default Recursos;
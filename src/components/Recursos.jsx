import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const recursosData = [
  {
    title: "Aprende RCP",
    description: "Aprende las técnicas de Reanimación Cardiopulmonar (RCP) con nuestros contenidos.",
    link: "/rcp",
    linkText: "Aprende RCP",
  },
  {
    title: "Mapa de DEA Argentina",
    description: "Geolocaliza todos los DEA de Argentina",
    link: "/mapadea",
    linkText: "Mapa DEA ARG",
  },
  {
    title: "Biblioteca De Primeros Auxilios",
    description: "Aquí encontrarás toda la teoría necesaria para aprender primeros auxilios y cómo actuar en situaciones de emergencia.",
    link: "/Biblioteca",
    linkText: "Explorar Biblioteca",
  },
  {
    title: "Ritmo RCP",
    description: "Utiliza este recurso para practicar RCP, escuchando un tono o música para encontrar el ritmo correcto",
    link: "/practica-rcp",
    linkText: "Ritmo RCP",
  },
  {
    title: "Galeria de Fotos",
    description: "Visita nuestras galeria de fotos, puedes descargar la foto que mas te guste",
    link: "/galeria",
    linkText: "Galeria",
  },
];

const Recursos = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section id="Recursos" className="px-4 py-4 mt-10 bg-gradient-to-r from-slate-800 to-gray-900 text-white shadow-2xl">
      <div className='lg:w-2/3 mx-auto lg:my-8 my-4' data-aos="fade-up">
        <h2 className="text-4xl text-center font-bold md:mb-20 mb-16 uppercase border-b-2 border-orange-200 pb-6">Recursos</h2>
      </div>

      {recursosData.map((recurso, index) => (
        <div
          key={index}
          className={`lg:w-2/3 mx-auto lg:my-8 my-4 ${index !== 0 ? 'border-t-2 border-gray-700 pt-4' : ''}`}
          data-aos="fade-right"
          data-aos-delay="300"
        >
          <h2 className="text-2xl font-bold mb-4">{recurso.title}</h2>
          <p className="text-lg mb-4 text-gray-300">{recurso.description}</p>
          <Link to={recurso.link} className="bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 inline-block transition-all duration-300 ease-in-out shadow-lg">
            {recurso.linkText}
          </Link>
        </div>
      ))}
    </section>
  );
};

export default Recursos;

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
  {
    title: "Juego Ritmo RCP",
    description: "Juega a practicar el ritmo de RCP",
    link: "/rcp-game",
    linkText: "Juego RCP",
  },
];

const Recursos = () => {
  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  return (
    <section id="Recursos" className="px-4 py-4 mt-10 bg-gradient-to-r from-slate-800 to-gray-900 text-white shadow-2xl min-h-screen  ">

      <div className='mx-auto md:my-8 my-4'>
        <h2 className="text-4xl text-center font-bold md:mb-0 mb-16 uppercase ">Recursos</h2>
      </div>

      <section className=' md:grid md:grid-cols-2 gap-4 md:w-10/12 md:mx-auto'>
      {recursosData.map((recurso, index) => (
        <div
          key={index}
          className="mx-auto my-2  md:w-10/12 border-b-2 border-gray-700 pb-4 mb-6 md:mb-0 "
          data-aos="fade-up"
          data-aos-delay={index * 50}
         
        >
          <h2 className="text-2xl font-bold md:mb-2 mb-4">{recurso.title}</h2>
          <p className="text-lg mb-2 text-gray-300">{recurso.description}</p>
          <Link to={recurso.link} className="bg-orange-400 hover:bg-black text-white font-bold py-1 px-3 inline-block transition-all duration-300 ease-in-out shadow-lg">
            {recurso.linkText}
          </Link>
        </div>
      ))}
      </section>
    </section>
  );
};

export default Recursos;

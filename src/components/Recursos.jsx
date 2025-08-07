import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const recursosData = [
  {
    title: "Aprende RCP",
    description: "Aprende las técnicas de Reanimación Cardiopulmonar (RCP) con nuestros contenidos interactivos y guías paso a paso.",
    link: "/Rcp",
    linkText: "Aprende RCP",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    bgColor: "bg-orange-500"
  },
  {
    title: "Mapa de DEA Argentina",
    description: "Geolocaliza todos los Desfibriladores Externos Automáticos (DEA) disponibles en el país.",
    link: "/Mapadea",
    linkText: "Explorar Mapa",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    bgColor: "bg-blue-500"
  },
  {
    title: "Biblioteca de Primeros Auxilios",
    description: "Accede a nuestra completa colección de recursos teóricos para aprender primeros auxilios y manejo de emergencias.",
    link: "/Biblioteca",
    linkText: "Explorar Biblioteca",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    bgColor: "bg-emerald-500"
  },
  {
    title: "Ritmo RCP",
    description: "Practica el ritmo correcto para RCP con nuestros metrónomos interactivos y guías musicales.",
    link: "/Practica-rcp",
    linkText: "Practicar Ritmo",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    bgColor: "bg-purple-500"
  },
  {
    title: "Galería de Fotos",
    description: "Explora nuestra colección visual de técnicas, equipos y situaciones de primeros auxilios.",
    link: "/Galeria",
    linkText: "Ver Galería",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    bgColor: "bg-pink-500"
  },
  {
    title: "Juego Ritmo RCP",
    description: "Aprende el ritmo correcto para RCP de forma divertida con nuestro juego interactivo.",
    link: "/Rcp-game",
    linkText: "Jugar Ahora",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bgColor: "bg-red-500"
  },
  {
    title: "Realidad Aumentada",
    description: "Experimenta nuestros innovadores recursos de Realidad Aumentada para aprendizaje inmersivo.",
    link: "/RA-Menu",
    linkText: "Explorar RA",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    bgColor: "bg-indigo-500"
  },
];

const Recursos = () => {
  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  return (
    <section id="Recursos" className="relative py-20 bg-gradient-to-br from-gray-900 to-slate-800 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]"></div>
        <div className="absolute top-20 -left-20 w-64 h-64 bg-orange-500 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-orange-400 uppercase">
              Herramientas de aprendizaje
            </span>
            <div className="w-16 h-1 bg-orange-500 mt-2 mx-auto"></div>
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            Explora Nuestros <span className="text-orange-400">Recursos</span>
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Accede a nuestra colección completa de herramientas interactivas para el aprendizaje de primeros auxilios y RCP.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recursosData.map((recurso, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl bg-gray-800 border border-gray-700 hover:border-orange-400 transition-all duration-300 shadow-lg hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-70"></div>
              
              <div className="relative p-6 h-full flex flex-col">
                <div className={`${recurso.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-6 text-white`}>
                  {recurso.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3">{recurso.title}</h3>
                <p className="text-gray-300 mb-6 flex-grow">{recurso.description}</p>
                
                <Link 
                  to={recurso.link} 
                  className="mt-auto inline-flex items-center px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 group-hover:translate-x-1"
                >
                  <span>{recurso.linkText}</span>
                  <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recursos;
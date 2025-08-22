import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Servicios = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-20 -left-20 w-64 h-64 bg-orange-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-black rounded-full opacity-5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Contenido de texto */}
          <div 
            className="lg:w-1/2 lg:pr-12 relative z-10 mb-12 lg:mb-0"
            data-aos="fade-right"
          >
            <div className="inline-block mb-4">
              <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
                Lo que ofrecemos
              </span>
              <div className="w-16 h-1 bg-orange-400 mt-1"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Soluciones de capacitación <span className="text-orange-500">a medida</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nuestros programas de formación en primeros auxilios y RCP están diseñados para adaptarse a las necesidades específicas de cada sector, garantizando el más alto nivel de preparación.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-orange-400">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Instituciones Educativas</h4>
                <p className="text-gray-600 text-sm">Programas adaptados para escuelas y universidades</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-orange-400">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Empresas</h4>
                <p className="text-gray-600 text-sm">Capacitación para entornos corporativos</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-orange-400">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Grupos Deportivos</h4>
                <p className="text-gray-600 text-sm">Especializados en emergencias deportivas</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border-l-4 border-orange-400">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Comunidad</h4>
                <p className="text-gray-600 text-sm">Talleres abiertos para el público general</p>
              </div>
            </div>
            
            <Link 
              to="/servicios" 
              className="inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <span>Explorar servicios</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Imagen */}
          <div 
            className="lg:w-1/2 relative"
            data-aos="fade-left"
            data-aos-delay="200"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <img 
                src="https://i.pinimg.com/1200x/be/b3/88/beb388165814bd96e119a64a6a1adf11.jpg" 
                alt="Capacitación en primeros auxilios" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-black/10"></div>
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Formación que salva vidas</h3>
                <p className="text-sm opacity-90">Certificaciones reconocidas nacionalmente</p>
              </div>
            </div>
            
            {/* Elementos decorativos */}
            <div className="hidden lg:block absolute -top-10 -right-10 w-32 h-32 bg-orange-400 rounded-full opacity-20 blur-xl"></div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-40 h-40 bg-black rounded-full opacity-10 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
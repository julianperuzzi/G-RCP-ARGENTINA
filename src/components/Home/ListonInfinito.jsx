import React from "react";
import Marquee from "react-fast-marquee";
import Imagen1 from "../../assets/liston clientes/1.png";
import Imagen2 from "../../assets/liston clientes/2.png";
import Imagen3 from "../../assets/liston clientes/3.png";
import Imagen4 from "../../assets/liston clientes/4.png";
import Imagen5 from "../../assets/liston clientes/5.png";
import Imagen6 from "../../assets/liston clientes/6.png";
import Imagen7 from "../../assets/liston clientes/7.png";
import Imagen8 from "../../assets/liston clientes/Liston de Marcas.png";
import Imagen9 from "../../assets/liston clientes/9.png";
import Imagen10 from "../../assets/liston clientes/10.png";
import Imagen11 from "../../assets/liston clientes/11.png";
import Imagen12 from "../../assets/liston clientes/Liston de Marcas (2).png";

const ListonInfinito = () => {
  const clientesTop = [Imagen1, Imagen2, Imagen3, Imagen4, Imagen5];
  const clientesBottom = [Imagen6, Imagen7, Imagen8, Imagen9, Imagen10, Imagen11, Imagen12];

  return (
    <section className="relative py-16 bg--white overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.05]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block mb-4">
            <span className="text-sm font-semibold tracking-wider text-orange-500 uppercase">
              Nuestros Aliados
            </span>
            <div className="w-16 h-1 bg-orange-400 mt-2 mx-auto"></div>
          </span>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-6">
            Instituciones que <span className="text-orange-500">confían</span> en nosotros
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Colaboramos con organizaciones líderes para llevar capacitación de calidad en primeros auxilios
          </p>
        </div>

        {/* Primer carrusel */}
        <div className="mb-8 relative group">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-20"></div>
          
          <Marquee 
            direction="right" 
            speed={40}
            gradient={false}
            pauseOnHover
            className="py-4"
          >
            {[...clientesTop, ...clientesTop].map((img, index) => (
              <div 
                key={`top-${index}`} 
                className="mx-6 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={img} 
                  alt={`Cliente ${index + 1}`} 
                  className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0" 
                />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Segundo carrusel */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-20"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-20"></div>
          
          <Marquee 
            direction="left" 
            speed={50}
            gradient={false}
            pauseOnHover
            className="py-4"
          >
            {[...clientesBottom, ...clientesBottom].map((img, index) => (
              <div 
                key={`bottom-${index}`} 
                className="mx-6 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={img} 
                  alt={`Cliente ${index + 6}`} 
                  className="h-16 md:h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0" 
                />
              </div>
            ))}
          </Marquee>
        </div>

        {/* Llamado a la acción */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">¿Quieres ser parte de nuestros aliados?</p>
          <button className="inline-flex items-center px-6 py-3 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300">
            <span>Contáctanos</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ListonInfinito;
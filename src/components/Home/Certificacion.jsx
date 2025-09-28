import React from 'react';
import { Link } from 'react-router-dom';

export const Certificacion = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-orange-400 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-96 h-96 bg-black rounded-full opacity-5 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-block mb-4">
            <span className="text-xs font-semibold tracking-wider text-orange-500 uppercase">
              Reconocimiento profesional
            </span>
            <div className="w-16 h-1 bg-orange-400 mt-2 mx-auto"></div>
          </span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Certificación <span className="text-orange-500">avalada</span> por expertos
          </h2>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Nuestros certificados representan el más alto estándar en formación de primeros auxilios y técnicas de rescate.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Contenido principal */}
            <div className="p-10 md:p-12 md:w-2/3">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center mr-6">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Certificación de Competencia</h3>
              </div>
              
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Garantizamos estándares de excelencia en formación para primeros auxilios, rescate y técnicas médicas. 
                Al obtener nuestra certificación, los participantes demuestran competencia validada por expertos en el campo, 
                reflejando nuestro compromiso con la seguridad y el bienestar.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Reconocimiento Nacional</p>
                </div>
                
               
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-orange-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-gray-700">Cumple con normativas vigentes</p>
                </div>
              </div>
              
              <Link 
                to="/Certificacion" 
                className="inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Conocer más sobre certificación</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            {/* Tarjeta de certificado (lado derecho) */}
            <div className="bg-gray-50 p-8 md:p-10 md:w-1/3 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-200">
              <div className="relative mb-8 w-full max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-orange-500 rounded-lg shadow-lg opacity-20 -rotate-1 -translate-y-1 translate-x-1"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-800 text-lg">Certificado de Finalización</h4>
                    <p className="text-sm text-gray-500 mt-1">Primeros Auxilios y RCP</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Fecha de emisión:</span>
                      <span className="font-medium">Al completar</span>
                    </div>
                    
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center">
                Ejemplo de certificado. Diseño real puede variar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
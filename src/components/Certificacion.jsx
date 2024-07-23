import React from 'react';
import logoFac from '../assets/img certificacion/Certificados  RCP Company (1).png';
import { Link } from 'react-router-dom';


export const Certificacion = () => {
  return (
    <section className="flex justify-center items-center md:shadow-2xl ">
      <div className="sm:flex lg:w-2/3 justify-right  items-center my-8">
        <div className="p-4">
          <h2 className="md:text-3xl text-2xl font-bold my-2 uppercase ">Capacitación con certificación</h2>
          <h3 className="text-xl font-bold mb-2">Entrega de Certificación</h3>
          <p className="text-gray-700 mb-2">Garantizamos estándares de excelencia en formación para primeros auxilios, rescate y técnicas médicas. Al obtener nuestra certificación, los participantes demuestran competencia validada por expertos en el campo, reflejando nuestro compromiso con la seguridad y el bienestar.</p>
          <Link to="/Certificacion" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Conocer más</Link>
          <div className='lg:w-1/3 mt-3 w-3/4 md:w-1/2 mx-auto'> {/* Añadí mx-auto para centrar la imagen */}
            {/* <img src={logoFac} alt="Logo de FAC"/> */}
          </div>
        </div>
      </div>
    </section>
  );
};

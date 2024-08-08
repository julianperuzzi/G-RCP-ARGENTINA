import React from 'react';

import { Link } from 'react-router-dom';

export const Certificacion = () => {
  return (
    <section className="flex flex-col justify-center  shadow-xl md:w-10/12 md:mx-auto p-6 bg-neutral-50 mt-4 min-h-[50vh] hover:scale-105 transition duration-300">

          <h2 className="text-4xl font-bold my-2 uppercase text-center ">Certificación</h2>
          <h3 className="text-xl font-bold mb-2 ">Entrega de Certificación</h3>
          <p className="text-gray-700 mb-2">Garantizamos estándares de excelencia en formación para primeros auxilios, rescate y técnicas médicas. Al obtener nuestra certificación, los participantes demuestran competencia validada por expertos en el campo, reflejando nuestro compromiso con la seguridad y el bienestar.</p>
          <Link to="/Certificacion" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 w-fit">Conocer más</Link>

    </section>
  );
};

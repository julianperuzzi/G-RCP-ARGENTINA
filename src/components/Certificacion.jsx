import React from 'react';
import imgCert from '../assets/7013436_currency_business_certification_certificate_finance_icon.svg';
import ListonInfinito from './ListonInfinito';
import logoFac from '../assets/logo fac.webp';

export const Certificacion = () => {
  return (
    <section className="flex justify-center items-center bg-slate-100 mb-4">
      <div className="sm:flex lg:w-2/3 justify-right  items-center mb-4">
        <div className="p-4">
          <h2 className="text-3xl font-bold mb-2">CERTIFICACION OFICIAL</h2>
          <h3 className="text-xl font-bold mb-2">Entrega de Certificación Oficial Avalada por Organismos Especializados</h3>
          <p className="text-gray-700 mb-2">Garantizamos estándares de excelencia en formación para primeros auxilios, rescate y técnicas médicas. Al obtener nuestra certificación, los participantes demuestran competencia validada por expertos en el campo, reflejando nuestro compromiso con la seguridad y el bienestar. Seguimos comprometidos en brindar capacitación de calidad para enfrentar cualquier emergencia con profesionalismo y compasión.</p>
          <a href="/enlace-a-mas-informacion" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Conocer más</a>
          <div className='lg:w-1/3 mt-3 w-80 mx-auto'> {/* Añadí mx-auto para centrar la imagen */}
            <img src={logoFac} alt="Logo de FAC"/>
          </div>
        </div>
      </div>
    </section>
  );
};

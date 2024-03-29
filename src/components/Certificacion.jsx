import React from 'react';
import imgCert from '../assets/7013436_currency_business_certification_certificate_finance_icon.svg';

export const Certificacion = () => {
  return (
    <section className='flex justify-center items-center bg-slate-100 mb-4'>
      <div className="sm:flex justify-center items-center mb-4">
        <div className="pr-4 p-4">
          <h2 className="text-3xl font-bold mb-2">CERTIFICACION OFICIAL</h2>
          <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt beatae placeat deserunt eaque velit doloribus maiores </p>
          <a href="/enlace-a-mas-informacion" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Conocer más</a>
        </div>
        <div className="md:w-1/3  text-center">
          <img src={imgCert} alt="alt" className="w-1/2 sm:w-full h-auto rounded-lg pb-0 mx-auto" />
        </div>
      </div>
    </section>
  );
};

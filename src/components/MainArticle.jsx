import React from 'react';
import imageDesktop from '../assets/imagen cuadrada.jpg';
import { Link } from 'react-router-dom';

export const MainArticle = () => {
  return (
    <section className='mb-4 container mx-auto relative'>
      <div className='relative flex justify-start items-center bg-AzulOscuro h-[500px] bg-cover bg-center' style={{ backgroundImage: `url(${imageDesktop})`}}>
        <div className='absolute flex flex-col text-white p-4 xl:px-28 items-start text-left'>
          <h1 className='text-[30px] font-bold sm:text-[40px] leading-none mb-5 w-3/4  '>
            G-RCP: Capacitación y Salvamento en Emergencias
          </h1>
          <Link to="/Nosotros" className='bg-SoftRed w-[150px] h-[40px] uppercase text-white hover:bg-black inline-block text-center py-2 mb-4'>
            Leer Más
          </Link>
          <p className=' md:text-xl'>
            Ofrecemos capacitación en RCP y protocolos de emergencia para instituciones públicas y privadas. En G-RCP, adaptamos nuestros programas a tus necesidades específicas para asegurar que tu equipo esté preparado para responder en situaciones críticas.
          </p>
        </div>
      </div>
    </section>
  );
}

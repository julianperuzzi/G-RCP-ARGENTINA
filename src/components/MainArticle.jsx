import React from 'react'
//selector de imagenes el de 641 es si la pantalla tiene como minimo 641 coloca cierta imagen
import imageDesktop from '../assets/imagen recatacngular.jpg'
import { Link } from 'react-router-dom';

export const MainArticle = () => {
  return (
    <section className='mb-12 lg:w-3/4'>

      <picture className='shadow-2xl'>
       <img src={imageDesktop} alt="imagen" />
      </picture>

    <div className=' sm:flex'>

      <div className='flex-1 pt-4'>
      <h2 className='text-[30px] font-bold sm:text-[40px] leading-none'>G-RCP: Preparación y Salvamento en Emergencias</h2>
      </div>

      <div className='flex-1  pt-2'>
        <p className='lg:text-xl mb-5 lg:ml-2 sm:text-[15px]'>Ofrecemos capacitación en RCP y protocolos de emergencia para instituciones públicas y privadas. En G-RCP, adaptamos nuestros programas a tus necesidades específicas para asegurar que tu equipo esté preparado para responder en situaciones críticas.</p>
        <Link to="/Nosotros" className='bg-SoftRed w-[185px] h-[48px] uppercase text-white hover:bg-black inline-block text-center content-center'>Leer Más</Link>
      </div>
      

      </div>

    </section>
  )
}


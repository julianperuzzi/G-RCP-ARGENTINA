import React from 'react'
//selector de imagenes el de 641 es si la pantalla tiene como minimo 641 coloca cierta imagen
import imageMobile from '../assets/imagen cuadrada.jpg'
import imageDesktop from '../assets/imagen recatacngular.jpg'
import { Link } from 'react-router-dom';

export const MainArticle = () => {
  return (
    <section className='mb-12 lg:w-3/4'>

      <picture>
        <source  srcSet={imageDesktop} />
       <img src={imageMobile} alt="imagen" />
      </picture>

    <div className=' sm:flex'>

      <div className='flex-1 pt-4'>
      <h2 className='text-[30px] font-bold sm:text-[40px] leading-none'>G-RCP: Preparación y Salvamento en Emergencias</h2>
      </div>

      <div className='flex-1  pt-2'>
        <p className='text-[13px] mb-5 sm:text-[15px]'>En G-RCP, nos centramos en la formación en primeros auxilios y en situaciones de riesgo. Capacitamos a individuos y empresas para actuar con confianza y eficacia en momentos críticos, garantizando la seguridad y el bienestar de todos.</p>
        <Link to="/Nosotros" className='bg-SoftRed w-[185px] h-[48px] uppercase text-white hover:bg-black inline-block text-center content-center'>Leer Más</Link>
      </div>
      

      </div>

    </section>
  )
}


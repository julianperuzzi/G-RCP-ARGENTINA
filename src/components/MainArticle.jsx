import React, { useState, useEffect } from 'react';
import image1 from '../assets/ImagenesMain/ImgMain1.jpg'; // Reemplaza con tus imágenes
import image2 from '../assets/ImagenesMain/ImgMain2.jpg';
import image3 from '../assets/ImagenesMain/ImgMain3.jpg';
import { Link } from 'react-router-dom';

export const MainArticle = () => {
  const images = [image1, image2, image3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 1000); // Duración de la transición
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className='mb-4 mx-auto relative'>
      <div className='relative flex justify-start items-center bg-AzulOscuro h-screen md:h-[700px]'>
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${fade ? 'opacity-100' : 'opacity-0'}`} 
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        ></div>
        <div className='absolute flex flex-col text-white p-4 xl:px-28 md:px-218 items-start text-left z-10'>
          <h1 className='text-[40px] font-bold sm:text-[50px] leading-none mb-5 sm:w-3/4 w-5/6 '>
            G-RCP: Capacitación en Primeros Auxilios
          </h1>
          <h2 className='text-[20px] font-bold sm:text-[30px] leading-none mb-5 w-3/4'>
            Prevención y Salvamento en Emergencias
          </h2>
          <Link to="/Nosotros" className='bg-SoftRed w-[150px] h-[40px] uppercase text-white hover:bg-black inline-block text-center py-2 mb-4'>
            Leer Más
          </Link>
          <p className='md:text-xl w-3/4'>
            Ofrecemos capacitación en RCP y protocolos de emergencia para instituciones públicas y privadas. En G-RCP, adaptamos nuestros programas a tus necesidades específicas para asegurar que tu equipo esté preparado para responder en situaciones críticas.
          </p>
        </div>
      </div>
    </section>
  );
};

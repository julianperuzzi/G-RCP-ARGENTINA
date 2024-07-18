import React, { useEffect } from 'react';
import imagenFondo from '../assets/ImagenesMain/ImgMain33.png'; 
import imagenFondo1 from '../assets/logo white g rcp.pptx.svg'; 
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import { Link } from 'react-router-dom';


export const Baner = () => {

  useEffect(() => {
    AOS.init({ duration: 2000 });
  }, []);

  // Supongamos que darkMode es una variable que determina el modo oscuro o claro
  const darkMode = true; // Aquí deberías definir tu lógica para determinar el modo oscuro o claro

  return (
    <section className='mb-4 mx-auto relative'>
       <Parallax
        className="bg-center md:h-[50vh] h-[50vh]"
        bgImage={imagenFondo}
        strength={700}
        bgImageStyle={{ objectFit: 'cover' }}
      >
        <div className="flex flex-col items-center text-center justify-center md:mt-24 mt-10" data-aos="zoom-in">
          <h1 className={`lg:text-8xl text-5xl font-bold p-6 bg-clip-text text-transparent ${darkMode ? 'bg-gradient-to-r from-sky-600 to-orange-400' : 'bg-gradient-to-r from-yellow-300 to-yellow-600'} hover:scale-105 transition duration-700`}>
            G-RCP ARGENTINA
          </h1>
          <p className="my-2 text-xl px-10 text-white border-t border-gray-400 pt-4 uppercase">
            Capacitación, Prevención y Salvamento en Emergencias
          </p>
        </div>
      </Parallax>




      <div className='mx-auto mt-8 w-10/12 flex md:flex-row flex-col items-center md:h-56' data-aos="fade-right">
  <div className="md:w-52 mx-auto hidden md:block">
  <img src={imagenFondo1} alt="Imagen de Fondo" className="w-full object-cover" />
    
  </div>
  <div className="md:w-2/3 md:pl-4 border-l-2 border-SoftRed pl-4 mt-4 md:mt-0">
    <h3 className="text-3xl font-bold mb-2 ">G-RCP Argentina</h3>
    <p className="text-lg ">
      G-RCP Argentina se especializa en capacitación en Reanimación Cardiopulmonar (RCP) y protocolos de emergencia, adaptados a diversos sectores como instituciones educativas, empresas, grupos deportivos y la comunidad en general.
    </p>
    <Link to="/Nosotros" className='bg-SoftRed w-[150px] h-[40px] text-white hover:bg-black inline-block text-center py-2 mt-4 '>
      Conoce más
    </Link>
  </div>
</div>




    </section>
  );
};

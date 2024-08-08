import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import imagenFondo from '../assets/imgMision,etc/Captura de pantalla 2023-07-28 005936.png'; // Reemplaza con tu imagen de fondo
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';

 export const Servicios = () => {



  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className=" md:w-10/12 mx-auto mt-8 shadow-xl p-6 hover:scale-105 transition duration-500" >
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-slate-800 uppercase">Servicios G-RCP Argentina</h2>


      <div className=" overflow-hidden flex md:flex-row flex-col-reverse  md:h-96">
      
        <div className="p-4 md:w-1/2">
        <h3 className='text-2xl font-bold mb-2 text-slate-700 uppercase'>Nuestros Servicios</h3>
          <p className="text-gray-700 text-lg mb-4">
            Ofrecemos soluciones integrales de capacitación en primeros auxilios y RCP adaptadas a diferentes sectores:
          </p>
          <ul className="text-left text-gray-700 text-lg">
            <li className="mb-1">
              <strong>Instituciones Educativas</strong>
            </li>
            <li className="mb-1">
              <strong>Empresas</strong>
            </li>
            <li className="mb-1">
              <strong>Grupos Deportivos</strong>
            </li>
            <li className="mb-1">
              <strong>Comunidad</strong>
            </li>
          </ul>
          <Link to="/servicios" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 w-fit">Ir a Servicios</Link>
        </div>
        <div>

      </div>
        <Link to="/Servicios" className="md:w-1/2">
          <img src={imagenFondo} alt="Imagen de Fondo" className="w-full object-cover" />
        </Link>
        
      </div>
    </div>
  );
};

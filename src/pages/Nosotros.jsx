import React, { useState, useEffect } from 'react';
import img3 from '../assets/perfil equipo/julian perfil.png';
import img2 from '../assets/perfil equipo/feli perfil.jpeg';
import img1 from '../assets/perfil equipo/jisu perfil.jpeg';
import empresaLogo from '../assets/logos/logo g.rcp sin letras.svg';
import fondo from '../assets/img main/ImgMain1.jpg';
import { Link } from 'react-router-dom';
import { Parallax } from 'react-parallax';
import AOS from 'aos';
import 'aos/dist/aos.css';

import misionImage from '../assets/imgMision,etc/Captura de pantalla 2023-07-28 005936.png'; // Imagen para la misión
import visionImage from '../assets/imgMision,etc/rcpimagen.jpeg'; // Imagen para la visión
import objetivoImage from '../assets/imgMision,etc/Captura de pantalla 2023-07-28 005840.png'; // Imagen para el objetivo

export const Nosotros = () => {
  const [mostrarMiembros, setMostrarMiembros] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <aside className="pb-6 bg-white text-black animate-fade-in">
      <Parallax
        className="bg-center md:h-[50vh] h-[40vh]"
        bgImage={fondo}
        strength={700}
        bgImageStyle={{ objectFit: 'cover' }}
      >
        <div className="flex flex-col items-center text-center justify-center md:mt-16 py-10 md:py-0" data-aos="zoom-in">
        <p className="md:text-2xl text-l px-10 text-white border-b border-gray-400 ">G-RCP ARGENTINA
          </p>
          <h2 className={`lg:text-5xl text-2xl font-bold p-4 bg-clip-text md:w-2/3 text-white`}>GRUPO DE RESCATE, CAPACITACIÓN Y PREVENCIÓN 
          </h2>
          <p className="my-2 md:text-xl text-sm px-10 text-white border-t border-gray-400 pt-4 uppercase">
            Capacitación, Prevención y Salvamento en Emergencias
          </p>
        </div>
      </Parallax>


      <div className="mx-auto mt-8 ">

        <div className='flex mx-auto justify-center md:items-start items-center px-4'>
          <img src={empresaLogo} alt="Logo de la empresa" className="md:w-36 w-24 h-auto" />
          <div className='pl-4'>
            <h2 className="text-4xl font-bold my-2 py-2 border-orange-500 border-b-2">Nosotros</h2>
            <p className="text-lg max-w-prose">
              Somos una empresa comprometida con la seguridad y el bienestar de la comunidad.
            </p>
          </div>
        </div>

        
          <div className="mt-8 text-lg md:text-xl p-4 md:w-10/12 mx-auto">
            {/* Sección Misión */}
            <div className="flex flex-col md:flex-row p-6 my-8 items-center card md:border-b-2 md:border-slate-600/50 md:pb-16" data-aos="fade-up">
              <img src={misionImage} alt="Misión" className="w-full md:w-1/2 md:h-96 mb-4 md:mb-0 md:mr-8  shadow-md" />
              <div className="card-content">
                <h2 className="font-bold md:text-5xl text-2xl mb-4 md:text-left">Misión</h2>
                <p className="">
                  Nuestra misión es capacitar a instituciones educativas y empresas en técnicas de
                  reanimación cardiopulmonar (RCP), primeros auxilios, soporte vital básico y manejo de
                  desfibriladores externos automáticos (DEA). 
                </p>
              </div>
            </div>

            {/* Sección Visión */}
            <div className="flex flex-col md:flex-row-reverse p-6 my-8 items-center card md:border-b-2 md:border-slate-600/50 md:pb-16" data-aos="fade-up">
              <img src={visionImage} alt="Visión" className="w-full md:w-1/2 md:h-96  mb-4 md:mb-0 md:ml-8  shadow-md" />
              <div className="card-content">
                <h2 className="font-bold md:text-5xl text-2xl mb-4 md:text-left">Visión</h2>
                <p className="">
                  Nos visualizamos como líderes en la capacitación en RCP, primeros auxilios, soporte
                  vital básico y manejo de DEA para instituciones educativas y empresas. Aspiramos a ser
                  reconocidos por nuestra calidad en la formación, contribuyendo a la creación de una
                  sociedad más preparada y comprometida con la seguridad y el bienestar de sus miembros.
                </p>
              </div>
            </div>

            {/* Sección Objetivo */}
            <div className="flex flex-col md:flex-row p-6 my-8 items-center card md:border-b-2 md:border-slate-600/50 md:pb-16" data-aos="fade-up">
              <img src={objetivoImage} alt="Objetivo" className="w-full md:w-1/2 md:h-96 mb-4 md:mb-0 md:mr-8 shadow-md" />
              <div className="card-content">
                <h2 className="font-bold md:text-5xl text-2xl mb-4 md:text-left">Objetivo</h2>
                <p className="">
                  Buscamos ser partícipes y generadores de acciones preventivas para la comunidad en
                  general para acabar (o al menos disminuir) las epidemias de las que poco se habla: el
                  Ahogamiento y la Muerte Súbita.
                </p>
              </div>
            </div>
          </div>
     
      </div>

      <div className="flex text-center justify-center ">
        <h2 className="text-3xl font-bold mb-3 mt-4 xl:mt-8">Nuestro Equipo</h2>
      </div>

      {mostrarMiembros && (
        <div className="flex flex-wrap justify-center gap-8 sm:w-2/3 mx-auto">
          {/* Aquí van los miembros del equipo */}
          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg" data-aos="fade-up">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img3}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Dominar las técnicas de primeros auxilios, RCP y manejo de DEA no solo te convierte en un héroe potencial, sino que también te empodera para actuar con confianza en situaciones de emergencia.”
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">JULIAN PERUZZI</div>
                <div className="text-gray-700">TEC & DEV, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>

          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg" data-aos="fade-up">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img2}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Aprender técnicas de RCP y el manejo del DEA no es solo un deber, es un llamado a la acción colectiva. Enfrentemos unidos la amenaza de la muerte súbita y el ahogamiento, elevando la conciencia y capacitando a todos.”
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">FELIPE BUILES</div>
                <div className="text-gray-700">TEC, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>

          <figure className="md:flex bg-gray-100 rounded-xl p-8 md:p-0 w-full shadow-lg" data-aos="fade-up">
            <img
              className="w-24 h-24 md:w-48 md:h-auto md:rounded rounded-full mx-auto"
              src={img1}
              alt="Equipo"
            />
            <div className="pt-6 md:p-4 text-center md:text-left space-y-4">
              <blockquote>
                <p className="text-l font-medium text-gray-700">
                  "Despierta el potencial que llevas dentro; con habilidades adecuadas y conocimientos sólidos, puedes convertirte en el faro que salva vidas y enciende esperanzas."
                </p>
              </blockquote>
              <figcaption className="font-medium">
                <div className="text-blue-500">JOSE MARIA NART</div>
                <div className="text-gray-700">PROF, ARGENTINA</div>
              </figcaption>
            </div>
          </figure>
        </div>
      )}

      <div className='flex justify-center border-b-4 p-4'>
        <button
          className="bg-zinc-500 hover:bg-black text-white font-bold py-2 px-4 mb-6 shadow"
          onClick={() => setMostrarMiembros(!mostrarMiembros)}
        >
          {mostrarMiembros ? 'Ocultar Equipo' : 'Mostrar Equipo'}
        </button>
      </div>

      <div className="text-center my-8">
        <Link to="/Contacto" className="bg-orange-500 hover:bg-black text-white font-bold py-2 px-4 my-6 shadow text-2xl">
          Contáctanos
        </Link>
      </div>
    </aside>
  );
};

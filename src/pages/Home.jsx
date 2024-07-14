import React from 'react';
import { Baner } from "../components/Baner";
import { Blog } from "../components/Blog";
import { Servicios } from '../components/Servicios';
import { Certificacion } from "../components/Certificacion";
import ListonInfinito from "../components/ListonInfinito";
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <aside className='animate-fade-in mx-auto '>
      <div id="main-article" className='md:mb-24 mb-16'>
        <Baner />
      </div>


    <aside className='mx-4 md:w-5/6 md:mx-auto'>

    <div id="servicios" className={` my-16 `}>
      <Servicios />
    </div>

      

      <section id="Nuestros Recursos" className="px-4 py-4 mt-10 bg-slate-800 text-white shadow-xl ">

        <div className='lg:w-2/3 mx-auto lg:my-8 my-4'>
        <h2 className="text-4xl text-center font-bold mb-16">Nuestros Recursos</h2>  
        </div>

        <div className='lg:w-2/3 mx-auto lg:my-8 my-4'>
        <h2 className="text-3xl font-bold mb-4">APRENDE RCP CON NOSOTROS</h2>
        <p className="text-lg mb-4 text-gray-300">Aprende las técnicas de Reanimación Cardiopulmonar (RCP) con nuestros contenido.</p>
        <Link to="/rcp" className="bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 inline-block">
          Aprende RCP
        </Link>
        </div>

        <div className='lg:w-2/3 mx-auto lg:my-8 my-4 border-t-2 pt-4'>
        <h2 className="text-3xl font-bold mb-4">Mapa de DEA ARGENTINA</h2>
        <p className="text-lg mb-4 text-gray-300">Geolocalizá todos los DEA de Argentina</p>
        <Link to="/mapadea" className="bg-orange-400 hover:bg-black text-white font-bold py-2 px-4 inline-block">
          Mapa DEA ARG
        </Link>
        </div>
       
        <div className='lg:w-2/3 mx-auto lg:my-8 my-4 border-t-2 pt-4'>
          <h2 className="text-3xl font-bold  mb-4">Biblioteca De Primeros Auxilios</h2>
          <p className="text-white">Aquí encontrarás toda la teoría necesaria para aprender primeros auxilios y cómo actuar en situaciones de emergencia.</p>
          <p className="text-gray-300">No dudes en explorar nuestra amplia colección de recursos para estar preparado ante cualquier eventualidad.</p>
          <Link to="/Biblioteca" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Explorar Biblioteca</Link>
          </div>

        
      </section>

      <div id="certificacion" className={`xl:flex xl:gap-8 pt-1 my-8`}>
        <Certificacion />
      </div>

      

      <div id="teoria" className={` px-4 pt-1 my-10`}>
        <ListonInfinito />
      </div>

      <div id="main-article" className={`shadow-2xl my-8`}>
      <Blog />
      </div>
      </aside>
      
    </aside>
  );
};

import React from 'react';
import { MainArticle } from "../components/MainArticle";
import { Blog } from "../components/Blog";
import { Servicios } from "../components/Servicios";
import { Equipo } from "./Equipo";
import { Certificacion } from "../components/Certificacion";
import { Teoria } from "../components/Teoria";
import ListonInfinito from "../components/ListonInfinito";
import Contacto from './Contacto';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <>
      <div id="main-article" className={`xl:flex xl:gap-8 px-4 pt-1 `}>
        <MainArticle />
        <Blog />
      </div>

    
      <div id="servicios" className={`xl:flex xl:gap-8 px-4 pt-1 my-10 `}>
        <Servicios />
      </div>

      <section id="aprende-rcp" className=" px-4 py-4 text-center shadow-lg mx-4 mt-10">
        <h2 className="text-3xl font-bold mb-4">Aprende RCP con nosotros</h2>
        <p className="text-lg mb-4">Aprende las técnicas de Reanimación Cardiopulmonar (RCP) con nuestros contenido. Geolocaliza todos los DEA de Argentina</p>
        <Link to="/rcp" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-block">
          Aprende RCP
        </Link>
      </section>

      <div id="certificacion" className={`xl:flex xl:gap-8 px-4 pt-1 my-10`}>
        <Certificacion />
      </div>

      <div id="teoria" className={` px-4 pt-1 my-10`}>
        <Teoria />
      </div>

      <div id="teoria" className={` px-4 pt-1 my-10`}>
        <ListonInfinito />
      </div>
    </>
  );
};

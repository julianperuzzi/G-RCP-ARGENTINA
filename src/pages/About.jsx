import React, { useState, useEffect } from 'react';
import { MainArticle } from "../components/MainArticle";
import { Blog } from "../components/Blog";
import { Servicios } from "../components/Servicios";
import { Equipo } from "./Equipo";
import { Certificacion } from "../components/Certificacion";
import { Teoria } from "../components/Teoria";
import ListonInfinito from "../components/ListonInfinito";
import Contacto from './Contacto';


export const About = () => {

  return (
    <>
      <div id="main-article" className={`xl:flex xl:gap-8 px-4 pt-1 `}>
        <MainArticle/>
        <Blog/>
      </div>

      <div id="servicios" className={`xl:flex xl:gap-8 px-4 pt-1 my-10 `}>
        <Servicios/>
      </div>

      <div id="certificacion" className={`xl:flex xl:gap-8 px-4 pt-1 my-10`}>
        <Certificacion/>
      </div>

      <div id="teoria" className={` px-4 pt-1 my-10`}>
        <Teoria/>        
      </div>

      <div id="teoria" className={` px-4 pt-1 my-10`}>
        <ListonInfinito/>
      </div>

    </>
  );
};

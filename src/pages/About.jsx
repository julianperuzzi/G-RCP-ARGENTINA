import React, { useState, useEffect } from 'react';
import { MainArticle } from "../components/MainArticle";
import { Blog } from "../components/Blog";
import { Servicios } from "../components/Servicios";
import { Equipo } from "./Equipo";
import { Certificacion } from "../components/Certificacion";
import { Teoria } from "../components/Teoria";
import ListonInfinito from "../components/ListonInfinito";


export const About = () => {
  const [isVisible, setIsVisible] = useState({
    mainArticle: false,
    servicios: false,
    certificacion: false,
    teoria: false,
    listonInfinito: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const mainArticlePos = document.getElementById('main-article').getBoundingClientRect().top;
      const serviciosPos = document.getElementById('servicios').getBoundingClientRect().top;
      const certificacionPos = document.getElementById('certificacion').getBoundingClientRect().top;
      const teoriaPos = document.getElementById('teoria').getBoundingClientRect().top;
      const listonInfinitoPos = document.getElementById('liston-infinito').getBoundingClientRect().top;

      setIsVisible({
        mainArticle: mainArticlePos < windowHeight,
        servicios: serviciosPos < windowHeight,
        certificacion: certificacionPos < windowHeight,
        teoria: teoriaPos < windowHeight,
        listonInfinito: listonInfinitoPos < windowHeight
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Para verificar la posición inicial cuando se carga la página

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div id="main-article" className={`xl:flex xl:gap-8 px-4 pt-1 ${isVisible.mainArticle ? 'fade-in show' : 'fade-in'}`}>
        <MainArticle/>
        <Blog/>
      </div>

      <div id="servicios" className={`xl:flex xl:gap-8 px-4 pt-1 ${isVisible.servicios ? 'fade-in show' : 'fade-in'}`}>
        <Servicios/>
      </div>

      <div id="certificacion" className={`xl:flex xl:gap-8 px-4 pt-1 ${isVisible.certificacion ? 'fade-in show' : 'fade-in'}`}>
        <Certificacion/>
      </div>

      <div id="teoria" className={` px-4 pt-1 ${isVisible.teoria ? 'fade-in show' : 'fade-in'}`}>
        <Teoria/>
      </div>

      <div id="liston-infinito" className={`xl:flex xl:gap-8 px-4 pt-1 ${isVisible.listonInfinito ? 'fade-in show' : 'fade-in'}`}>
        <ListonInfinito/>
      </div>
    </>
  );
};

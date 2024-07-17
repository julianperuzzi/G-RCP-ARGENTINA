import React, { useEffect } from 'react';
import { Baner } from "../components/Baner";
import { Blog } from "../components/Blog";
import { Servicios } from '../components/Servicios';
import { Certificacion } from "../components/Certificacion";
import ListonInfinito from "../components/ListonInfinito";
import { Link } from 'react-router-dom';
import Recursos from '../components/Recursos';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000});
  }, []);


  return (
    <aside className='animate-fade-in mx-auto '>
      <div id="main-article" className='md:mb-24 mb-16'>
        <Baner />
      </div>


    <aside className=' md:w-5/6 md:mx-auto'>

    <div id="servicios" className={`mx-4 my-16 `} >
      <Servicios />
    </div>

    <div id="recursos" className={` my-16 `} data-aos="fade-up">
      <Recursos />
    </div>
      

    <div id="certificacion" className={` mx-4 xl:flex xl:gap-8 pt-1 my-8`}  data-aos="fade-up">
        <Certificacion />
    </div>


    <div id="listonMarcas" className={` pt-1 my-10`} data-aos="fade-up">
        <ListonInfinito />
    </div>

    <div id="blog" className={`shadow-2xl my-8`} data-aos="fade-up">
      <Blog />
    </div>

      </aside>
      
    </aside>
  );
};
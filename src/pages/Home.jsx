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


    <aside className=' md:mx-auto'>
    
    <div id="servicios" className={`mx-4 my-16 border-t-2 border-slate-300 md:w-5/6 pt-10 md:mx-auto`} >
      <Servicios />
    </div>

    <div id="recursos" className={` my-16 border-t-2 border-slate-300 pt-10  `} >
      <Recursos />
    </div>
      

    <div id="certificacion" className={`border-t-2 border-slate-300 `}  data-aos="fade-up">
        <Certificacion />
    </div>


    <div id="listonMarcas" className={`py-10`} data-aos="fade-up">
        <ListonInfinito />
    </div>

    {/* <div id="blog" className={`shadow-2xl my-8 hidden`} data-aos="fade-up">
      <Blog />
    </div> */}

      </aside>
      
    </aside>
  );
};

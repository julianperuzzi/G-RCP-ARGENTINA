import React, { useEffect } from 'react';
import Baner  from "../components/Baner";
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
        <Baner />
    <aside className=' md:mx-auto'>
    
      <Servicios />
      <Recursos />
      <Certificacion />
      <ListonInfinito />


    {/* <div id="blog" className={`shadow-2xl my-8 hidden`} data-aos="fade-up">
      <Blog />
    </div> */}

      </aside>
      
    </aside>
  );
};

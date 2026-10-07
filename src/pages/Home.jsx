import React, { useEffect } from 'react';
import Baner  from "../components/Home/Baner";
import { Servicios } from '../components/Home/Servicios';
import { Certificacion } from "../components/Home/Certificacion";
import ListonInfinito from "../components/Home/ListonInfinito";
import Recursos from '../components/Home/Recursos';
import CommunitySection from '../components/Home/CommunitySection';
import NearestDea from '../components/Home/NearestDea';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000});
  }, []);


  return (
    <div className='grcp-home mx-auto'>
        <Baner />
        <NearestDea />
    <div className='md:mx-auto'>
    
      <Servicios />
      <CommunitySection />
      <Recursos />
      <Certificacion />
      <ListonInfinito />


    {/* <div id="blog" className={`shadow-2xl my-8 hidden`} data-aos="fade-up">
      <Blog />
    </div> */}

      </div>
      
    </div>
  );
};

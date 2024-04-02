import React from 'react';
import img1 from '../assets/Fomentando Héroes en las Aulas (1).png';
import img2 from '../assets/G - R C P DEPORTISTAS.png';
import img3 from '../assets/G - R C P EMPRESAS.png';

export const Servicios = () => {
  return (
    <section className=" bg-slate-300 my-4 p-3">
      <h1 className=" text-white text-4xl pt-4 pl-3c font-bold pl-6">Servicios</h1>
      <div className="lg:flex lg:gap-10 p-2">

        
        <article className="bg-white shadow-lg flex items-center p-4 my-2 hover:scale-105 hover:bg-gray-900 hover:text-white transition-transform duration-200 ease-in-out">
          <div className="w-40 overflow-hidden ">
            <img src={img1} alt="" className="w-full h-full" />
          </div>
          <div className="ml-4">
            <p className="text-GrisClaro text-3xl font-bold mb-2">01</p>
            <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicio para Escuelas</h2>
            <p className="text-GrisClaro text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
        </article>

        <article className="bg-white shadow-lg flex items-center p-4 my-2 hover:scale-105 hover:bg-gray-900 hover:text-white transition-transform duration-300 ease-in-out">
          <div className="w-40 overflow-hidden ">
            <img src={img2} alt="" className="w-full h-full" />
          </div>
          <div className="ml-4">
            <p className="text-GrisClaro text-3xl font-bold mb-2">02</p>
            <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicio para Deportistas</h2>
            <p className="text-GrisClaro text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
        </article>

        <article className="bg-white shadow-lg flex items-center p-4 my-2 hover:scale-105  hover:bg-gray-900 hover:text-white transition-transform duration-300 ease-in-out">
          <div className="w-40 overflow-hidden ">
            <img src={img3} alt="" className="w-full h-full" />
          </div>
          <div className="ml-4">
            <p className="text-GrisClaro text-3xl font-bold mb-2">03</p>
            <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicio para Empresas</h2>
            <p className="text-GrisClaro text-sm">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          </div>
        </article>
      </div>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

export const Blog = () => {
  return (
    <aside className="bg-DarkBlue  text-white p-5">
      <div className=' lg:w-3/4 justify-center items-center mx-auto'>
      <h1 className="text-SoftOrange text-4xl font-bold cursor-default">BLOG</h1>
      <article className="border-b-2 border-white py-7 last:border-none">
        <Link to="/News">
          <h2 className="cursor-pointer hover:text-SoftOrange text-20px mb-3 font-bold lg:text-16px xl:text-20px">La Importancia Vital de Saber RCP</h2>
        </Link>
        <p className="text-15px">Aprender RCP puede salvar vidas al proporcionar confianza y seguridad en emergencias cardíacas críticas.</p>
      </article>
      <article className="border-b-2 border-white py-7 last:border-none">
        <Link to="/News">
          <h2 className="cursor-pointer hover:text-SoftOrange text-20px mb-3 font-bold lg:text-16px xl:text-20px">El Manejo de DEA: Un Pilar en la Cadena de Supervivencia</h2>
        </Link>
        <p className="text-15px">El manejo de DEA aumenta las tasas de supervivencia durante un paro cardíaco, siendo vital para reducir daños.</p>
      </article>
      <article className="border-b-2 border-white py-7 last:border-none">
        <Link to="/News">
          <h2 className="cursor-pointer hover:text-SoftOrange text-20px mb-3 font-bold lg:text-16px xl:text-20px">Primeros Auxilios: La Primera Línea de Defensa en Emergencias</h2>
        </Link>
        <p className="text-15px">Los primeros auxilios previenen complicaciones graves y salvan vidas antes de la ayuda profesional, esencial en emergencias.</p>
      </article>
      </div>
    </aside>

  );
};

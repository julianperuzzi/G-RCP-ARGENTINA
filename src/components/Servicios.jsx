import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

export const Servicios = () => {
  return (
    <section className="my-4 lg:w-max bg-gray-100 mx-auto">
      <h2 className="text-3xl text-center pt-4 pl-6 font-bold">SERVICIOS</h2>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 p-2 py-4 md:px-4">
        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex flex-col justify-between p-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 h-full">



            <div className="">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Instituciones Educativas</h2>
              <p className="text-gray-700 text-sm">Ofrecemos programas y capacitaciones adaptadas a las necesidades de escuelas y colegios.</p>
            </div>
            <p className="text-blue-700 text-sm pt-4 self-end">Más Información Aquí</p>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex flex-col justify-between p-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 h-full">
            <div className="">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Empresas</h2>
              <p className="text-gray-700 text-sm">Proporcionamos soluciones integrales de capacitación y gestión de emergencias para empresas.</p>
            </div>
            <p className="text-blue-700 text-sm pt-4 self-end">Más Información Aquí</p>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex flex-col justify-between p-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 h-full">
            <div className="">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Grupos Deportivos</h2>
              <p className="text-gray-700 text-sm">Diseñamos programas de capacitación y entrenamiento en primeros auxilios y RCP específicamente adaptados.</p>
            </div>
            <p className="text-blue-700 text-sm pt-4 self-end">Más Información Aquí</p>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex flex-col justify-between p-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 h-full">
            <div className="">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Comunidad</h2>
              <p className="text-gray-700 text-sm">Brindamos programas de capacitación en primeros auxilios y RCP abiertos a la comunidad en general.</p>
            </div>
            <p className="text-blue-700 text-sm pt-4 self-end">Más Información Aquí</p>
          </article>
        </Link>
      </div>
    </section>
  );
};

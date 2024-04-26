import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

export const Servicios = () => {
  return (
    <section className="my-4 lg:w-max bg-gray-100 mx-auto">
      <h1 className="text-4xl text-center pt-4 pl-6 font-bold">SERVICIOS</h1>
      <div className="flex  lg:gap-10 p-2 overflow-x-auto">
        <Link to="/Servicios" className="flex-shrink-0 ">
          <article className="bg-white shadow-md rounded-md flex items-center p-4 m-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-56 lg:max-w-80 h-80">
            <div className="ml-4">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicios para Instituciones Educativas</h2>
              <p className="text-gray-700 text-sm">Ofrecemos programas y capacitaciones adaptadas a las necesidades de escuelas y colegios para promover la seguridad y el bienestar de estudiantes y personal educativo.</p>
              <p className="text-blue-700 text-sm pt-4">Más Información Aquí</p>
            </div>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex items-center p-4 m-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-56 lg:max-w-80 h-80">
            <div className="ml-4">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicios para Empresas</h2>
              <p className="text-gray-700 text-sm">Proporcionamos soluciones integrales de capacitación y gestión de emergencias para empresas, con el objetivo de promover la seguridad y el bienestar en el lugar de trabajo.</p>
              <p className="text-blue-700 text-sm pt-4">Más Información Aquí</p>
            </div>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex items-center p-4 m-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-56 lg:max-w-80 h-80">
            <div className="ml-4">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicios para Grupos Deportivos</h2>
              <p className="text-gray-700 text-sm">Diseñamos programas de capacitación y entrenamiento en primeros auxilios y RCP específicamente adaptados, con el objetivo de promover la seguridad y el rendimiento deportivo.</p>
              <p className="text-blue-700 text-sm pt-4">Más Información Aquí</p>
            </div>
          </article>
        </Link>

        <Link to="/Servicios" className="flex-shrink-0">
          <article className="bg-white shadow-md rounded-md flex items-center p-4 m-4 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105 max-w-56 lg:max-w-80 h-80">
            <div className="ml-4">
              <h2 className="font-bold text-xl mb-2 hover:text-SoftOrange cursor-pointer">Servicios para la Comunidad</h2>
              <p className="text-gray-700 text-sm">Brindamos programas de capacitación en primeros auxilios y RCP abiertos a la comunidad en general, con el objetivo de empoderar a las personas para actuar en situaciones de emergencia y salvar vidas.</p>
              <p className="text-blue-700 text-sm pt-4">Más Información Aquí</p>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
};

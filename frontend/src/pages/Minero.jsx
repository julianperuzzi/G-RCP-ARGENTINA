import React from 'react';
import workerImage from '../assets/img mineras/bienestar minero.jpg'; // Importa la imagen del trabajador
import cprImage from '../assets/img mineras/calidad de vida.jpg'; // Importa la imagen de RCP
import { Link } from 'react-router-dom';

const Minero = () => {
  return (
    <div className=" py-8 px-4 bg-slate-800 text-white animate-fade-in">
      <h2 className="text-4xl font-bold mb-8 text-center">Bienestar Minero</h2>
      
      {/* Sección "Proyecto de Bienestar Integral para Empresas Mineras" */}
      <div className="mb-12 lg:w-1/2 mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-slate-300 text-center">Proyecto de Bienestar Integral para Empresas Mineras</h3>
        <div className="">
          {/* Imagen con efecto de fade in */}
          <img src={workerImage} alt="Trabajador" className="shadow-lg animate-fade-in lg:max-w-[800px] mx-auto lg:mb-6" />
          {/* Contenido */}
          <div className="flex flex-col justify-center">
            <p className="text-lg mb-4">
              Con el compromiso de fomentar un entorno laboral saludable y una responsabilidad social empresarial genuina, presentamos un conjunto de soluciones diseñadas para mejorar el bienestar del personal, la calidad de vida y el acercamiento con las comunidades locales.
            </p>
            <p className="text-lg">
              Ofrecemos soluciones como:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li className="mb-2">Mejora de la Calidad de Vida del Personal</li>
              <li className="mb-2">Capacitación en RCP y soporte vital para la comunidad</li>
              <li className="mb-2">Formación y entrenamiento del personal en técnicas de emergencia</li>
              <li className="mb-2">Fomento de la cultura y el deporte para un futuro sostenible</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sección "Público Objetivo" */}
      <div className="mb-12 lg:w-1/2 mx-auto">
        <h2 className="text-3xl font-bold mb-4">Público Objetivo</h2>
        <div className="">
          {/* Contenido */}
          <div className="flex flex-col justify-center">
            <p className="text-lg mb-4">
              Empleados - Personal: El compromiso a nivel institucional y empresarial tiene un efecto multiplicador no solo en los respectivos sitios de trabajo, sino también en el entorno más cercano.
            </p>
            <p className="text-lg">
              Comunidad: Las técnicas de RCP y manejo de DEA pueden ser aprendidas/replicadas por la comunidad en general. Salvar vidas está al alcance de todos y todas.
            </p>
          </div>
        </div>
      </div>

      {/* Sección "Objetivos" */}
      <div className="mb-12 lg:w-1/2 mx-auto">
        <h2 className="text-3xl font-bold mb-4">Objetivos</h2>
        <div className="">
          {/* Contenido */}
          <div className="flex flex-col justify-center">
            <ul className="list-decimal pl-6">
              <li className="text-lg mb-2">Formar masivamente a la comunidad en técnicas de RCP/DEA y atención primaria básica</li>
              <li className="text-lg mb-2">Alianzas con las instituciones y empresas para la formación continua y actualizada en maniobras de RCP, uso del DEA y formación de brigadas de emergencia</li>
              <li className="text-lg mb-2">Generar espacios y eventos cardio protegidos y usuarios formados en consecuencia</li>
              <li className="text-lg">Disminución de la tasa de mortalidad por muerte súbita y ahogamiento - Investigación y desarrollo</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sección "Calidad de Vida" */}
      <div className='lg:w-1/2 mx-auto'>
        <h2 className="text-3xl font-bold mb-4">Calidad de Vida</h2>
        <div className="">
          {/* Imagen con efecto de fade in */}
          
          {/* Contenido */}
          <div className="flex flex-col justify-center">
            <p className="text-lg mb-4">
              Preparación física: Hablamos de las estadísticas de la MS en Argentina y el mundo y de cómo es un tema que debe ser abordado por la comunidad en su conjunto.
            </p>
            <p className="text-lg mb-4">
              Team Building: Abordamos el concepto de ESCENA SEGURA, para introducir posibles situaciones de primeros auxilios básicos comunes.
            </p>
            <p className="text-lg mb-4">
              Kinesiología: Práctica con maniquíes de RCP y Desfibriladores de entrenamiento guiada por instructores.
            </p>
            <p className="text-lg">
              Días de campo: Finalmente hablamos de cómo integrar todo el contenido dentro de un plan de respuesta inmediata y la invitación para generar zonas cardio protegidas.
            </p>
            <img src={cprImage} alt="Capacitación en RCP" className="shadow-lg animate-fade-in lg:max-w-[800px] mx-auto lg:my-6" />
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default Minero;

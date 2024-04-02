import React from 'react';
import rcpImage from '../assets/Reanimación-cardiopulmonar-RCP.webp';
import deaImage from '../assets/dea.jpg';
import primerosAuxiliosImage from '../assets/Primeros-Auxilios.jpg';

const BlogPage = () => {
  return (
    <div className="container mx-auto py-8 ">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">La Importancia Vital de Saber RCP</h2>
          <img src={rcpImage} alt="Imagen de RCP" className="mb-4" />
          <p className="text-gray-500 mb-2">Imagen: Fotografía de RCP en acción.</p>
          <p className="text-gray-700">
            Aprender RCP (Reanimación Cardiopulmonar) es esencial en situaciones de emergencia. 
            Esta técnica puede salvar vidas al proporcionar asistencia vital a personas que han sufrido un paro cardíaco.
            La RCP permite mantener el flujo sanguíneo y la oxigenación del cuerpo hasta que llegue la ayuda médica profesional.
            Además, conocer los pasos adecuados para realizar RCP puede aumentar la confianza de las personas en situaciones de emergencia y ayudarles a actuar de manera efectiva.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">El Manejo de DEA: Un Pilar en la Cadena de Supervivencia</h2>
          <img src={deaImage} alt="Imagen de DEA" className="mb-4" />
          <p className="text-gray-500 mb-2">Imagen: Fotografía de un DEA y sus componentes.</p>
          <p className="text-gray-700">
            El manejo de DEA (Desfibrilador Externo Automático) es crucial en la cadena de supervivencia durante un paro cardíaco repentino.
            Estos dispositivos constan de varias partes, incluyendo electrodos, batería y sistema de administración de descargas.
            La rápida intervención con un DEA puede aumentar significativamente las posibilidades de supervivencia del paciente.
            Es importante que las personas estén capacitadas para utilizar un DEA correctamente y que conozcan su ubicación en lugares públicos como aeropuertos, centros comerciales y estadios deportivos.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Primeros Auxilios: La Primera Línea de Defensa en Emergencias</h2>
          <img src={primerosAuxiliosImage} alt="Imagen de Primeros Auxilios" className="mb-4" />
          <p className="text-gray-500 mb-2">Imagen: Fotografía de un kit de primeros auxilios completo.</p>
          <p className="text-gray-700">
            Los primeros auxilios son la primera línea de defensa en emergencias médicas.
            Con conocimientos básicos de primeros auxilios, se pueden brindar cuidados inmediatos y vitales hasta que llegue la ayuda profesional.
            Estas habilidades pueden marcar la diferencia entre la vida y la muerte en situaciones críticas.
            Es esencial que las personas estén preparadas para manejar una variedad de situaciones de emergencia, como heridas, quemaduras, fracturas y paro cardíaco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

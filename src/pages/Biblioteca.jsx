import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link desde react-router-dom
import imgRCPBasica from '../assets/img biblioteca/rcp_basica_infografia.webp';
import imgPosicionLateral from '../assets/img biblioteca/posicion_lateral_seguridad_infografia.webp';
import imgCadenaSupervivencia from '../assets/img biblioteca/cadena_supervivencia_infografia.webp';
import imgAtragantamiento from '../assets/img biblioteca/atragantamiento_adultos_infografia.webp';
import imgTablaResumenRCP from '../assets/img biblioteca/tabla_rcp.webp';

const Recurso = ({ titulo, descripcion, linkDescarga, imagen }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 mx-2 animate-fade-in">
    <img src={imagen} alt={titulo} className="w-full mb-4 rounded-lg" />
    <h3 className="text-xl font-bold mb-2">{titulo}</h3>
    <p className="mb-4">{descripcion}</p>
    <a href={linkDescarga} className="text-blue-500 hover:underline" download>Descargar documento</a>
  </div>
);

const Biblioteca = () => {
  const recursos = [
    {
      titulo: 'RCP básica',
      descripcion: 'En esta infografía te mostramos las maniobras con las que podrás sustituir la circulación y la respiración, mantener las funciones cerebrales y conseguir la recuperación de la víctima que está en parada cardiorespiratoria. Ante una parada sigue estos pasos. Es más sencillo de lo que parece.',
      linkDescarga: 'https://drive.google.com/file/d/1Dxub0HyAJFlmk63wI9IgxDLcAokWR5Vz/view?usp=sharing',
      imagen: imgRCPBasica
    },
    {
      titulo: 'Posición lateral de seguridad',
      descripcion: '¿Sabías que hay una posición en la que una persona inconsciente aguanta mejor hasta que llegan los servicios de emergencia? Se llama Posición Lateral de Seguridad y en esta infografía te enseñamos cómo hacerla.',
      linkDescarga: 'https://drive.google.com/file/d/1wQpnu05632C1Y3nLgcdooXwhNqtxv4mX/view?usp=sharing',
      imagen: imgPosicionLateral
    },
    {
      titulo: 'Cadena de supervivencia',
      descripcion: 'La cadena de supervivencia es la secuencia de acciones que tenemos que realizar a la hora de atender a una persona que ha sufrido una parada cardiorrespiratoria. Seguirla puede salvar una vida. Esta infografía la detalla de forma muy visual.',
      linkDescarga: 'https://drive.google.com/file/d/11UkOGyo57ALFTSZZJwj9451G7ijXncDM/view?usp=sharing',
      imagen: imgCadenaSupervivencia
    },
    {
      titulo: 'Atragantamiento en las personas adultas',
      descripcion: 'A veces gestos sencillos cobran una gran importancia. Ante una obstrucción de las vías respiratorias hay acciones que pueden aliviar a la persona que la sufre. Ante un atragantamiento sigue las indicaciones que te mostramos en esta infografía.',
      linkDescarga: 'https://drive.google.com/file/d/1TS3qFBg4wVnULXqmm5_ahgGhbuCVlre0/view?usp=sharing',
      imagen: imgAtragantamiento
    },
    {
      titulo: 'Tabla resumen RCP básica',
      descripcion: 'Crees que a ti no puede pasarte, pero en cualquier momento puedes encontrarte ante una persona que está sufriendo una parada cardiorrespiratoria. En esta tabla resumen sobre la RCP Básica te mostramos los principales pasos a seguir y las diferencias más significativas entre adultos, niños y lactantes.',
      linkDescarga: 'https://drive.google.com/file/d/1eY5uXrnwNl5Ke0YuEqIKVzczzlmPAkg5/view?usp=sharing',
      imagen: imgTablaResumenRCP
    }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mt-8 mb-6">Biblioteca de primeros auxilios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recursos.map((recurso, index) => (
          <Recurso key={index} {...recurso} />
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;

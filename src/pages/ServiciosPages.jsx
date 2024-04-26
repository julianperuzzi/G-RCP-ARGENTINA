import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img1Before from '../assets/img servicios/Fomentando Héroes en las Aulas (1).png';
import img1After from '../assets/img servicios/servicio para escuelas 16-9.png';
import img2Before from '../assets/img servicios/G - R C P DEPORTISTAS.png';
import img2After from '../assets/img servicios/servicio para deportistas 16-9.png';
import img3Before from '../assets/img servicios/G - R C P EMPRESAS.png';
import img3After from '../assets/img servicios/servicio para empresas 16-9.png';
import img4Before from '../assets/img servicios/G - R C P Comunidad 1.jpg';
import img4After from '../assets/img servicios/G - R C P Comunidad.jpg';
const serviciosData = [
  {
    id: 1,
    title: 'Capacitaciones para Instituciones Educativas',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Ofrecemos programas y capacitaciones adaptadas a las necesidades de escuelas y colegios para promover la seguridad y el bienestar de estudiantes y personal educativo.',
    imageBefore: img1Before,
    imageAfter: img1After,
  },
  {
    id: 2,
    title: 'Capacitaciones para Grupos Deportivos',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Diseñamos programas de capacitación y entrenamiento en primeros auxilios y RCP específicamente adaptados para atletas y equipos deportivos, con el objetivo de promover la seguridad y el rendimiento deportivo.',
    imageBefore: img2Before,
    imageAfter: img2After,
  },
  {
    id: 3,
    title: 'Capacitaciones Empresariales',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Proporcionamos soluciones integrales de capacitación y gestión de emergencias para empresas, con el objetivo de promover la seguridad y el bienestar en el lugar de trabajo.',
    imageBefore: img3Before,
    imageAfter: img3After,
  },
  {
    id: 4,
    title: 'Capacitación para Comunidad General',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Brindamos programas de capacitación en primeros auxilios y RCP abiertos a la comunidad en general, con el objetivo de empoderar a las personas para actuar en situaciones de emergencia y salvar vidas.',
    imageBefore: img4Before,
    imageAfter: img4After,
  },
];

const ServiciosPages = () => {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <section className="  my-4 p-3 animate-fade-in bg-slate-100">
      <div className= "  p-2 md:w-2/3 md:mx-auto">
        <h1 className="text-zinc-900 text-4xl pt-4 pl-3c font-bold pl-6">Servicios</h1>
        {serviciosData.map((service) => (
          <article
            key={service.id}
            className="bg-white shadow-lg flex items-center p-4 my-2 hover:bg-orange-600 hover:text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="w-40 overflow-hidden">
              <img src={selectedService === service.id ? service.imageAfter : service.imageBefore} alt="" className="w-full h-full" /> {/* Mostrar la segunda imagen si el servicio está seleccionado */}
            </div>
            <div className="ml-4">
              <p className="text-gray-300 text-3xl font-bold mb-2">0{service.id}</p>
              <h2 className="font-bold text-xl mb-2">{service.title}</h2>
              <p className="text-sm">{service.description}</p>
            </div>
          </article>
        ))}
      </div>
      {selectedService && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-10 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-8 md:w-1/2 md:mx-auto mx-2">
            <h2 className="text-2xl font-bold mb-4">{serviciosData[selectedService - 1].title}</h2>
            <img src={serviciosData[selectedService - 1].imageAfter} alt="" className="w-full lg:h-100 object-cover mb-4 rounded-lg" /> {/* Mostrar la segunda imagen en la ventana desplegada */}
            <p className="text-gray-700 text-xl mb-4">{serviciosData[selectedService - 1].description}</p>
            <p className="text-gray-700 mb-4">{serviciosData[selectedService - 1].info}</p>
            <div className="flex flex-col">
              <Link to="/contacto" className="hover:bg-black bg-orange-500 text-white font-bold py-3 px-5 mb-2 w-1/2 text-center">
                Contactanos
              </Link>
            </div>
            <div className="flex justify-between">
              <Link to="/servicios" className="text-gray-400 py-3 px-5 w-1/2 text-center">
                Conocer más+
              </Link>
              <button className="bg-gray-300 text-white font-bold px-4 w-1/3" onClick={handleCloseModal}>
                Cerrar x
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiciosPages;

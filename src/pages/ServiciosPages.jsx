import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import img1Before from '../assets/img servicios/Fomentando Héroes en las Aulas (1).png';
import img1After from '../assets/img servicios/servicio para escuelas 16-9.png';
import img2Before from '../assets/img servicios/G - R C P DEPORTISTAS.png';
import img2After from '../assets/img servicios/servicio para deportistas 16-9.png';
import img3Before from '../assets/img servicios/G - R C P EMPRESAS.png';
import img3After from '../assets/img servicios/servicio para empresas 16-9.png';
import img4Before from '../assets/img servicios/G - R C P Comunidad 1.jpg';
import img4After from '../assets/img servicios/servicio para comunidad 16-9.png';

const serviciosData = [
  {
    id: 1,
    title: 'Capacitaciones para Instituciones Educativas',
    description:
      'Potenciamos la seguridad y el bienestar en entornos educativos con programas adaptados a escuelas y colegios.',
    info:
      'Nuestros programas y capacitaciones están diseñados específicamente para cubrir las necesidades de instituciones educativas. Brindamos formación en primeros auxilios y RCP, promoviendo una cultura de prevención y respuesta efectiva en situaciones de emergencia.',
    imageBefore: img1Before,
    imageAfter: img1After,
  },
  {
    id: 2,
    title: 'Capacitaciones para Grupos Deportivos',
    description:
      'Impulsamos la seguridad y el rendimiento deportivo con capacitaciones diseñadas para atletas y equipos deportivos.',
    info:
      'Diseñamos programas de capacitación y entrenamiento en primeros auxilios y RCP específicamente adaptados para atletas y equipos deportivos. Nuestros cursos están enfocados en brindar conocimientos prácticos y habilidades que pueden marcar la diferencia en situaciones de emergencia durante la práctica deportiva.',
    imageBefore: img2Before,
    imageAfter: img2After,
  },
  {
    id: 3,
    title: 'Capacitaciones Empresariales',
    description:
      'Facilitamos soluciones integrales de capacitación y gestión de emergencias para empresas.',
    info:
      'Nuestros programas se enfocan en la formación del personal en medidas de prevención, respuesta y atención en situaciones de emergencia, contribuyendo así a la protección del capital humano y los recursos empresariales. Promovemos un entorno laboral seguro y preparado para enfrentar contingencias.',
    imageBefore: img3Before,
    imageAfter: img3After,
  },
  {
    id: 4,
    title: 'Capacitación para Comunidad General',
    description:
      'Empoderamos a la comunidad con programas de capacitación en primeros auxilios y RCP.',
    info:
      'Brindamos conocimientos esenciales y habilidades prácticas para responder eficazmente ante emergencias médicas. Nuestros cursos están diseñados para capacitar a personas de todas las edades y perfiles, promoviendo una cultura de seguridad y solidaridad en la sociedad.',
    imageBefore: img4Before,
    imageAfter: img4After,
  },
];

const ServiciosPages = () => {
  const [selectedService, setSelectedService] = useState(null);
  const modalRef = useRef(null);

  // Cerrar modal al hacer click fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleServiceClick = (serviceId) => {
    setSelectedService(serviceId);
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };

  return (
    <section className="my-4 p-3 animate-fade-in bg-slate-100">
      <div className="p-2 md:w-2/3 md:mx-auto">
        <h1 className="text-zinc-900 text-4xl pt-4 pl-3c font-bold pl-6">Servicios</h1>
        {serviciosData.map((service) => (
          <article
            key={service.id}
            className="bg-white shadow-lg flex items-center p-3 my-2 hover:bg-orange-600 hover:text-white cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="">
              <img
                src={selectedService === service.id ? service.imageAfter : service.imageBefore}
                alt=""
                className="max-w-32 lg:w-40"
              />
              {/* Mostrar la segunda imagen si el servicio está seleccionado */}
            </div>
            <div className="ml-4 ">
              <p className="text-gray-300 text-3xl font-bold mb-2">0{service.id}</p>
              <h2 className="font-bold text-xl mb-2">{service.title}</h2>
              <p className="text-sm">{service.description}</p>
            </div>
          </article>
        ))}
      </div>
      {selectedService && (
        <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
          <div ref={modalRef} className="bg-white p-8 md:w-1/2 md:mx-auto mx-2 overflow-y-auto max-h-full rounded-lg">
            <h2 className="text-2xl font-bold mb-4">{serviciosData[selectedService - 1].title}</h2>
            <img
              src={serviciosData[selectedService - 1].imageAfter}
              alt=""
              className="w-full h-auto object-cover mb-4 rounded-lg"
            />
            {/* Mostrar la segunda imagen en la ventana desplegada */}
            <p className="text-gray-700 text-xl mb-4">{serviciosData[selectedService - 1].description}</p>
            <p className="text-gray-700 mb-4">{serviciosData[selectedService - 1].info}</p>
            <div className="flex flex-col">
              <Link
                to="/contacto"
                className="hover:bg-black bg-orange-500 text-white font-bold py-3 px-5 mb-2 w-full text-center"
              >
                Contactanos
              </Link>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-white font-bold px-4 py-2 rounded-md"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiciosPages;

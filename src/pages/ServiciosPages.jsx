import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import img1Before from '../assets/img servicios/Fomentando Héroes en las Aulas (1).png';
import img1After from '../assets/img servicios/servicio para escuelas 16-9.png';
import img2Before from '../assets/img servicios/G - R C P DEPORTISTAS.png';
import img2After from '../assets/img servicios/servicio para deportistas 16-9.png';
import img3Before from '../assets/img servicios/G - R C P EMPRESAS.png';
import img3After from '../assets/img servicios/servicio para empresas 16-9.png';

const serviciosData = [
  {
    id: 1,
    title: 'Servicio para Escuelas',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae repellat dolorum voluptas eius tempore natus animi eum aliquam nisi optio numquam mollitia cupiditate est, corrupti suscipit placeat accusamus ut unde!',
    imageBefore: img1Before,
    imageAfter: img1After,
  },
  {
    id: 2,
    title: 'Servicio para Deportistas',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae repellat dolorum voluptas eius tempore natus animi eum aliquam nisi optio numquam mollitia cupiditate est, corrupti suscipit placeat accusamus ut unde!',
    imageBefore: img2Before,
    imageAfter: img2After,
  },
  {
    id: 3,
    title: 'Servicio para Empresas',
    description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit.',
    info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae repellat dolorum voluptas eius tempore natus animi eum aliquam nisi optio numquam mollitia cupiditate est, corrupti suscipit placeat accusamus ut unde!',
    imageBefore: img3Before,
    imageAfter: img3After,
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
    <section className="bg-slate-200 my-4 p-3 animate-fade-in">
      <div className="p-2 md:w-2/3 md:mx-auto">
        <h1 className="text-zinc-700 text-4xl pt-4 pl-3c font-bold pl-6">Servicios</h1>
        {serviciosData.map((service) => (
          <article
            key={service.id}
            className="bg-white shadow-lg flex items-center p-4 my-2 transition-transform duration-200 ease-in-out hover:bg-slate-800 hover:text-white cursor-pointer"
            onClick={() => handleServiceClick(service.id)}
          >
            <div className="w-40 overflow-hidden">
              <img src={selectedService === service.id ? service.imageAfter : service.imageBefore} alt="" className="w-full h-full" /> {/* Mostrar la segunda imagen si el servicio está seleccionado */}
            </div>
            <div className="ml-4">
              <p className="text-GrisClaro text-3xl font-bold mb-2">{service.id}</p>
              <h2 className="font-bold text-xl mb-2">{service.title}</h2>
              <p className="text-GrisClaro text-sm">{service.description}</p>
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

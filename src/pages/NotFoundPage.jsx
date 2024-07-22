import React from 'react';
import underDevelopmentImage from '../assets/img 404/under-development.jpg'; // Importa la imagen de "En desarrollo"
import { Link } from 'react-router-dom';
const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center animate-fade-in">
      <div className="text-center">
        <img src={underDevelopmentImage} alt="En desarrollo" className="mx-auto my-8" style={{ maxWidth: '400px' }} />
        <h2 className="text-4xl font-bold text-orange-600 mb-4">En desarrollo</h2>
        <p className="text-xl text-gray-700 pb-6">Esta página aún está en desarrollo.</p>
        <p className="text-lg text-gray-600">Estamos trabajando en ello y estará disponible pronto.</p>
        {/* Puedes agregar un botón o enlace para volver a la página de inicio */}
        <Link to="/" className=" text-orange-500 hover:underline mt-4 inline-block mb-6">Volver a la página de inicio</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

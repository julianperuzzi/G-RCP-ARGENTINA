import React from 'react';
import underDevelopmentImage from '../assets/img 404/under-development.jpg'; // Importa la imagen de "En desarrollo"
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center flex-col animate-fade-in">
      <div className="text-center">
        <img src={underDevelopmentImage} alt="En desarrollo" className="mx-auto my-8" style={{ maxWidth: '400px' }} />
        <h2 className="text-4xl font-bold text-orange-600 mb-4">En desarrollo</h2>
        <p className="text-xl text-gray-700 pb-6">Esta página aún está en desarrollo.</p>
        <p className="text-lg text-gray-600">Estamos trabajando en ello y estará disponible pronto.</p>
        <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block mb-6">
          Volver a la página de inicio
        </Link>
      </div>

      {/* Canva Iframe */}
      {/* <div
        style={{
          position: 'relative',
          width: '100%',
          height: 0,
          paddingTop: '56.25%', // 16:9 Aspect Ratio
          boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
          marginTop: '1.6em',
          marginBottom: '0.9em',
          overflow: 'hidden',
          borderRadius: '8px',
          willChange: 'transform',
        }}
      >
        <iframe
          loading="lazy"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none',
            padding: 0,
            margin: 0,
          }}
          src="https://www.canva.com/design/DAGLt6JOgDA/-7Sn_-6clUAfvSi4TJ3nkg/view?embed"
          allowFullScreen
        ></iframe>
      </div> */}

      {/* Link to open in a new tab */}
      {/* <div className="text-center mb-8">
        <a
          href="https://www.canva.com/design/DAGLt6JOgDA/-7Sn_-6clUAfvSi4TJ3nkg/view?utm_content=DAGLt6JOgDA&utm_campaign=designshare&utm_medium=embeds&utm_source=link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-500 hover:underline"
        >
          Ver en Canva
        </a>
      </div> */}
    </div>
  );
};

export default NotFoundPage;

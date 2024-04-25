import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

import backgroundImage from '../assets/fondo oscuro.png';

export const Footer = () => {
  return (
    <footer className="bg-Azul bg-AzulOscuro text-white py-8 p-2 mt-2 pl-6 relative">
      <div className="absolute inset-0 z-0">
        <img src={backgroundImage} alt="background" className="w-full h-full object-cover opacity-10" style={{ filter: 'brightness(40%) blur(5px)' }} />
      </div>
      <div className="container mx-auto flex flex-wrap justify-between relative z-10">
        {/* Primera columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <Link to="/Contacto" className="text-white hover:text-gray-400 font-bold">Contacto</Link> {/* Cambia a Link */}
          <ul>
            <li><Link to="/nosotros" className="text-white hover:text-gray-400">Nosotros</Link></li> {/* Cambia a Link */}
            <li><Link to="/informacion-legal" className="text-white hover:text-gray-400">Información Legal</Link></li> {/* Cambia a Link */}
          </ul>
        </div>
        
        {/* Segunda columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <h3 className="font-bold mb-2">Experiencias</h3>
          <ul>
            <li><Link to="/clientes" className="text-white hover:text-gray-400">Clientes</Link></li> {/* Cambia a Link */}
            <li><Link to="/lugares" className="text-white hover:text-gray-400">Lugares</Link></li> {/* Cambia a Link */}
          </ul>
        </div>

        {/* Tercera columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <h3 className="font-bold mb-2">Redes Sociales</h3>
          <ul>
            <li><a href="https://www.instagram.com/gruporcpsa/" className="text-white hover:text-gray-400"><FontAwesomeIcon icon={faInstagram} /> Instagram</a></li>
            <li><a href="https://www.facebook.com" className="text-white hover:text-gray-400"><FontAwesomeIcon icon={faFacebook} /> Facebook</a></li>
            <li><a href="https://wa.me/+5492645270774" className="text-white hover:text-gray-400"><FontAwesomeIcon icon={faWhatsapp} /> Whatsapp</a></li>
            <li><a href="https://www.youtube.com" className="text-white hover:text-gray-400"><FontAwesomeIcon icon={faYoutube} /> Youtube</a></li>
          </ul>
        </div>

        {/* Cuarta columna */}
        <div className="w-full sm:w-auto">
          <p>&copy; 2024 All rights reserved</p>
          <p className="mt-4">Desarrollo Julian Peruzzi | <a href="https://www.linkedin.com/in/julianperuzzi/" className="text-white hover:text-gray-400">LinkedIn</a></p>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOverlayClick = (event) => {
    // Close the menu if the click was outside the menu
    if (event.target.classList.contains('menu-overlay')) {
      closeMenu();
    }
  };

  return (
    <nav
      className={`w-full sticky top-0 z-30 shadow-lg transition-all duration-500 ease-in-out content-center ${
        isHovered ? 'md:h-24' : 'md:h-14'
      } bg-slate-700`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          to="/"
          className={`font-bold hover:text-white hover:scale-105 transition duration-300 md:text-2xl text-lg bg-clip-text text-white`}
        >
          <span className="text-sky-400">G-RCP</span> ARGENTINA
        </Link>

        {/* Boton de menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-300 hover:text-sky-400 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        {/* navbar para modo escritorio */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          <Link
            to="/"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Inicio
          </Link>
          
          <Link
            to="/servicios"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Servicios
          </Link>
          <Link
            to="/nosotros"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Nosotros
          </Link>
          <Link
            to="/rcp"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Aprende RCP
          </Link>
          <Link
            to="/practica-rcp"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Ritmo RCP
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/contacto"
            className="hover:bg-sky-500 bg-orange-500 text-white px-4 py-2 text-sm font-medium"
          >
            Contactanos
          </Link>
        </div>
      </div>

      {/* apertura de boton menu en modo telefono */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-75 z-40 flex justify-end transition-opacity duration-500 ease-in-out menu-overlay"
          onClick={handleOverlayClick} // Close menu on clicking overlay
        >
          <div
            className="w-2/3 shadow-lg flex flex-col p-4 bg-gray-800 text-gray-100"
            data-aos="fade-left"
          >
            <button onClick={toggleMenu} className="self-end mb-4">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <Link
            to="/"
            className={`block px-1 py-2 font-bold border-b border-gray-400 mb-4`}
            >
             G-RCP ARGENTINA
             </Link>

            <Link
              to="/"
              onClick={closeMenu}
              className="block px-4 py-2  hover:bg-gray-900"
            >
              Inicio
            </Link>
            
            <Link
              to="/servicios"
              onClick={closeMenu}
              className="block px-4 py-2  hover:bg-gray-900"
            >
              Servicios
            </Link>
            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="block px-4 py-2  hover:bg-gray-900"
            >
              Nosotros
            </Link>
            <Link
              to="/rcp"
              onClick={closeMenu}
              className="block px-4 py-2  hover:bg-gray-900"
            >
              Aprende RCP
            </Link><Link
              to="/practica-rcp"
              onClick={closeMenu}
              className="block px-4 py-2 0 hover:bg-gray-900"
            >
              Ritmo RCP
            </Link>
            <Link
              to="/contacto"
              onClick={closeMenu}
              className="my-4 block px-4 py-2 hover:bg-gray-900 bg-sky-800"
            >
              Contactanos
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

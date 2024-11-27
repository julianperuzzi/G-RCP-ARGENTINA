import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleResourcesMenu = () => {
    setIsResourcesOpen(!isResourcesOpen);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('menu-overlay')) {
      closeMenu();
    }
  };

  return (
    <nav className="w-full sticky top-0 z-30 shadow-lg transition-all duration-300 ease-in-out content-center bg-gray-950 py-2 md:backdrop-blur-xl">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold hover:text-white hover:scale-105 transition duration-300 md:text-2xl text-xl bg-clip-text text-white"
        >
          <span className="text-sky-400">GRCP</span> ARGENTINA
        </Link>

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

        <div className="hidden md:flex items-center justify-center flex-grow">
          <Link
            to="/"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Inicio
          </Link>

          <div
            className="relative mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75 cursor-pointer"
            onMouseEnter={() => setIsResourcesOpen(true)}
            onMouseLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsResourcesOpen(false);
              }
            }}
          >
            Recursos ▾
            {isResourcesOpen && (
              <div
                className="absolute left-0 top-full  w-48 bg-gray-800 text-white  shadow-lg z-50"
                onMouseEnter={() => setIsResourcesOpen(true)}
                onMouseLeave={() => setIsResourcesOpen(false)}
              >
                <Link
                  to="/rcp"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Aprende RCP
                </Link>
                <Link
                  to="/mapadea"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Mapa DEAs
                </Link>
                <Link
                  to="/Biblioteca"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Explorar Biblioteca
                </Link>
                <Link
                  to="/practica-rcp"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Ritmo RCP
                </Link>
                <Link
                  to="/galeria"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Galeria
                </Link>
                <Link
                  to="/rcp-game"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Juego RCP
                </Link>
                <Link
                  to="/RA-Menu"
                  onClick={closeMenu}
                  className="block px-4 py-2 hover:bg-sky-600"
                >
                  Realidad Aumentada
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/nosotros"
            className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75"
          >
            Nosotros
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

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-900 backdrop-blur-md bg-opacity-75 z-40 flex justify-end transition-opacity duration-300 ease-in-out menu-overlay"
          onClick={handleOverlayClick}
        >
          <div
            className="w-2/3 shadow-lg flex flex-col p-4 bg-slate-600/50 backdrop-blur-xl text-gray-100"
            data-aos="fade-left"
          >
            <button onClick={toggleMenu} className="self-end mb-4">
              <svg
                className="w-6 h-6 text-gray-200"
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
              className="block px-1 py-2 font-bold border-b border-gray-400 mb-4"
            >
              GRCP ARGENTINA
            </Link>

            <Link
              to="/"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
            >
              Inicio
            </Link>

            <Link
              to="/servicios"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
            >
              Servicios
            </Link>
            <div className="relative block">
              <div
                className="block px-4 py-2 hover:bg-gray-900"
                onClick={toggleResourcesMenu}
              >
                Recursos ▾
              </div>
              {isResourcesOpen && (
                <div className="mt-2 bg-slate-700  shadow-lg text-white">
                  <Link
                    to="/rcp"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Aprende RCP
                  </Link>
                  <Link
                    to="/mapadea"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Mapa DEAs
                  </Link>
                  <Link
                    to="/Biblioteca"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Explorar Biblioteca
                  </Link>
                  <Link
                    to="/practica-rcp"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Ritmo RCP
                  </Link>
                  <Link
                    to="/galeria"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Galeria
                  </Link>
                  <Link
                    to="/rcp-game"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Juego RCP
                  </Link>
                  <Link
                    to="/RA-Menu"
                    onClick={closeMenu}
                    className="block px-4 py-2 hover:bg-sky-600"
                  >
                    Realidad Aumentada
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
            >
              Nosotros
            </Link>
            <Link
              to="/contacto"
              onClick={closeMenu}
              className="mt-2 bg-orange-500 text-white px-4 py-2 text-sm font-medium text-center"
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

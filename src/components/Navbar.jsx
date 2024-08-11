import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleOverlayClick = (event) => {
    if (event.target.classList.contains('menu-overlay')) {
      closeMenu();
    }
  };

  return (
    <nav className="w-full sticky top-0 z-30 shadow-lg transition-all duration-300 ease-in-out content-center md:bg-slate-700/70 bg-slate-700 py-2 md:backdrop-blur-xl">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          to="/"
          className="font-bold hover:text-white hover:scale-105 transition duration-300 md:text-2xl text-xl bg-clip-text text-white"
        >
          <span className="text-sky-400">G-RCP</span> ARGENTINA
        </Link>

        {/* Botón de menú */}
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

        {/* Navbar para modo escritorio */}
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

        {/* Botones de autenticación */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/contacto"
            className="hover:bg-sky-500 bg-orange-500 text-white px-4 py-2 text-sm font-medium"
          >
            Contactanos
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Logout
              </button>
              <span className="text-gray-200 text-xs bg-slate-800 py-1 px-2">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Apertura de botón menú en modo teléfono */}
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
              className="block px-1 py-2 font-bold border-b border-gray-400 mb-4"
              onClick={closeMenu}
            >
              G-RCP ARGENTINA
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
            <Link
              to="/nosotros"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
            >
              Nosotros
            </Link>
            <Link
              to="/rcp"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
            >
              Aprende RCP
            </Link>
            <Link
              to="/practica-rcp"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-gray-900"
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
            {isAuthenticated ? (
              <div className="flex flex-col items-start">
                
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full text-left"
                >
                  Logout
                </button>
                <span className=" mt-2 text-gray-200 text-xs bg-slate-800 py-1 px-2">{user.name}</span>
              </div>
            ) : (
              <button
                onClick={() => loginWithRedirect()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full text-left"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

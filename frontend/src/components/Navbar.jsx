import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    recursos: false,
    nosotros: false,
    cuenta: false,
  });
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (menu) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
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
    <nav className="w-full sticky top-0 z-30 shadow-lg transition-all duration-300 ease-in-out content-center  bg-gray-950 py-2 md:backdrop-blur-xl">
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

          {/* Menú desplegable de Recursos */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('recursos')}
              className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75 flex items-center"
            >
              Recursos
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.recursos && (
              <div className="absolute mt-2 w-48 bg-slate-200 text-gray-800 shadow-lg">
                <Link
                  to="/rcp"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Aprende RCP
                </Link>
                <Link
                  to="/mapadea"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Mapa DEA ARG
                </Link>
                <Link
                  to="/Biblioteca"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Explorar Biblioteca
                </Link>
                <Link
                  to="/practica-rcp"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Ritmo RCP
                </Link>
                <Link
                  to="/galeria"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Galeria
                </Link>
                <Link
                  to="/rcp-game"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Juego RCP
                </Link>
              </div>
            )}
          </div>

          {/* Menú desplegable de Nosotros */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('nosotros')}
              className="mx-2 px-4 py-2 transition-colors duration-300 text-gray-200 hover:bg-sky-600/75 flex items-center"
            >
              Nosotros
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.nosotros && (
              <div className="absolute mt-2 w-48 bg-slate-200 text-gray-800 shadow-lg">
                <Link
                  to="/nosotros"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Contáctanos
                </Link>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Instagram
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Menú de Cuenta */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => toggleDropdown('cuenta')}
              className="px-4 py-2 bg-orange-500 hover:bg-sky-500 text-white font-medium flex items-center"
            >
              Mi cuenta
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.cuenta && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                    <span className="block px-4 py-2 text-gray-600">{user.name}</span>
                  </>
                ) : (
                  <button
                    onClick={() => loginWithRedirect()}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
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
              className="block p-2 hover:bg-sky-600/75"
              onClick={closeMenu}
            >
              Inicio
            </Link>

            <button
              onClick={() => toggleDropdown('recursos')}
              className="p-2 hover:bg-sky-600/75 flex justify-between"
            >
              Recursos
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.recursos && (
              <div className="flex flex-col ml-4">
                <Link
                  to="/rcp"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Aprende RCP
                </Link>
                <Link
                  to="/mapadea"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Mapa DEA ARG
                </Link>
                <Link
                  to="/Biblioteca"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Explorar Biblioteca
                </Link>
                <Link
                  to="/practica-rcp"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Ritmo RCP
                </Link>
                <Link
                  to="/galeria"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Galería
                </Link>
                <Link
                  to="/rcp-game"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Juego RCP
                </Link>
              </div>
            )}

            <button
              onClick={() => toggleDropdown('nosotros')}
              className="p-2 hover:bg-sky-600/75 flex justify-between"
            >
              Nosotros
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.nosotros && (
              <div className="flex flex-col ml-4">
                <Link
                  to="/nosotros"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Contáctanos
                </Link>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 hover:bg-gray-700"
                  onClick={closeMenu}
                >
                  Instagram
                </a>
              </div>
            )}

            {/* Menú de Cuenta */}
            <button
              onClick={() => toggleDropdown('cuenta')}
              className=" p-2 mt-4 bg-orange-500 hover:bg-sky-500 text-white font-medium flex justify-between items-center"
            >
              Mi cuenta
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen.cuenta && (
              <div className="flex flex-col ml-4">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      className="block p-2 hover:bg-gray-700"
                      onClick={closeMenu}
                    >
                      Logout
                    </button>
                    <span className="block p-2 text-gray-300">{user.name}</span>
                  </>
                ) : (
                  <button
                    onClick={() => loginWithRedirect()}
                    className="block py-2 hover:bg-gray-700"
                    onClick={closeMenu}
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

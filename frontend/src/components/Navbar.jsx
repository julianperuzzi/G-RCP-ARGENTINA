import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../authService'; // Importa tu servicio de autenticación
import { logout } from '../authService'; // Importa tu servicio de autenticación

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    recursos: false,
    nosotros: false,
    cuenta: false,
  });
  const [user, setUser] = useState(null); // Estado para el usuario autenticado
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuario autenticado
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
  }, []);

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

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="w-full sticky top-0 z-30 shadow-lg transition-all duration-300 ease-in-out content-center bg-gray-950 py-2 md:backdrop-blur-xl">
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
                  Galería
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
              {user ? `Hola, ${user.username}` : 'Mi cuenta'}
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
                {user ? (
                  <>
                    <Link
                      to="/mi-perfil"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mi perfil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Registrarme
                    </Link>
                  </>
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
            className="w-2/3 shadow-lg flex flex-col p-4 bg-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-sky-400 text-right"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Link
              to="/"
              className="my-2 text-gray-200 hover:bg-sky-600/75 block px-4 py-2 rounded"
              onClick={closeMenu}
            >
              Inicio
            </Link>

            <button
              onClick={() => toggleDropdown('recursos')}
              className="my-2 text-gray-200 hover:bg-sky-600/75 px-4 py-2 rounded flex items-center"
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
              <div className="ml-4">
                <Link
                  to="/rcp"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Aprende RCP
                </Link>
                <Link
                  to="/mapadea"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Mapa DEA ARG
                </Link>
                <Link
                  to="/Biblioteca"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Explorar Biblioteca
                </Link>
                <Link
                  to="/practica-rcp"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Ritmo RCP
                </Link>
                <Link
                  to="/galeria"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Galería
                </Link>
                <Link
                  to="/rcp-game"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Juego RCP
                </Link>
              </div>
            )}

            <button
              onClick={() => toggleDropdown('nosotros')}
              className="my-2 text-gray-200 hover:bg-sky-600/75 px-4 py-2 rounded flex items-center"
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
              <div className="ml-4">
                <Link
                  to="/nosotros"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Contáctanos
                </Link>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Instagram
                </a>
              </div>
            )}

            <div className="my-2 text-gray-200">
              {user ? (
                <>
                  <Link
                    to="/mi-perfil"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Mi perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={closeMenu}
                  >
                    Registrarme
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

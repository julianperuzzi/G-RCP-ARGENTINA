import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';


function Navbar({ darkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={`w-full sticky top-0 z-30 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-slate-700'}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className={`font-bold hover:text-white md:text-2xl text-lg bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-orange-300 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          G-RCP ARGENTINA
        </Link>
        <div className="md:hidden">
          <button onClick={toggleMenu} className={`${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:text-purple-800 focus:outline-none`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
        <div className="hidden md:flex items-center justify-center flex-grow">
          <Link to="/" className={`mx-2 px-4 py-2  transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-200 hover:bg-sky-600/75'}`}>
            Inicio
          </Link>
          <Link to="/rcp" className={`mx-2 px-4 py-2  transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-200 hover:bg-sky-600/75'}`}>
            Aprende RCP
          </Link>
          <Link to="/servicios" className={`mx-2 px-4 py-2  transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-200 hover:bg-sky-600/75'}`}>
            Servicios
          </Link>
          <Link to="/nosotros" className={`mx-2 px-4 py-2  transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-200 hover:bg-sky-600/75'}`}>
            Nosotros
          </Link>
          <Link to="/contacto" className={`mx-2 px-4 py-2  transition-colors duration-300 ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-200 hover:bg-sky-600/75'}`}>
            Contactanos
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          
          <button
            onClick={toggleDarkMode}
            className={`hover:text-white bg-sky-900 px-3 py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-600 text-gray-300'}`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-75 z-40 flex justify-end">
          <div className={`w-2/3  shadow-lg flex flex-col p-4 ${darkMode ? 'bg-slate-800 text-gray-200' : 'text-gray-300 bg-white'}`} >
            <button onClick={toggleMenu} className="self-end mb-4">
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <Link to="/" onClick={closeMenu} className={`block px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:bg-gray-200`}>Inicio</Link>
            <Link to="/rcp" onClick={closeMenu} className={`block px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:bg-gray-200`}>Aprende RCP</Link>
            <Link to="/servicios" onClick={closeMenu} className={`block px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:bg-gray-200`}>Servicios</Link>
            <Link to="/nosotros" onClick={closeMenu} className={`block px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:bg-gray-200`}>Nosotros</Link>
            <Link to="/contacto" onClick={closeMenu} className={`block px-4 py-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'} hover:bg-gray-200`}>Contactanos</Link>
            
            <button
              onClick={() => {
                toggleDarkMode();
                closeMenu();
              }}
              className={`mt-4 hover:text-white bg-sky-900 px-3 py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-sky-900 text-white' : 'bg-sky-900 text-gray-300'}`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RA_Menu = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);

  const toggleSubMenu = () => {
    setShowSubMenu(!showSubMenu);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Realidad Aumentada</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 ">
        {/* Card para "Realidad Aumentada con Códigos" */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
          <img src="https://i.pinimg.com/736x/b6/07/f0/b607f0fbc471927dd169f5c048e68f03.jpg" alt="AR con Códigos" className="w-full h-40 object-cover rounded-t-lg" />
          <h2 className="text-xl font-semibold mt-4">Realidad Aumentada con Códigos</h2>
          <a
            href="https://dea-grcp-ar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Explorar
          </a>
        </div>

        {/* Card para "Ver Modelos en 3D" */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
          <img src="https://i.pinimg.com/564x/12/c3/70/12c370e13f2d49492f1d60dd03fcde68.jpg" alt="Ver Modelos en 3D" className="w-full h-40 object-cover rounded-t-lg" />
          <h2 className="text-xl font-semibold mt-4">Ver Modelos en 3D</h2>
          <button
            onClick={toggleSubMenu}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Explorar
          </button>

          {/* Submenú Desplegable */}
          {showSubMenu && (
            <div className="mt-4 bg-gray-200 w-full rounded-lg shadow-inner p-2">
              <ul className="space-y-2">
                <li>
                  <Link to="/defibrillator-1" className="w-full text-left bg-white px-3 py-2 rounded hover:bg-gray-300 block">
                    Desfibrilador 1
                  </Link>
                </li>
                <li>
                  <Link to="/defibrillator-2" className="w-full text-left bg-white px-3 py-2 rounded hover:bg-gray-300 block">
                    Desfibrilador 2
                  </Link>
                </li>
                <li>
                  <a
                    href="https://sketchfab.com/3d-models/human-heart-3d-model-c0fdd3d906b6421e926167a2220a25dc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left bg-white px-3 py-2 rounded hover:bg-gray-300 block"
                  >
                    Corazón Animación
                  </a>
                </li>
                <li>
                  <Link to="/dea-patches" className="w-full text-left bg-white px-3 py-2 rounded hover:bg-gray-300 block">
                    Parches DEA
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RA_Menu;

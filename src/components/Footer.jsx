import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-Azul bg-AzulOscuro text-white py-8 p-2">
      <div className="container mx-auto flex flex-wrap justify-between">
        {/* Primera columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <h3 className="font-bold mb-2">Contacto</h3>
          <ul>
            <li><a href="/nosotros" className="text-white hover:text-gray-400">Nosotros</a></li>
            <li><a href="/informacion-legal" className="text-white hover:text-gray-400">Información Legal</a></li>
          </ul>
        </div>
        
        {/* Segunda columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <h3 className="font-bold mb-2">Experiencias</h3>
          <ul>
            <li><a href="/clientes" className="text-white hover:text-gray-400">Clientes</a></li>
            <li><a href="/lugares" className="text-white hover:text-gray-400">Lugares</a></li>
          </ul>
        </div>

        {/* Tercera columna */}
        <div className="w-full sm:w-auto mb-4 sm:mb-0 border-b-2 border-zinc-300 pb-2">
          <h3 className="font-bold mb-2">Redes Sociales</h3>
          <ul>
            <li><a href="https://www.instagram.com" className="text-white hover:text-gray-400">Instagram</a></li>
            <li><a href="https://www.facebook.com" className="text-white hover:text-gray-400">Facebook</a></li>
            <li><a href="https://wa.me" className="text-white hover:text-gray-400">Whatsapp</a></li>
            <li><a href="https://www.youtube.com" className="text-white hover:text-gray-400">Youtube</a></li>
          </ul>
        </div>

        {/* Cuarta columna */}
        <div className="w-full sm:w-auto">
          
          <p>&copy; 2024 All rights reserved</p>
          <p className="mt-4">Desarrollo Julian Peruzzi</p>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import imgLibreria from '../assets/1055107_bookshelf_books_library_icon.svg';

export const Teoria = () => {
  return (
    <section className="flex justify-center items-center bg-zinc-900 ">
      <div className="sm:flex lg:w-2/3 justify-right items-center mb-4 ">
        <div className="p-4">
          <h2 className="text-3xl font-bold text-white mb-2">Librería de Primeros Auxilios</h2>
          <p className="text-white">Aquí encontrarás toda la teoría necesaria para aprender primeros auxilios y cómo actuar en situaciones de emergencia.</p>
          <p className="text-gray-300">No dudes en explorar nuestra amplia colección de recursos para estar preparado ante cualquier eventualidad.</p>
          <a href="/link-a-libreria" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Explorar Librería</a>
        </div>
      </div>
    </section>
  );
};

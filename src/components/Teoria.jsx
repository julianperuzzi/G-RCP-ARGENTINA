import React from 'react';
import imgLibreria from '../assets/1055107_bookshelf_books_library_icon.svg';
import { Link } from 'react-router-dom';

export const Teoria = () => {
  return (
    <section className="flex justify-center items-center bg-zinc-900">
      <div className="sm:flex lg:w-2/3 justify-right items-center my-8 ">
        <div className="p-4">
          <h2 className="text-3xl font-bold text-white mb-2">BIBLIOTECA DE PRIMEROS AUXILIOS</h2>
          <p className="text-white">Aquí encontrarás toda la teoría necesaria para aprender primeros auxilios y cómo actuar en situaciones de emergencia.</p>
          <p className="text-gray-300">No dudes en explorar nuestra amplia colección de recursos para estar preparado ante cualquier eventualidad.</p>
          <Link to="/Biblioteca" className="mt-2 inline-block bg-orange-400 hover:bg-black text-white font-bold py-2 px-4">Explorar Bibiolteca</Link>
        </div>
      </div>
    </section>
  );
};

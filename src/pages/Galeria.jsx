import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const images = [
  { src: 'https://i.pinimg.com/736x/76/40/73/764073fd2629f72689df6b96d9ea27c7.jpg'},
  { src: 'https://i.pinimg.com/736x/a2/ba/a7/a2baa732bb15debb77ff64fc40b57c3d.jpg'},
  // Añade más imágenes aquí
];

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-white min-h-screen px-2">
      <div className="container mx-auto py-8">
        <h3 className="text-4xl font-bold text-center mb-8 uppercase border-gray-600 border-b-2 pb-6">Galería</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative " data-aos="fade-up">
              <div className='hover:scale-105 transition-transform duration-300'>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover shadow-lg rounded transform cursor-pointer"
                  onClick={() => openModal(image)}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 ">
                  {/* <p className="text-white text-sm">{image.alt}</p> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black backdrop-blur-lg bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white bg-black px-2 text-2xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="md:max-h-[75vh] max-h-full max-w-full"
            />
            <div className="text-center mt-4">
              <a
                href={selectedImage.src}
                download
                className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-600 transition"
              >
                Descargar
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Galeria;

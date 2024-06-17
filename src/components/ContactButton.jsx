import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import 'tailwindcss/tailwind.css';

const ContactButton = () => {
  return (
    <a
      href="https://wa.me/+54 9 2645 66-7981" // Reemplaza con tu número de WhatsApp
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 bg-green-500 text-white p-5 rounded-full shadow-lg flex items-center justify-center animate-bounce hover:bg-blue-600 transition duration-300 ease-in-out z-20"
    >
      <FontAwesomeIcon icon={faWhatsapp} size="2x" />
    </a>
  );
};

export default ContactButton;

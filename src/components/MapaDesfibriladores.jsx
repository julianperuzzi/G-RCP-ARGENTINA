import React from 'react';

const MapaDesfibriladores = () => {
  return (
    <div>
      <h3>Mapa de Desfibriladores en Argentina</h3>
      <iframe
        title="Mapa de Desfibriladores"
        src="https://www.google.com/maps/d/u/0/embed?mid=1kjiWpPktBA6XDvOoF_z9Ulabi1uBR6I&ehbc=2E312F&noprof=1"
        width="600"
        height="450"
        allowfullscreen=""
        loading="lazy"
      ></iframe>
    </div>
  );
}

export default MapaDesfibriladores;

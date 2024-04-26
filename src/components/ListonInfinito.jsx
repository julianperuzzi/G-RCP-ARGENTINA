import React from "react";
import Marquee from "react-fast-marquee";
import Imagen1 from "../assets/liston clientes/1.png";
import Imagen2 from "../assets/liston clientes/2.png";
import Imagen3 from "../assets/liston clientes/3.png";
import Imagen4 from "../assets/liston clientes/4.png";
import Imagen5 from "../assets/liston clientes/5.png";
import Imagen6 from "../assets/liston clientes/6.png";
import Imagen7 from "../assets/liston clientes/7.png";
import Imagen8 from "../assets/liston clientes/8.png";
import Imagen9 from "../assets/liston clientes/9.png";
import Imagen10 from "../assets/liston clientes/10.png";
import Imagen11 from "../assets/liston clientes/11.png";

const ListonInfinito = () => {
  return (
    <aside className="lg:w-2/3 md:mx-auto mt-4 z-10">
      <h2 className=" text-3xl  text-gray-700 font-bold mx-4 text-center">RESPALDO</h2>
    <div className="md:mb-4 mt-3">
      <Marquee direction="right">
        <img src={Imagen1} alt="Logo 1" className="w-32 px-3" />
        <img src={Imagen2} alt="Logo 2" className="w-32 px-3" />
        <img src={Imagen3} alt="Logo 3" className="w-32 px-3" />
        <img src={Imagen4} alt="Logo 4" className="w-32 px-3" />
        <img src={Imagen5} alt="Logo 5" className="w-32 px-3" />
        <img src={Imagen1} alt="Logo 1" className="w-32 px-3" />
        <img src={Imagen2} alt="Logo 2" className="w-32 px-3" />
        <img src={Imagen3} alt="Logo 3" className="w-32 px-3" />
        <img src={Imagen4} alt="Logo 4" className="w-32 px-3" />
        <img src={Imagen5} alt="Logo 5" className="w-32 px-3" />

      </Marquee>
      </div>
      <div className="md:mb-4 mt-5">
      <Marquee direction="left">
        <img src={Imagen6} alt="Logo 6" className="w-32 px-3" />
        <img src={Imagen7} alt="Logo 7" className="w-32 px-3" />
        <img src={Imagen8} alt="Logo 8" className="w-32 px-3" />
        <img src={Imagen9} alt="Logo 9" className="w-32 px-3" />
        <img src={Imagen10} alt="Logo 10" className="w-32 px-3" />
        <img src={Imagen11} alt="Logo 11" className="w-32 px-3" />
        <img src={Imagen6} alt="Logo 6" className="w-32 px-3" />
        <img src={Imagen7} alt="Logo 7" className="w-32 px-3" />
        <img src={Imagen8} alt="Logo 8" className="w-32 px-3" />
        <img src={Imagen9} alt="Logo 9" className="w-32 px-3" />
        <img src={Imagen10} alt="Logo 10" className="w-32 px-3" />
        <img src={Imagen11} alt="Logo 11" className="w-32 px-3" />

      </Marquee>
      </div>
    </aside>
  );
};

export default ListonInfinito;

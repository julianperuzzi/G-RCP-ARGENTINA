import React from "react";
import Marquee from "react-fast-marquee";
import Imagen1 from "../assets/liston clientes/1.png";
import Imagen2 from "../assets/liston clientes/2.png";
import Imagen3 from "../assets/liston clientes/3.png";
import Imagen4 from "../assets/liston clientes/4.png";
import Imagen5 from "../assets/liston clientes/5.png";
import Imagen6 from "../assets/liston clientes/6.png";
import Imagen7 from "../assets/liston clientes/7.png";
import Imagen8 from "../assets/liston clientes/Liston de Marcas.png";
import Imagen9 from "../assets/liston clientes/9.png";
import Imagen10 from "../assets/liston clientes/10.png";
import Imagen11 from "../assets/liston clientes/11.png";
import Imagen12 from "../assets/liston clientes/Liston de Marcas (2).png";

const ListonInfinito = () => {
  return (
    <aside className=" md:mx-auto mt-4 ">
      <h2 className=" text-4xl  text-gray-700 font-bold mx-4 text-center">RESPALDO</h2>
    <div className="md:mb-4 mt-3">
      <Marquee direction="right">
        <img src={Imagen1} alt="Logo 1" className="md:w-32 w-24  mx-4" />
        <img src={Imagen2} alt="Logo 2" className="md:w-32 w-24  mx-4" />
        <img src={Imagen3} alt="Logo 3" className="md:w-32 w-24  mx-4" />
        <img src={Imagen4} alt="Logo 4" className="md:w-32 w-24  mx-4" />
        <img src={Imagen5} alt="Logo 5" className="md:w-32 w-24  mx-4" />
        <img src={Imagen1} alt="Logo 1" className="md:w-32 w-24  mx-4" />
        <img src={Imagen2} alt="Logo 2" className="md:w-32 w-24  mx-4" />
        <img src={Imagen3} alt="Logo 3" className="md:w-32 w-24  mx-4" />
        <img src={Imagen4} alt="Logo 4" className="md:w-32 w-24  mx-4" />
        <img src={Imagen5} alt="Logo 5" className="md:w-32 w-24  mx-4" />

      </Marquee>
      </div>
      <div className="md:mb-4">
      <Marquee direction="left">
        <img src={Imagen6} alt="Logo 6" className="md:w-32 w-24  mx-4" />
        <img src={Imagen7} alt="Logo 7" className="md:w-32 w-24  mx-4" />
        <img src={Imagen8} alt="Logo 8" className="md:w-32 w-24  mx-4" /> 
        <img src={Imagen9} alt="Logo 9" className="md:w-32 w-24  mx-4" />
        <img src={Imagen10} alt="Logo 10" className="md:w-32 w-24  mx-4" />
        <img src={Imagen11} alt="Logo 11" className="md:w-32 w-24  mx-4"/>
        <img src={Imagen12} alt="Logo 12" className="md:w-32 w-24  mx-4"/>
        <img src={Imagen6} alt="Logo 6" className="md:w-32 w-24  mx-4" />
        <img src={Imagen7} alt="Logo 7" className="md:w-32 w-24  mx-4" />
        <img src={Imagen8} alt="Logo 8" className="md:w-32 w-24  mx-4" />
        <img src={Imagen9} alt="Logo 9" className="md:w-32 w-24  mx-4" />
        <img src={Imagen10} alt="Logo 10" className="md:w-32 w-24  mx-4" />
        <img src={Imagen11} alt="Logo 11" className="md:w-32 w-24  mx-4" />
        <img src={Imagen12} alt="Logo 12" className="md:w-32 w-24  mx-4"/>

      </Marquee>
      </div>
    </aside>
  );
};

export default ListonInfinito;

import React, { useState } from 'react';
import burgerMenu from '../assets/134216_menu_lines_hamburger_icon.svg';
import closeBtn from '../assets/211651_close_round_icon.svg';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [menuClicked, setMenuClicked] = useState(true);

  const handleClick = () => {
    setMenuClicked(prevState => !prevState);
  };

  const handleLinkClick = () => {
    setMenuClicked(true); // Oculta la barra de navegación al hacer clic en un enlace
  };

  return (
    <>
      <div className={`${menuClicked ? 'hidden' : 'absolute inset-0 bg-black bg-opacity-20 backdrop-blur-md'} fixed top-0 left-0 w-full h-full z-10`} onClick={handleClick}></div>
      <ul className={`${menuClicked ? 'hidden' : ''} absolute bg-white bg-opacity-90 backdrop-filter backdrop-blur-md top-0 right-0 w-[256px] p-[24px] h-full text-[18px] sm:flex sm:items-center sm:w-[438px] sm:place-content-around sm:p-0 sm:h-auto sm:relative sm:text-[16px] z-20`}>
        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer sm:hidden  flex place-content-end`}>
          <img className='w-8 h-8 mb-[87px]' src={closeBtn} onClick={handleClick} alt="" />
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed sm:text-4' to="/" onClick={handleLinkClick}>Home</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/Nosotros" onClick={handleLinkClick}>New</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/Nosotros" onClick={handleLinkClick}>Nosotros</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/Escuelas" onClick={handleLinkClick}>Escuelas</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="#" onClick={handleLinkClick}>Categories</Link>
        </li>
      </ul>
      <img className={`${menuClicked ? '' : 'hidden'}  cursor-pointer sm:hidden pr-4`} src={burgerMenu} onClick={handleClick} alt="" />
    </>
  );
};

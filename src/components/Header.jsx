import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoAfterScroll from '../assets/logo white minimal g rcp .pptx.svg';
import logoBeforeScroll from '../assets/logo g.rcp sin letras.svg';
import burgerMenu from '../assets/134216_menu_lines_hamburger_icon.svg';
import closeBtn from '../assets/211651_close_round_icon.svg';

const Navbar = ({ handleLinkClick, menuClicked, setMenuClicked }) => {
  const handleClick = () => {
    setMenuClicked(prevState => !prevState);
  };

  return (
    <>
      <div className={`${menuClicked ? 'hidden' : 'fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md animate-fade-in'} top-0 left-0 w-1/2 h-full z-10`} onClick={handleClick}></div>

      <ul className={`${menuClicked ? 'hidden' : ''} fixed  backdrop-filter backdrop-blur-md top-0 right-0 w-1/2 p-[24px] h-full text-[18px] xl:flex xl:items-center bg-slate-100 xl:place-content-around xl:p-0 xl:h-auto xl:relative xl:text-[16px] z-20 xl:gap-3 text-slate-600` }>
        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer lg:hidden  flex place-content-end`}>
          <img className='w-8 h-8 mb-[87px]' src={closeBtn} onClick={handleClick} alt="" />
        </li>
        <li className='mb-8 lg:mb-0'>
          <Link className='hover:text-SoftRed' to="/" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Inicio</Link>
        </li>        
        <li className='mb-8 lg:mb-0'>
          <Link className='hover:text-SoftRed' to="/rcp" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Aprende RCP</Link>
        </li>
        <li className='mb-8 lg:mb-0'>
          <Link className='hover:text-SoftRed' to="/Servicios" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Servicios</Link>
        </li>
        
        <li className='mb-8 lg:mb-0'>
          <Link className='hover:text-SoftRed' to="/Nosotros" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Nosotros</Link>
        </li>
        <li className='mb-8 lg:mb-0'>
          <Link className=' text-blue-500 hover:text-SoftRed' to="/Contacto" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Contactanos</Link>
        </li>
        <li className='mb-8 lg:mb-0'>
          <Link className='hover:text-SoftRed' to="/Mineras" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Bienestar Minero</Link>
        </li>
        
        <img className={`block md:hidden lg:w-[80px]`} src={logoAfterScroll} alt="logo" />
        </ul>
      <img className={`${menuClicked ? '' : 'hidden'}  cursor-pointer lg:hidden pr-4 `} src={burgerMenu} onClick={handleClick} alt="" />
    </>
  );
};

const Header = () => {
  const [menuClicked, setMenuClicked] = useState(true);

  const handleLinkClick = () => {
    setMenuClicked(false); // Oculta la barra de navegación al hacer clic en un enlace
  };

  return (
    <header className={`flex place-content-between items-center  sticky top-0 z-30 lg:px-4 `} style={{ backgroundColor: 'rgba(241, 245 ,249, 1)' }}>
      
      <Link to="/">
        <img className={`md:w-[80px] w-[60px] ml-6 m-2 `} src={logoBeforeScroll} alt="logo" />
      </Link>
      <Navbar handleLinkClick={handleLinkClick} menuClicked={menuClicked} setMenuClicked={setMenuClicked} />
    </header>
  );
};

export default Header;

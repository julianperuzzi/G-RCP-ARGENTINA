import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoBeforeScroll from '../assets/logo white minimal g rcp .pptx.svg';
import logoAfterScroll from '../assets/logo g.rcp sin letras.svg';
import burgerMenu from '../assets/134216_menu_lines_hamburger_icon.svg';
import closeBtn from '../assets/211651_close_round_icon.svg';

const Navbar = ({ handleLinkClick, menuClicked, setMenuClicked }) => {
  const handleClick = () => {
    setMenuClicked(prevState => !prevState);
  };

  return (
    <>
      <div className={`${menuClicked ? 'hidden' : 'fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md'} top-0 left-0 w-1/2 h-full z-10`} onClick={handleClick}></div>

      <ul className={`${menuClicked ? 'hidden' : ''} fixed bg-white bg-opacity-90 backdrop-filter backdrop-blur-md top-0 right-0 w-1/2 p-[24px] h-full text-[18px] sm:flex sm:items-center sm:w-[438px] sm:place-content-around sm:p-0 sm:h-auto sm:relative sm:text-[16px] z-20`}>



        <li className={`${menuClicked ? 'hidden' : ''} cursor-pointer sm:hidden  flex place-content-end`}>
          <img className='w-8 h-8 mb-[87px]' src={closeBtn} onClick={handleClick} alt="" />
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed sm:text-4' to="/" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Home</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/News" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Blog</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/Nosotros" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Nosotros</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="/Escuelas" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Escuelas</Link>
        </li>
        <li className='mb-8 sm:mb-0'>
          <Link className='hover:text-SoftRed' to="#" onClick={() => { handleLinkClick(); setMenuClicked(true); }}>Categories</Link>
        </li>
      </ul>
      <img className={`${menuClicked ? '' : 'hidden'}  cursor-pointer sm:hidden pr-4`} src={burgerMenu} onClick={handleClick} alt="" />
    </>
  );
};

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuClicked, setMenuClicked] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = () => {
    setScrolled(false); // Oculta la barra de navegación al hacer clic en un enlace
  };

  return (
    <header className={`flex place-content-between items-center my-2 border-b-2 ${scrolled ? 'sticky top-0 bg-white' : ''}`} style={{ transition: 'background-color 0.8s', zIndex: 100, backgroundColor: scrolled ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)' }}>
      <Link to="/">
        <img className={`md:w-[130px] w-[100px] ${scrolled ? 'w-[50px] my-2 ml-6 md:w-[100px] ' : ''}`} src={scrolled ? logoAfterScroll : logoBeforeScroll} alt="logo" />
      </Link>
      <Navbar handleLinkClick={handleLinkClick} menuClicked={menuClicked} setMenuClicked={setMenuClicked} />
    </header>
  );
};

export default Header;
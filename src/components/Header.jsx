// ya no es necesario llamar la importacion de react en las ultimas versiones
// se puede usar js o jsx es los mimso en este caso
// los componentes llevan los nombres en mayusculo para diferenciarlos de las etiqueteas html
import logo from'../assets/logo white minimal g rcp .pptx.svg'
import { Navbar } from './Navbar'
import { Link } from 'react-router-dom'


export const Header = () => {
  return (
    <header className=" flex place-content-between items-center mb-8 border-b-2">
      <Link to="/">
        <img className='w-[100px]' src={logo} alt="logo"  />
        </Link>
        <Navbar/>

    </header>

  )
}


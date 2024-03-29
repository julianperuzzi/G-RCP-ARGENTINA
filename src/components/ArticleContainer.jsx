import React from 'react'
import { Article } from './Article'
import img1 from '../assets/Fomentando Héroes en las Aulas (1).png'
import img2 from '../assets/G - R C P DEPORTISTAS.png'
import img3 from '../assets/G - R C P EMPRESAS.png'

export const ArticleContainer = () => {
  return (
    <section className="mt-6 lg:flex lg:gap-10 p-4">

        <Article
        img={img1}
        number='01'
        tittle='School Service'
        descr='Lorem ipsum dolor, sit amet consectetur adipisicing elit.'
        />
        <Article
        img={img2}
        number='02'
        tittle='Sport Service'
        descr='Lorem ipsum dolor, sit amet consectetur adipisicing elit.'/>

        <Article
        img={img3}
        number='03'
        tittle='Work Service'
        descr='Lorem ipsum dolor, sit amet consectetur adipisicing elit.'/>

        </section>
  )
}



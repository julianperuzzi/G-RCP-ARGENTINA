
import { MainArticle } from "../components/MainArticle"
import { Blog } from "../components/Blog"
import { Servicios } from "../components/Servicios"
import { Equipo } from "./Equipo"
import { Certificacion } from "../components/Certificacion"
import { Teoria } from "../components/Teoria"
import ListonInfinito from "../components/ListonInfinito"

import React from 'react'

export const About = () => {
  return (
    <>

      <div className="xl:flex xl:gap-8 px-4 pt-1 ">
      <MainArticle/>
      <Blog/>
      </div>

      <Servicios/>
      <Certificacion/>
      <Teoria/>
      <ListonInfinito/>


    </>
  )
}



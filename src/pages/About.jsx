
import { MainArticle } from "../components/MainArticle"
import { NewContainer } from "../components/NewContainer"
import { ArticleContainer } from "../components/ArticleContainer"
import { Equipo } from "./Equipo"
import { Certificacion } from "../components/Certificacion"
import { Teoria } from "../components/Teoria"
import ListonInfinito from "../components/ListonInfinito"

import React from 'react'

export const About = () => {
  return (
    <>
      <div className="lg:flex lg:gap-8 px-4 pt-6">
      <MainArticle/>
      <NewContainer/>
      </div>
      {/* <ListonInfinito/> */}
      <ArticleContainer/>
      <Certificacion/>
      <Teoria/>
    </>
  )
}



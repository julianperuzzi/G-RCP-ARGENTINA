import React from 'react'
import { ArticleContainer } from './ArticleContainer'

export const Article = ({img,number,tittle,descr}) => {
  return (
    <article className='flex h-[162px]'>
        <div className='w-[110px] flex-none'>
        <img src={img} alt="" />
        </div>

        <div className='pl-6'>
            <p className='text-GrisClaro text-3xl mb-[6px] font-bold'>{number}</p>

            <h2 className='font-bold mb-[6px] hover:text-SoftOrange cursor-pointer'>{tittle}</h2>

            <p className='text-GrisClaro text-[16px]'>{descr}</p>
        </div>
    </article>

  )
}


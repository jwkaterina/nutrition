'use client'

import { useContext, useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Slider from '@/app/components/slider';
import { SlideType } from '@/app/types/types';
import MainNav from '@/app/components/nav-bar/main-nav';
import OpenCardMenu from '@/app/components/nav-bar/menus/opencard-menu';
import { CardOpenContext } from './context/card-context';

export default function Home(): JSX.Element {

  const [slide, setSlide] = useState<SlideType>(SlideType.FOOD);
  const [blockScrollHandler, setBlockScrollHandler] = useState<boolean>(false);
  const cardOpen = useContext(CardOpenContext);

  return (
    <>
      <NavBar color={"var(--primary-color)"}>
        {cardOpen ? 
          <OpenCardMenu 
              slide={slide}
          /> : 
          <MainNav
              slide={slide} 
              setSlide={setSlide}
              setBlockScrollHandler={setBlockScrollHandler}
          />}
      </NavBar>
      <Slider slide={slide} setSlide={setSlide} blockScrollHandler={blockScrollHandler} />
    </>
  )
}

'use client'

import { useContext } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Slider from '@/app/components/slider/slider';
import MainNav from '@/app/components/nav-bar/main-nav';
import OpenCardMenu from '@/app/components/nav-bar/menus/opencard-menu';
import { CardOpenContext } from './context/card-context';

export default function Home(): JSX.Element {

  const cardOpen = useContext(CardOpenContext);

  return (
    <>
      <NavBar color={"var(--primary-color)"}>
        {cardOpen ? 
          <OpenCardMenu 
          /> : 
          <MainNav/>}
      </NavBar>
      <Slider />
    </>
  )
}

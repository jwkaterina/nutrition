'use client'

import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useContext, useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Slider from '@/app/components/slider';
import { SlideType } from '@/app/types/types';
import MainMenu from '@/app/components/nav-bar/main-menu';
import OpenCardMenu from '@/app/components/nav-bar/opencard-menu';
import { CardOpenContext } from './context/card-context';

export default function Home(): JSX.Element {

  // const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     // console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  const [slide, setSlide] = useState<SlideType>(SlideType.FOOD);
  const [blockScrollHandler, setBlockScrollHandler] = useState<boolean>(false);
  const cardOpen = useContext(CardOpenContext);

  return (
    <>
      <NavBar color={"var(--primary-color)"}>
        {cardOpen ? 
          <OpenCardMenu 
              slide={slide}
              cardOpen={cardOpen}
          /> : 
          <MainMenu 
              slide={slide} 
              setSlide={setSlide}
              setBlockScrollHandler={setBlockScrollHandler}
          />}
      </NavBar>
      <Slider slide={slide} setSlide={setSlide} blockScrollHandler={blockScrollHandler} />
    </>
  )
}

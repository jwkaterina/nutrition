'use client'

import styles from './page.module.css'
import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar';
import Slider from '@/app/components/slider';
import Footer from '@/app/components/footer';

export enum Slide {
  FOOD,
  RECIPE,
  MENU
}

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

  const [slide, setSlide] = useState<Slide>(Slide.FOOD);
  const [blockScrollHandler, setBlockScrollHandler] = useState<boolean>(false);

  const mediaQuery = window.matchMedia('(max-width: 600px)');

  return (
    <div>
      <NavBar slide={slide} setSlide={setSlide} setBlockScrollHandler={setBlockScrollHandler} />
      <Slider slide={slide} setSlide={setSlide} blockScrollHandler={blockScrollHandler} />
   </div>
  )
}

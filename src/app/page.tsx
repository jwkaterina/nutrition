'use client'

import styles from './page.module.css'
import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar';
import Slider from '@/app/components/slider';

export enum Slide {
  FOOD,
  RECIPE,
  MENU
}

export default function Home() {

  // const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     // console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  const [scrollTo, setScrollTo] = useState<Slide>(Slide.FOOD);

  return (
    <div>
      <NavBar slide={scrollTo} scrollTo={setScrollTo}/>
      <Slider slide={scrollTo}/>
    </div>
  )
}

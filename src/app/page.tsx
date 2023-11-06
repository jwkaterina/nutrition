'use client'

import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Slider from '@/app/components/slider';
import { SlideType } from '@/app/types/types';
import HomeProviders from './context/home-providers';

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

  return (
    <HomeProviders>
      <NavBar slide={slide} setSlide={setSlide} setBlockScrollHandler={setBlockScrollHandler} />
      <Slider slide={slide} setSlide={setSlide} blockScrollHandler={blockScrollHandler} />
    </HomeProviders>
  )
}

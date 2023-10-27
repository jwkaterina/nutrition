'use client'

import styles from './page.module.css'
import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useEffect, useState, useRef } from 'react' 
import Food from './food/page';
import Recipe from './recipe/page';
import Menu from './menu/page';
import NavBar from '@/app/components/nav-bar';

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

  const slidesRef = useRef(null);
  const [scrollTo, setScrollTo] = useState<Slide>(Slide.FOOD);


  useEffect(() => {
    if(!slidesRef.current) return;
    slidesRef.current.scrollTo({
      top: 0,
      left: slidesRef.current.clientWidth * scrollTo,
      behavior: "smooth",
    });
  }, [scrollTo]);

  return (
    <div className={styles.slider}>
      {/* <div className='slide'>{data.calories != 0 ? data.calories : 'Home'}</div> */}
      <NavBar scrollTo={setScrollTo}/>
      <div className={styles.slides} ref={slidesRef}>
        <Food/>
        <Recipe/>
        <Menu />
      </div>
    </div>
  )
}

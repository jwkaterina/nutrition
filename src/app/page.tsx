'use client'

import styles from './page.module.css'
import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useEffect, useState } from 'react' 
import Food from './food/page';
import Recipe from './recipe/page';
import Menu from './menu/page';
import NavBar from '@/app/components/nav-bar';

export default function Home() {

  const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     // console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  const [scroll, setScroll] = useState(null);

  return (
    <div className={styles.slider}>
      {/* <div className='slide'>{data.calories != 0 ? data.calories : 'Home'}</div> */}
      <NavBar />
      <div className={styles.slides}>
        <Food />
        <Recipe />
        <Menu />
      </div>
    </div>
  )
}

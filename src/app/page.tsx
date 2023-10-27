'use client'

import styles from './page.module.css'
import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useEffect, useState } from 'react' 

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

  return (
    <div className='title'>{data.calories != 0 ? data.calories : 'Home'}</div>
  )
}

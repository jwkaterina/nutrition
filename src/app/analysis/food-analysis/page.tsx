'use client'

import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Slider from '@/app/components/slider';
// import HomeProviders from './context/home-providers';

export const FoodSearch = (): JSX.Element => {

  // const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     // console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  return (
    <h1>Food Search</h1>
  )
}

export default FoodSearch

'use client'

import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import { useState } from 'react' 
import NavBar from '@/app/analysis/components/nav-bar';
import Search from '../components/search';

export const MenuSearch = (): JSX.Element => {

  // const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     // console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  return (<>
    <NavBar header={'Menu Analysis'}/>
    <Search />
  </>
  )
}

export default MenuSearch

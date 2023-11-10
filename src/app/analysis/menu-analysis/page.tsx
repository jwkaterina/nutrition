'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
// import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import Search from '../components/search';
import AnalysisMenu from '@/app/components/nav-bar/menus/analysis-menu';

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
    <NavBar color={'var(--secondary-color)'}>
        <AnalysisMenu title="Menu"/>
    </NavBar>
    <Search>
      <h1>Menu Search</h1>
    </Search>
  </>
  )
}

export default MenuSearch

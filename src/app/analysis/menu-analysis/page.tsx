'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
// import { useState } from 'react' 
import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';

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

  const handleHeaderClick = () => {
    // console.log('header clicked');
  }

  return (<>
    <NavBar color={'var(--secondary-color)'}>
        <AnalysisMenu title="Menu" onHeaderClick={handleHeaderClick}/>
    </NavBar>
      <h1>Menu Search</h1>
  </>
  )
}

export default MenuSearch

'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
// import { useState } from 'react' 
import NavBar from '@/app/components/nav-bar/nav-bar';
import NavbarStyles from '@/app/components/nav-bar/nav-bar.module.css';
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
    <NavBar color={'var(--secondary-color)'}>
      <div className={NavbarStyles.header}>Menu Analysis</div>
    </NavBar>
    <Search>
      <h1>Menu Search</h1>
    </Search>
  </>
  )
}

export default MenuSearch

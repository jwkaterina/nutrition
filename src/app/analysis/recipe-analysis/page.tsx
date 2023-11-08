'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import NavBar from '@/app/components/nav-bar/nav-bar';
import NavbarStyles from '@/app/components/nav-bar/nav-bar.module.css';
import Search from '../components/search';

export const RecipeSearch = (): JSX.Element => {

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
      <div className={NavbarStyles.header}>Recipe Analysis</div>
    </NavBar>
      <Search>
        <h1>Recipe Search</h1>
      </Search>
    </>  )
}

export default RecipeSearch

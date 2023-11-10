'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import NavBar from '@/app/components/nav-bar/nav-bar';
import Search from '../components/search';
import AnalysisMenu from '@/app/components/nav-bar/menus/analysis-menu';

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
        <AnalysisMenu title="Food"/>
    </NavBar>
    <Search>
    <h1>Recipe Search</h1>
    </Search>
    </>  )
}

export default RecipeSearch

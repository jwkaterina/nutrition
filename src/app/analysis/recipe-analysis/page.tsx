'use client'

// import styles from './page.module.css'
// import { fetchNutritionAnalysisAPI } from '@/app/services/fetch-data'
import NavBar from '@/app/components/navigation/nav-bar';
import AnalysisMenu from '@/app/components/navigation/menus/analysis-menu';

const RecipeSearch = (): JSX.Element => {

  // const [data, setData] = useState({calories: 0});

  // useEffect(() => {
  //   async function fetchData() {

  //     const response = await fetchNutritionAnalysisAPI();
  //     console.log(response);
  //     setData(response);
  //   }
  //   fetchData();
  // }, []);

  const handleHeaderClick = () => {
    // console.log('header clicked');
  }

  return (<>
   	<NavBar color={'var(--secondary-color)'}>
        <AnalysisMenu title="Food" onHeaderClick={handleHeaderClick}/>
    </NavBar>
    <h1>Recipe Search</h1>
    </>  )
}

export default RecipeSearch

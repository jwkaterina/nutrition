import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedRecipe } from '@/app/types/types'
import RecipeCard from '../../cards/recipe-cards/recipe-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';

interface RecipeSlideProps {
}

const RecipeSlide = ({ }: RecipeSlideProps): JSX.Element => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [recipeList, setRecipeList] = useState<JSX.Element[]>([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if(!user) {
            return;
        }
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/recipes/user/${user}`
                );
                const recipeList = responseData.recipe.map((recipe: LoadedRecipe, index: number) => {
                    return (
                        <RecipeCard recipe={recipe.recipe} index={index + 1} key={index + 1} id={recipe.id} open={false}/>
                    )
                })
                setRecipeList(recipeList);
            } catch (err) {}
        };
        fetchRecipes();
    }, []);

    return (<>
         <Slide>
            {recipeList.length > 0 && recipeList}
            <Button search={'analysis/recipe-analysis'}/>
        </Slide>  
    </>)
}

export default RecipeSlide
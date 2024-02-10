import Slide from './slide'
import Button from '@/app/components/slider/button'
import { LoadedRecipe, StatusType } from '@/app/types/types'
import RecipeCard from '../../cards/recipe-cards/recipe-card'
import { useHttpClient } from '@/app/hooks/http-hook';
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '@/app/context/auth-context';
import { StatusContext } from '@/app/context/status-context'

interface RecipeSlideProps {
}

const RecipeSlide = ({ }: RecipeSlideProps): JSX.Element => {

    const { sendRequest } = useHttpClient();
    const [recipeList, setRecipeList] = useState<JSX.Element[]>([]);
    const { setIsLoading, setMessage, setStatus } = useContext(StatusContext);

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
            } catch (err) {
                setStatus(StatusType.ERROR);
                setMessage("Could not fetch recipe. Try again later.");
                setIsLoading(false);
                throw err;
            }
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
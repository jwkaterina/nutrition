import { useEffect, useState, useContext } from 'react';
import Button from '@/app/components/slider/button';
import RecipeCard from '../../cards/recipe-cards/recipe-card';
import Slide from './slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import { LoadedRecipe } from '@/app/types/types';

const RecipeSlide = (): JSX.Element => {

    const { token } = useContext(AuthContext);
    const { sendRequest } = useHttpClient();
    const [recipeList, setRecipeList] = useState<JSX.Element[]>([]);

    useEffect(() => {
        if(!token) {
            setRecipeList([]);
            return;
        }
        const fetchRecipes = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5001/recipes`,'GET', null, {
                        Authorization: 'Bearer ' + token
                      }
                );
                const recipeList = responseData.recipe.map((recipe: LoadedRecipe, index: number) => {
                    return (
                        <RecipeCard recipe={recipe.recipe} image={recipe.image && `http://localhost:5001/${recipe.image}`} index={index + 1} key={index + 1} id={recipe.id} open={false}/>
                    )
                })
                setRecipeList(recipeList);
            } catch (err) {}
        };
        fetchRecipes();
    }, [token]);

    return (
         <Slide>
            {recipeList.length > 0 && recipeList}
            <Button search={'analysis/recipe-analysis'}/>
        </Slide>  
    );
}

export default RecipeSlide;
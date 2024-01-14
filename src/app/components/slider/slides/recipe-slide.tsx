import Slide from './slide'
import Button from '@/app/components/slider/button'

interface RecipeSlideProps {
    recipeDeleted: boolean
}

const RecipeSlide = ({ recipeDeleted }: RecipeSlideProps): JSX.Element => {

    return (
        <Slide>
            {/* {recipeList} */}
            <Button search={'analysis/recipe-analysis'}/>
        </Slide>    
    )
}

export default RecipeSlide
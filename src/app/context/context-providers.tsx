import { FoodProvider, CurrentFoodProvider } from './food-context'
import { RecipeProvider } from './recipe-context'
import { MenuProvider } from './menu-context'
import { CardOpenProvider } from './card-context'
import { SlideProvider } from './slide-context'

export default function ContextProviders({ children }: any) {

    return (
      <FoodProvider>
        <RecipeProvider>
            <MenuProvider>
                <CardOpenProvider>
                  <CurrentFoodProvider>
                    <SlideProvider>
                      {children} 
                    </SlideProvider>
                  </CurrentFoodProvider>
                </CardOpenProvider>
            </MenuProvider>
        </RecipeProvider>
      </FoodProvider>
    );
  }
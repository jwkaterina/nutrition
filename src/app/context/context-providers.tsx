import { FoodProvider, CurrentFoodProvider } from './food-context'
import { RecipeProvider } from './recipe-context'
import { MenuProvider } from './menu-context'
import { CardOpenProvider } from './card-context'

export default function ContextProviders({ children }: any) {

    return (
      <FoodProvider>
        <RecipeProvider>
            <MenuProvider>
                <CardOpenProvider>
                  <CurrentFoodProvider>
                    {children}
                  </CurrentFoodProvider>
                </CardOpenProvider>
            </MenuProvider>
        </RecipeProvider>
      </FoodProvider>
    );
  }
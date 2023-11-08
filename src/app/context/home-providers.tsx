import { FoodProvider } from './food-context'
import { RecipeProvider } from './recipe-context'
import { MenuProvider } from './menu-context'

export default function HomeProviders({ children }: any) {

    return (
      <FoodProvider>
        <RecipeProvider>
            <MenuProvider>
                    {children}
            </MenuProvider>
        </RecipeProvider>
      </FoodProvider>
    );
  }
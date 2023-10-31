import { FoodProvider } from './food-context'
import { RecipeProvider } from './recipe-context'
import { MenuProvider } from './menu-context'
import { CardOpenProvider } from './card-context'

export default function HomeProviders({ children }: any) {

    return (
      <FoodProvider>
        <RecipeProvider>
            <MenuProvider>
                <CardOpenProvider>
                    {children}
                </CardOpenProvider>
            </MenuProvider>
        </RecipeProvider>
      </FoodProvider>
    );
  }
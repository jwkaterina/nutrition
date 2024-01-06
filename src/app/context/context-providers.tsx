import { CurrentFoodProvider } from './food-context'
import { RecipeProvider } from './recipe-context'
import { MenuProvider } from './menu-context'
import { CardOpenProvider } from './card-context'
import { SlideProvider } from './slide-context'
import { AuthProvider } from './auth-context'

export default function ContextProviders({ children }: any) {

    return (
      <RecipeProvider>
          <MenuProvider>
              <CardOpenProvider>
                <CurrentFoodProvider>
                  <SlideProvider>
                    <AuthProvider>
                      {children} 
                    </AuthProvider>
                  </SlideProvider>
                </CurrentFoodProvider>
              </CardOpenProvider>
          </MenuProvider>
      </RecipeProvider>
    );
  }
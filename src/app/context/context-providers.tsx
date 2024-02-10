import { CurrentFoodProvider } from './food-context'
import { CurrentRecipeProvider } from './recipe-context'
import { CurrentMenuProvider } from './menu-context'
import { CardOpenProvider } from './card-context'
import { SlideProvider } from './slide-context'
import { AuthProvider } from './auth-context'
import { StatusProvider } from './status-context'

export default function ContextProviders({ children }: any) {

    return (
        <CurrentRecipeProvider>
            <CurrentMenuProvider>
                <CardOpenProvider>
                    <CurrentFoodProvider>
                        <SlideProvider>
                            <AuthProvider>
                                <StatusProvider>
                                    {children} 
                                </StatusProvider>
                            </AuthProvider>
                        </SlideProvider>
                    </CurrentFoodProvider>
                </CardOpenProvider>
            </CurrentMenuProvider>
        </CurrentRecipeProvider>
    );
  }
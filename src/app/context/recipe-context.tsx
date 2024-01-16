import { createContext, useState, useMemo } from 'react';
import { Recipe } from '@/app/types/types';

interface CurrentRecipe  {
    recipe: Recipe | null,
    id: string | null
}

interface CurrentRecipeContextProps {
    currentRecipe: CurrentRecipe,
    setCurrentRecipe: React.SetStateAction<any>
}

export const CurrentRecipeContext = createContext<CurrentRecipeContextProps>({
    currentRecipe: {
        recipe: null,
        id: null
    },
    setCurrentRecipe: () => {}
});

export const CurrentRecipeProvider = ({ children }: any) => {
    const [currentRecipe, setCurrentRecipe] = useState<CurrentRecipe>({
        recipe: null,
        id: null
    });

    const contextValue = useMemo(() => ({
        currentRecipe,
        setCurrentRecipe
    }), [currentRecipe, setCurrentRecipe]);

  return (
    <CurrentRecipeContext.Provider value={contextValue}>
        {children}
    </CurrentRecipeContext.Provider>
  );
}
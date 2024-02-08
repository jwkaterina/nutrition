import { createContext, useState, useMemo } from 'react';
import { Recipe, AnalysisMode } from '@/app/types/types';

interface CurrentRecipe  {
    recipe: Recipe | null,
    id: string | null,
    mode: AnalysisMode
}

interface CurrentRecipeContextProps {
    currentRecipe: CurrentRecipe,
    setCurrentRecipe: React.SetStateAction<any>
}

export const CurrentRecipeContext = createContext<CurrentRecipeContextProps>({
    currentRecipe: {
        recipe: null,
        id: null,
        mode: AnalysisMode.VIEW
    },
    setCurrentRecipe: () => {}
});

export const CurrentRecipeProvider = ({ children }: any) => {
    const [currentRecipe, setCurrentRecipe] = useState<CurrentRecipe>({
        recipe: null,
        id: null,
        mode: AnalysisMode.VIEW
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
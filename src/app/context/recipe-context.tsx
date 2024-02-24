import { createContext, useState, useMemo } from 'react';
import { CurrentRecipe, AnalysisMode } from '@/app/types/types';

interface CurrentRecipeContextProps {
    currentRecipe: CurrentRecipe,
    setCurrentRecipe: React.SetStateAction<any>
}

export const CurrentRecipeContext = createContext<CurrentRecipeContextProps>({
    currentRecipe: {
        recipe: null,
        id: null,
        image: null,
        mode: AnalysisMode.VIEW
    },
    setCurrentRecipe: () => {}
});

export const CurrentRecipeProvider = ({ children }: any) => {
    const [currentRecipe, setCurrentRecipe] = useState<CurrentRecipe>({
        recipe: null,
        id: null,
        image: null,
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
import { createContext, useState } from 'react';
import { Nutrients } from '@/app/types/types';

interface CurrentRecipe  {
  recipe: Nutrients | null,
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

  return (
    <CurrentRecipeContext.Provider value={{
      currentRecipe,
      setCurrentRecipe
    }}>
        {children}
    </CurrentRecipeContext.Provider>
  );
}
"use client"

import { createContext, useState } from 'react';
import { Food } from '@/app/types/types';

interface CurrentFood  {
  food: Food | null,
  id: string | null
}

interface CurrentFoodContextProps {
  currentFood: CurrentFood,
  setCurrentFood: React.SetStateAction<any>
}

export const CurrentFoodContext = createContext<CurrentFoodContextProps>({
  currentFood: {
    food: null,
    id: null
  },
  setCurrentFood: () => {}
});

export const CurrentFoodProvider = ({ children }: any) => {
  const [currentFood, setCurrentFood] = useState<CurrentFood>({
    food: null,
    id: null
  });

  return (
    <CurrentFoodContext.Provider value={{
      currentFood,
      setCurrentFood
    }}>
        {children}
    </CurrentFoodContext.Provider>
  );
}
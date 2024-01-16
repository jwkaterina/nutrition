import { createContext, useState, useMemo } from 'react';
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

    const contextValue = useMemo(() => ({
        currentFood,
        setCurrentFood
    }), [currentFood, setCurrentFood]);

    return (
        <CurrentFoodContext.Provider value={contextValue}>
            {children}
        </CurrentFoodContext.Provider>
  );
}
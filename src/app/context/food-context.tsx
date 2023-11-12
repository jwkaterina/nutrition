"use client"

import { createContext, useReducer, useContext, useState } from 'react';
import { Food } from '@/app/types/types';
import { FoodReducer } from './food-reducer';

let initialFood: Food[];
// localStorage.clear();
if(localStorage.getItem('food')) {
  initialFood = JSON.parse(localStorage.getItem('food')!)
} else {
    initialFood = [];
    localStorage.setItem('food', JSON.stringify(initialFood))
}

const FoodContext = createContext<Food[]>(initialFood);

const FoodDispatchContext = createContext((() => {}) as React.Dispatch<any>);

export const FoodProvider = ({ children }: any) => {
  const [food, dispatch] = useReducer(FoodReducer, initialFood);

  return (
    <FoodContext.Provider value={food}>
      <FoodDispatchContext.Provider value={dispatch}>
        {children}
      </FoodDispatchContext.Provider>
    </FoodContext.Provider>
  );
}

export const useFood = () => {
  return useContext(FoodContext);
}
  
export const  useFoodDispatch = () => {
  return useContext(FoodDispatchContext);
}

export const CurrentFoodContext = createContext<string| null>(null);

export const SetCurrentFoodContext = createContext((() => {}) as React.Dispatch<any>);

export const CurrentFoodProvider = ({ children }: any) => {
  const [currentFood, setCurrentFood] = useState<string | null>(null);

  return (
    <CurrentFoodContext.Provider value={currentFood}>
      <SetCurrentFoodContext.Provider value={setCurrentFood}>
        {children}
      </SetCurrentFoodContext.Provider>
    </CurrentFoodContext.Provider>
  );
}
"use client"

import { createContext, useReducer, useContext, useState } from 'react';
import { Food } from '@/app/types/types';
import { FoodReducer } from './food-reducer';
import { getItemFromLocalStorage, setToLocalStorage } from '../services/local-storage';

let initialFood: Food[];

const item = getItemFromLocalStorage('food');
if(item) {
  initialFood = item;
} else {
    initialFood = [];
    setToLocalStorage('food', initialFood);
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

export const CurrentFoodContext = createContext<Food | null>(null);

export const SetCurrentFoodContext = createContext((() => {}) as React.Dispatch<any>);

export const CurrentFoodProvider = ({ children }: any) => {
  const [currentFood, setCurrentFood] = useState<Food | null>(null);

  return (
    <CurrentFoodContext.Provider value={currentFood}>
      <SetCurrentFoodContext.Provider value={setCurrentFood}>
        {children}
      </SetCurrentFoodContext.Provider>
    </CurrentFoodContext.Provider>
  );
}
"use client"

import { createContext, useReducer, useContext} from 'react';
import { FoodProp } from '@/app/types/types';
import { FoodReducer } from './food-reducer';

let initialFood: FoodProp[];
if(localStorage.getItem('food')) {
  initialFood = JSON.parse(localStorage.getItem('food')!)
} else {
    initialFood = [];
    localStorage.setItem('food', JSON.stringify(initialFood))
}

const FoodContext = createContext<FoodProp[]>(initialFood);

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
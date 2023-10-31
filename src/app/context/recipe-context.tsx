"use client"

import { createContext, useReducer, useContext} from 'react';
import { RecipeProp } from '@/app/types/types';
import RecipeList from '@/app/data-base/recipe-list';
import { RecipeReducer } from './recipe-reducer';

let initialRecipes: RecipeProp[];
if(localStorage.getItem('recipes')) {
  initialRecipes = JSON.parse(localStorage.getItem('recipes')!)
} else {
    initialRecipes = RecipeList;
    localStorage.setItem('recipes', JSON.stringify(initialRecipes))
}

const RecipeContext = createContext<RecipeProp[]>(initialRecipes);

const RecipeDispatchContext = createContext((() => {}) as React.Dispatch<any>);

export const RecipeProvider = ({ children }: any) => {
  const [recipes, dispatch] = useReducer(RecipeReducer, initialRecipes);

  return (
    <RecipeContext.Provider value={recipes}>
      <RecipeDispatchContext.Provider value={dispatch}>
        {children}
      </RecipeDispatchContext.Provider>
    </RecipeContext.Provider>
  );
}

export const useRecipe = () => {
  return useContext(RecipeContext);
}
  
export const  useRecipeDispatch = () => {
  return useContext(RecipeDispatchContext);
}
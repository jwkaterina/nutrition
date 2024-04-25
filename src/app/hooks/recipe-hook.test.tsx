import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRecipeFetch } from './recipe-hook';
import { StatusContext } from '../context/status-context';
import { StatusType } from '../types/types';
import menu from '@/app/test_objects/menu1.json';
import { useHttpClient } from '@/app/hooks/http-hook';
import { RecipeNutrientsCalculator } from './utils/nutrients-calculator';

jest.mock('./utils/nutrients-calculator');

jest.mock('./http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('menu-hook', () => {

    it('should render hook', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: jest.fn()
        });

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useRecipeFetch(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const fetchRecipeNutrients =  result.current.fetchRecipeNutrients;
        await fetchRecipeNutrients(menu.menu.ingredients);
        expect(RecipeNutrientsCalculator).toHaveBeenCalled();
        expect(status.setMessage).not.toHaveBeenCalled();
    })

    it('should render hook with error', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: async() => {throw new Error()}
        });

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useRecipeFetch(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const fetchRecipeNutrients =  result.current.fetchRecipeNutrients;
        await expect(fetchRecipeNutrients(menu.menu.ingredients)).rejects.toThrow(Error);
        expect(RecipeNutrientsCalculator).not.toHaveBeenCalled();
        expect(status.setMessage).toHaveBeenCalledWith('Could not analyse. Ensure that all ingredients are spelled correctly and try again.');
    })

})
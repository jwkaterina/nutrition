import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useMenuFetch } from './menu-hook';
import { StatusContext } from '../context/status-context';
import { StatusType } from '../types/types';
import menu from '@/app/test_objects/menu1.json';
import nutrients from '@/app/test_objects/nutrients1.json';

jest.mock('./recipe-hook', () => ({
    useRecipeFetch: jest.fn().mockReturnValue({
        fetchRecipeNutrients: () => nutrients,
    })
}));

describe('menu-hook', () => {

    it('should render hook', async() => {

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useMenuFetch(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const fetchMenuNutrients =  result.current.fetchMenuNutrients;
        await fetchMenuNutrients(menu.menu.ingredients,menu.menu.recipes);
        expect(status.setStatus).not.toHaveBeenCalled();
        expect(status.setMessage).not.toHaveBeenCalled();
    })

    it('should render hook with error', async() => {

        const status = {
            isLoading: false,
            setIsLoading: jest.fn(),
            status: StatusType.SUCCESS,
            setStatus: jest.fn(),
            message: null,
            setMessage: jest.fn()
        };
        const { result } = renderHook(() => useMenuFetch(), {
            wrapper: ({ children }) => <StatusContext.Provider value={status}>{children}</StatusContext.Provider>,
          });

        const fetchMenuNutrients =  result.current.fetchMenuNutrients;
        await fetchMenuNutrients([], []);
        expect(status.setStatus).toHaveBeenCalledWith(StatusType.ERROR);
        expect(status.setMessage).toHaveBeenCalledWith('Could not analyse menu. Choose at least one recipe or ingredient and try again.');
    })

})
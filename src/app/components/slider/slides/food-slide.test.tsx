import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSlide from './food-slide';
import { AuthContext } from '@/app/context/auth-context';
import FoodCard from '../../cards/food-cards/food-card';
import foodArray from '@/app/test_objects/foodsArray.json';
import useSWR from 'swr';

jest.mock('../../cards/food-cards/food-card');
jest.mock('swr');

describe('food slide', () => {

    const props = { foodDeleted: false };

    const renderWithAuth = (token: string | null) => {
        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <FoodSlide {...props}/>
            </AuthContext.Provider>
        );
        return container;
    };

    it('should render food slide whithout token', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        renderWithAuth(null);
        expect(useSWR).toHaveBeenCalledWith(null, expect.any(Function));
        expect(FoodCard).not.toHaveBeenCalled();
    });

    it('should render food slide whith token', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined });
        const token = 'token';
        renderWithAuth(token);
        expect(useSWR).toHaveBeenCalledWith(['/foods', token, false], expect.any(Function));
    });

    it('should render food slide whith token and foodlist', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: foodArray });
        const token = 'token';
        renderWithAuth(token);
        expect(FoodCard).toHaveBeenCalledTimes(foodArray.foods.length);
    });

    it('should render food slide whith error', () => {
        (useSWR as jest.Mock).mockReturnValue({ data: undefined, error: new Error() });
        const token = 'token';
        renderWithAuth(token);
        expect(FoodCard).not.toHaveBeenCalled();
    });
})

import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSlide from './food-slide';
import { AuthContext } from '@/app/context/auth-context';
import { useHttpClient } from '@/app/hooks/http-hook';
import FoodCard from '../../cards/food-cards/food-card';
import foodArray from '@/app/test_objects/foodsArray.json';

jest.mock('../../cards/food-cards/food-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

describe('food slide', () => {

    const props = {
        foodDeleted: false
    }

    const renderWithAuth = (token: string | null) => {

        const { container } = render(
            <AuthContext.Provider value={{
                isLoggedIn: true,
                token: token,
                login: jest.fn(),
                logout: jest.fn()
            }}>
                <FoodSlide { ...props }/>
            </AuthContext.Provider>
        );

            return container;

    }
       
    it('should render food slide whithout token', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        renderWithAuth(null);

        expect(FoodCard).not.toHaveBeenCalled();
        expect(sendRequest).not.toHaveBeenCalled();
    })
       
    it('should render food slide whith token', async() => {

        const sendRequest = jest.fn();
        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: sendRequest
        });
        const token = 'token';
        renderWithAuth(token);

        expect(sendRequest).toHaveBeenCalledWith(
            `/foods`, 'GET', null, {
                Authorization: 'Bearer ' + token
            }, true, false
        );

    })
       
    it('should render food slide whith token and foodlist', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: () => {return foodArray}
        });
        const token = 'token';
        const slideContainer = renderWithAuth(token);
        const slide = slideContainer.querySelector('.slide');

        await waitFor(() => expect(slide).toBeInTheDocument());
        expect(FoodCard).toHaveBeenCalledTimes(foodArray.foods.length);

    })
       
    it('should render food slide whith error', async() => {

        (useHttpClient as jest.Mock).mockReturnValue({
            sendRequest: () => { throw new Error()}
        });
        const token = 'token';
        renderWithAuth(token);

        expect(FoodCard).not.toHaveBeenCalled();

    })

})
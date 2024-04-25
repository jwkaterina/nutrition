import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Toast from './toast';
import { StatusContext } from '@/app/context/status-context';
import { StatusType } from '@/app/types/types';

describe('toast', () => {

    HTMLDivElement.prototype.animate = jest.fn();
    const mockAnimation = HTMLDivElement.prototype.animate;

    const setIsLoading = jest.fn();
    const setStatus = jest.fn();
    const setMessage = jest.fn();

    const renderWithStatus = (isLoading: boolean, status: StatusType, message: string | null) => {

        const { container } = render(
            <StatusContext.Provider value={{
                isLoading,
                setIsLoading,
                status,
                setStatus,
                message,
                setMessage
            }}>
                <Toast />
            </StatusContext.Provider>
        );

            return container;

    }
       
    it('should render toast without message', async() => {

        const toast = renderWithStatus(false, StatusType.SUCCESS, null);

        const checkIcon = toast.querySelector('.check');
        const failIcon = toast.querySelector('.fail');
        const closeIcon = toast.querySelector('.close');
        const status = toast.querySelector('.status');
        const message = toast.querySelector('.message');

        expect(checkIcon).toBeInTheDocument();
        expect(failIcon).not.toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(status).toHaveTextContent('Success');
        expect(message).toHaveTextContent('');
        expect(mockAnimation).not.toHaveBeenCalled();
    })
       
    it('should render toast with successfull message', async() => {

        const toast = renderWithStatus(false, StatusType.SUCCESS, 'Recipe deleted successfully');

        const checkIcon = toast.querySelector('.check');
        const failIcon = toast.querySelector('.fail');
        const closeIcon = toast.querySelector('.close');
        const status = toast.querySelector('.status');
        const message = toast.querySelector('.message');

        expect(checkIcon).toBeInTheDocument();
        expect(failIcon).not.toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(status).toHaveTextContent('Success');
        expect(message).toHaveTextContent('Recipe deleted successfully');
        expect(mockAnimation).toHaveBeenCalledWith([
            {width: '0%'},
            {width: '100%'}
        ], {
            duration: 4000,
            fill: 'forwards'
        });
        const messageTimeout = setTimeout(() => {
            expect(setMessage).toHaveBeenCalledWith(null);
        }, 4500);
    })
       
    it('should render toast with fail message', async() => {

        const toast = renderWithStatus(false, StatusType.ERROR, 'Could not delete recipe');

        const checkIcon = toast.querySelector('.check');
        const failIcon = toast.querySelector('.fail');
        const closeIcon = toast.querySelector('.close');
        const status = toast.querySelector('.status');
        const message = toast.querySelector('.message');

        expect(checkIcon).not.toBeInTheDocument();
        expect(failIcon).toBeInTheDocument();
        expect(closeIcon).toBeInTheDocument();
        expect(status).toHaveTextContent('Error');
        expect(message).toHaveTextContent('Could not delete recipe');
        expect(mockAnimation).toHaveBeenCalledWith([
            {width: '0%'},
            {width: '100%'}
        ], {
            duration: 4000,
            fill: 'forwards'
        });
        const messageTimeout = setTimeout(() => {
            expect(setMessage).toHaveBeenCalledWith(null);
        }, 4500);
    })
       
    it('should close on click', async() => {

        const toast = renderWithStatus(false, StatusType.ERROR, 'Could not delete recipe');

        const closeIcon = toast.querySelector('.close');
        
        await user.click(closeIcon!);
        setTimeout(() => {
            expect(setMessage).toHaveBeenCalledWith(null);
        }, 500);

    })

})
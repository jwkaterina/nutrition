import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import user from '@testing-library/user-event';
import MenuForm from './menu-form';
import { CurrentMenuContext, CurrentMenuContextProps } from '@/app/context/menu-context';
import { AuthContext } from '@/app/context/auth-context';
import { CardOpenContext } from '@/app/context/card-context';
import { AnalysisMode, CardState } from '@/app/types/types';
import menu from '@/app/test_objects/menu1.json';
import loadedRecipeWithID from '@/app/test_objects/loaded-recipe-withIDs.json';
import { useHttpClient } from '@/app/hooks/http-hook';
import MenuCard from '@/app/components/cards/menu-cards/menu-card';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn().mockReturnValue({
        push: jest.fn()
    })
}));

jest.mock('../../../components/cards/menu-cards/menu-card');

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

jest.mock('./ingredient-search', () => {
    return function MockIngredientSearch() {
        return <input type="text" aria-label="Ingredients" readOnly />;
    };
});

describe('menu-form', () => {
    const mockeduseHttpClient = useHttpClient as jest.Mock;

    const renderComponentWithCurrentMenuContext = (searchCleared: boolean, contextValue: CurrentMenuContextProps) => {

        const props = {
            searchCleared: searchCleared,
            setClearSearch: jest.fn()
        }

        render(
            <CurrentMenuContext.Provider value={contextValue}>
                <MenuForm {...props} />
            </CurrentMenuContext.Provider>);
    }

    it('should render menu-form in view mode', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const contextValue = {
            currentMenu: {
                menu: null,
                id: null,
                mode: AnalysisMode.VIEW
            },
            setCurrentMenu: jest.fn()
        }
        renderComponentWithCurrentMenuContext(false, contextValue);

        expect(screen.getByRole('textbox', { name: /menu name/i })).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /ingredients/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /add recipe/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('should render menu-form in edit mode', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const contextValue = {
            currentMenu: {
                menu: menu.menu,
                id: menu.id,
                mode: AnalysisMode.EDIT
            },
            setCurrentMenu: jest.fn()
        }
        renderComponentWithCurrentMenuContext(false, contextValue);

        expect(screen.getByRole('textbox', { name: /menu name/i })).toHaveValue(menu.menu.name);
        expect(screen.getByRole('button', { name: /add recipe/i })).toBeInTheDocument();
        expect(screen.getAllByRole('combobox')).toHaveLength(1);
        expect(screen.getAllByText(/\+/i)).toHaveLength(1);
        expect(screen.getByRole('button', { name: /analyze/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should submit menu with a selected recipe', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: () => {
            return {recipe: [loadedRecipeWithID]};
        }});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn()
        };

        const contextValue = {
            currentMenu: {
                menu: null,
                id: null,
                mode: AnalysisMode.VIEW
            },
            setCurrentMenu: jest.fn()
        }

        render(
            <CurrentMenuContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: true,
                    token: '123',
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <MenuForm {...props} />
                </AuthContext.Provider>
            </CurrentMenuContext.Provider>
        );

        await user.type(screen.getByRole('textbox', { name: /menu name/i }), menu.menu.name);
        await user.click(screen.getByRole('button', { name: /add recipe/i }));

        const input = screen.getByRole('combobox');
        const plusButton = screen.getByText(/\+/i);
        await user.selectOptions(input, loadedRecipeWithID.recipe.name);
        await user.click(plusButton);

        await user.click(screen.getByRole('button', { name: /analyze/i }));

        expect(contextValue.setCurrentMenu).toHaveBeenCalledWith(expect.objectContaining({
            menu: expect.objectContaining({ name: menu.menu.name }),
            id: null,
            mode: AnalysisMode.VIEW
        }));
    });

    it('should not delete menu if not logged in', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn()});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn(),
        };

        const contextValue = {
            currentMenu: {
                menu: menu.menu,
                id: menu.id,
                mode: AnalysisMode.EDIT
            },
            setCurrentMenu: jest.fn()
        }
        render(
            <CurrentMenuContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: false,
                    token: null,
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <MenuForm {...props} />
                </AuthContext.Provider>
            </CurrentMenuContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));

        expect(contextValue.setCurrentMenu).not.toHaveBeenCalled();
    });

    it('should delete menu when request is sent successfully', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn().mockResolvedValueOnce});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn()
        };

        const contextValue = {
            currentMenu: {
                menu: menu.menu,
                id: menu.id,
                mode: AnalysisMode.EDIT
            },
            setCurrentMenu: jest.fn()
        }
        render(
            <CurrentMenuContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: true,
                    token: '123',
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <MenuForm {...props} />
                </AuthContext.Provider>
            </CurrentMenuContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentMenu).toHaveBeenCalledWith({id: null, menu: null, mode: AnalysisMode.VIEW});
    });

    it('should not delete menu when request returns an error', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: async() => { throw new Error(); }});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn()
        };

        const contextValue = {
            currentMenu: {
                menu: menu.menu,
                id: menu.id,
                mode: AnalysisMode.EDIT
            },
            setCurrentMenu: jest.fn()
        }
        render(
            <CurrentMenuContext.Provider value={contextValue}>
                <AuthContext.Provider value={{
                    isLoggedIn: true,
                    token: '123',
                    login: jest.fn(),
                    logout: jest.fn()
                }}>
                    <MenuForm {...props} />
                </AuthContext.Provider>
            </CurrentMenuContext.Provider>
        );

        await user.click(screen.getByRole('button', { name: /delete/i }));
        expect(contextValue.setCurrentMenu).not.toHaveBeenCalled();
    });

    it('should reset menu', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn().mockResolvedValueOnce});

        const contextValue = {
            currentMenu: {
                menu: menu.menu,
                id: menu.id,
                mode: AnalysisMode.EDIT
            },
            setCurrentMenu: jest.fn()
        }

        renderComponentWithCurrentMenuContext(true, contextValue);

        expect(contextValue.setCurrentMenu).toHaveBeenCalledWith({
            menu: null,
            id: null,
            mode: AnalysisMode.VIEW
        });
    });

    it('should render menu card instead of form', () => {
        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn().mockResolvedValueOnce});

        const props = {
            searchCleared: false,
            setClearSearch: jest.fn()
        };

        render(
            <CurrentMenuContext.Provider value={{
                currentMenu: {
                    menu: menu.menu,
                    id: menu.id,
                    mode: AnalysisMode.VIEW
                },
                setCurrentMenu: jest.fn()
            }}>
                <CardOpenContext.Provider value={{
                    cardOpen: CardState.OPEN,
                    setCardOpen: jest.fn()
                }}>
                    <MenuForm {...props} />
                </CardOpenContext.Provider>
            </CurrentMenuContext.Provider>
        );

        expect(screen.queryByRole('form', { name: /form/i })).not.toBeInTheDocument();
        expect(MenuCard).toHaveBeenCalled();
    });
});

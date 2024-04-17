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

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../../components/cards/menu-cards/menu-card', () => jest.fn());

jest.mock('../../../hooks/http-hook', () => ({
    useHttpClient: jest.fn()
}));

jest.mock('../../../hooks/menu-hook', () => ({
    useMenuFetch: jest.fn().mockReturnValue({
        fetchMenuNutrients: () => menu.menu.nutrients
    }),
}));

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
        
        const name = screen.getByRole('textbox', {
            name: /menu name/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const addRecipe = screen.getByRole('button', {
            name: /add recipe/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });
        const deleteButton = screen.queryByRole('button', {
            name: /delete/i
        });
        expect(name).toBeInTheDocument();
        expect(ingredients).toBeInTheDocument();
        expect(addRecipe).toBeInTheDocument();
        expect(analyseButton).toBeInTheDocument();
        expect(deleteButton).not.toBeInTheDocument();
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
        
        const name = screen.getByRole('textbox', {
            name: /menu name/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const addRecipe = screen.getByRole('button', {
            name: /add recipe/i
        });
        const inputs = screen.getAllByRole('combobox');
        const numbers = screen.getAllByRole('spinbutton', {
            name: /servings/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });
        const deleteButton = screen.queryByRole('button', {
            name: /delete/i
        });
        expect(name).toHaveValue(menu.menu.name);
        expect(ingredients).toHaveTextContent(menu.menu.ingredients.join('\n'));
        expect(addRecipe).toBeInTheDocument();
        expect(inputs).toHaveLength(1);
        expect(numbers).toHaveLength(1);
        expect(analyseButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
    });

    it('should sumbit new menu when logged in', async() => {
        mockeduseHttpClient.mockReturnValue({sendRequest: () => {
            return {recipe: [loadedRecipeWithID]}
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

        const name = screen.getByRole('textbox', {
            name: /menu name/i
        });
        const ingredients = screen.getByRole('textbox', {
            name: /ingredients/i
        });
        const addRecipe = screen.getByRole('button', {
            name: /add recipe/i
        });
        const analyseButton = screen.getByRole('button', {
            name: /analyze/i
        });
       

        await user.type(name, menu.menu.name);
        await user.type(ingredients, menu.menu.ingredients.toString());
        await user.click(addRecipe);
        screen.logTestingPlaygroundURL();

        const input = screen.getByRole('combobox');
        const number = screen.getByRole('spinbutton', {
            name: /servings/i
        });
        expect(input).toBeInTheDocument();
        expect(number).toBeInTheDocument();
        await user.selectOptions(input, loadedRecipeWithID.recipe.name);

        await user.clear(number);
        await user.type(number, '1');
        await user.click(analyseButton);

        expect(contextValue.setCurrentMenu).toHaveBeenCalledWith({
            menu: menu.menu,
            id: null,
            mode: AnalysisMode.VIEW
        });
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        await user.click(deleteButton);

        expect(contextValue.setCurrentMenu).not.toHaveBeenCalled();
    });

    it('should delete menu when request is sent successfulle', async() => {
   
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        // Comment "router.push('/');" in code in order to run test successfully

        await user.click(deleteButton);
        expect(contextValue.setCurrentMenu).toHaveBeenCalledWith({id: null, menu: null, mode: AnalysisMode.VIEW});
    });

    it('should not delete menu when request returns an error', async() => {
   
        mockeduseHttpClient.mockReturnValue({sendRequest: async() => {
            throw new Error
        }});
        
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

        const deleteButton = screen.getByRole('button', {
            name: /delete/i
        });

        await user.click(deleteButton);
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
        })
    });

    it('should render menu card instead of form', () => {

        mockeduseHttpClient.mockReturnValue({sendRequest: jest.fn().mockResolvedValueOnce});

        const props = {
            searchCleared: false, 
            setClearSearch: jest.fn()
        };
        
        const { container } = render(
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

        const form = screen.queryByRole('form', {
            name: /form/i
        });
        const cardContainer = container.querySelector('.card_container');

        expect(form).not.toBeInTheDocument();
        expect(cardContainer).toBeInTheDocument();
        
    });

});
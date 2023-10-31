import { MenuProp } from "@/app/types/types";

type ACTIONTYPE = { 
    type: 'delete',
    index: number
}

export const  MenuReducer = (menus: MenuProp[], action: ACTIONTYPE) => {
    switch (action.type) {
        case 'delete': {
            const newMenus = menus.filter((menus, i) => i != action.index);
            saveRecipe(newMenus);
            return newMenus;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

const saveRecipe = (menus: MenuProp[]) => {
    localStorage.setItem('menus', JSON.stringify(menus));
}
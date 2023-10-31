"use client"

import { createContext, useReducer, useContext} from 'react';
import { MenuProp } from '@/app/types/types';
import MenuList from '@/app/data-base/menu-list';
import { MenuReducer } from './menu-reducer';

let initialMenu: MenuProp[];
if(localStorage.getItem('menus')) {
  initialMenu = JSON.parse(localStorage.getItem('menus')!)
} else {
    initialMenu = MenuList;
    localStorage.setItem('menus', JSON.stringify(initialMenu))
}

const MenuContext = createContext<MenuProp[]>(initialMenu);

const MenuDispatchContext = createContext((() => {}) as React.Dispatch<any>);

export const MenuProvider = ({ children }: any) => {
  const [menu, dispatch] = useReducer(MenuReducer, initialMenu);

  return (
    <MenuContext.Provider value={menu}>
      <MenuDispatchContext.Provider value={dispatch}>
        {children}
      </MenuDispatchContext.Provider>
    </MenuContext.Provider>
  );
}

export const useMenu = () => {
  return useContext(MenuContext);
}
  
export const  useMenuDispatch = () => {
  return useContext(MenuDispatchContext);
}